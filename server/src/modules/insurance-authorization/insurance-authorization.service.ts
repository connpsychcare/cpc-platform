import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  InsuranceAuthorizationDto,
  UpdateInsuranceAuthorizationDto,
  InsuranceAuthorizationQueryDto,
} from "@workspace/contracts/insurance-authorization/dto";
import type { Prisma } from "@workspace/db/client";
import { Decimal } from "@prisma/client/runtime/client.js";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { ProviderService } from "@/modules/provider/provider.service";
import { CaregiverAccessService } from "@/modules/caregiver-access/caregiver-access.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

@Injectable()
export class InsuranceAuthorizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly caregiverAccessService: CaregiverAccessService,
  ) {}

  async create(dto: InsuranceAuthorizationDto, currentUser: AuthUser) {
    this.assertInternalEditor(currentUser);

    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId },
    });
    if (!patient) throw new NotFoundException("Patient not found.");
    await this.assertPatientAccess(dto.patientId, currentUser);

    const authorization = await this.prisma.insuranceAuthorization.create({
      data: {
        patientId: dto.patientId,
        treatmentPlanId: dto.treatmentPlanId ?? null,
        insurancePlan: dto.insurancePlan,
        authorizationNumber: dto.authorizationNumber,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        approvedHours: new Decimal(dto.approvedHours),
        usedHours:
          dto.usedHours != null ? new Decimal(dto.usedHours) : new Decimal(0),
        status: dto.status ?? "active",
        notes: dto.notes ?? null,
      },
      include: this.include,
    });

    return {
      message: "Insurance authorization created.",
      data: this.withDerived(authorization),
    };
  }

  async list(query: InsuranceAuthorizationQueryDto, currentUser: AuthUser) {
    const { page = 1, limit = 10, patientId, treatmentPlanId, status, includeIds = [] } = query;

    const accessWhere = await this.buildAccessWhere(currentUser);
    const where: Prisma.InsuranceAuthorizationWhereInput = {
      ...(patientId && { patientId }),
      ...(treatmentPlanId && { treatmentPlanId }),
      ...(status && { status }),
      ...accessWhere,
    };

    const [items, total] = await Promise.all([
      this.prisma.insuranceAuthorization.findMany({
        where,
        include: this.include,
        orderBy: { startDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.insuranceAuthorization.count({ where }),
    ]);
    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.insuranceAuthorization.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...accessWhere,
          },
          include: this.include,
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Insurance authorizations fetched successfully.",
      data: {
        authorizations: mergedItems.map((a) => this.withDerived(a)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const authorization = await this.prisma.insuranceAuthorization.findUnique({
      where: { id },
      include: this.include,
    });
    if (!authorization) throw new NotFoundException("Authorization not found.");
    await this.assertRecordAccess(authorization.patientId, currentUser);
    return {
      message: "Authorization fetched successfully.",
      data: this.withDerived(authorization),
    };
  }

  async update(
    id: string,
    dto: UpdateInsuranceAuthorizationDto,
    currentUser: AuthUser,
  ) {
    this.assertInternalEditor(currentUser);

    const authorization = await this.prisma.insuranceAuthorization.findUnique({
      where: { id },
    });
    if (!authorization) throw new NotFoundException("Authorization not found.");
    await this.assertPatientAccess(authorization.patientId, currentUser);

    const updated = await this.prisma.insuranceAuthorization.update({
      where: { id },
      data: {
        ...(dto.treatmentPlanId !== undefined && {
          treatmentPlanId: dto.treatmentPlanId ?? null,
        }),
        ...(dto.insurancePlan && { insurancePlan: dto.insurancePlan }),
        ...(dto.authorizationNumber && {
          authorizationNumber: dto.authorizationNumber,
        }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.approvedHours != null && {
          approvedHours: new Decimal(dto.approvedHours),
        }),
        ...(dto.usedHours != null && {
          usedHours: new Decimal(dto.usedHours),
        }),
        ...(dto.status && { status: dto.status }),
        ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
      },
      include: this.include,
    });

    return {
      message: "Authorization updated.",
      data: this.withDerived(updated),
    };
  }

  async remove(id: string, currentUser: AuthUser) {
    if (currentUser.role !== "admin")
      throw new ForbiddenException("Admin only.");

    const authorization = await this.prisma.insuranceAuthorization.findUnique({
      where: { id },
    });
    if (!authorization) throw new NotFoundException("Authorization not found.");

    await this.prisma.insuranceAuthorization.delete({ where: { id } });
    return { message: "Authorization deleted." };
  }

  private async buildAccessWhere(
    currentUser: AuthUser,
  ): Promise<Prisma.InsuranceAuthorizationWhereInput> {
    if (currentUser.role === "admin") return {};
    if (currentUser.role === "staff") {
      // Reached either as the patient's appointment provider or via caseload.
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      return {
        patient: {
          OR: [
            ...(provider
              ? [{ appointments: { some: { providerId: provider.id } } }]
              : []),
            {
              staffAssignments: {
                some: { staffId: currentUser.id, isActive: true },
              },
            },
          ],
        },
      };
    }
    // patient role - own record only
    return {
      patient: { userId: currentUser.id },
    };
  }

  private async assertPatientAccess(patientId: string, currentUser: AuthUser) {
    if (currentUser.role === "admin") return;
    if (currentUser.role === "staff") {
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (provider) {
        const appointment = await this.prisma.appointment.findFirst({
          where: { patientId, providerId: provider.id },
          select: { id: true },
        });
        if (appointment) return;
      }

      const assignment = await this.prisma.staffAssignment.findFirst({
        where: { staffId: currentUser.id, patientId, isActive: true },
        select: { id: true },
      });
      if (!assignment) throw new ForbiddenException("Access denied.");
      return;
    }
    const profile = await this.prisma.patientProfile.findFirst({
      where: { id: patientId, userId: currentUser.id },
      select: { id: true },
    });
    if (profile) return;
    const hasCaregiverAccess = await this.caregiverAccessService.checkAccess(
      currentUser.id,
      patientId,
    );
    if (!hasCaregiverAccess) throw new ForbiddenException("Access denied.");
  }

  private async assertRecordAccess(patientId: string, currentUser: AuthUser) {
    await this.assertPatientAccess(patientId, currentUser);
  }

  private withDerived(auth: {
    approvedHours: Decimal;
    usedHours: Decimal;
    [key: string]: any;
  }) {
    const approved = Number(auth.approvedHours);
    const used = Number(auth.usedHours);
    const remaining = approved - used;
    const nearingLimit = used >= approved * 0.8;
    return {
      ...auth,
      approvedHours: auth.approvedHours.toString(),
      usedHours: auth.usedHours.toString(),
      remainingHours: remaining.toFixed(2),
      nearingLimit,
    };
  }

  private assertInternalEditor(currentUser: AuthUser) {
    if (currentUser.role !== "admin" && currentUser.role !== "staff") {
      throw new ForbiddenException("Internal access required.");
    }
  }

  private include = {
    patient: {
      include: {
        user: { select: { displayName: true, email: true } },
      },
    },
    treatmentPlan: { select: { id: true, title: true } },
  } satisfies Prisma.InsuranceAuthorizationInclude;
}
