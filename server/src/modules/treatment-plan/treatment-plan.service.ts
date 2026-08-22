import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  TreatmentPlanDto,
  TreatmentPlanQueryDto,
} from "@workspace/contracts/treatment-plan/dto";
import type { Prisma } from "@workspace/db/client";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { ProviderService } from "@/modules/provider/provider.service";
import { CaregiverAccessService } from "@/modules/caregiver-access/caregiver-access.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

@Injectable()
export class TreatmentPlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly caregiverAccessService: CaregiverAccessService,
  ) {}

  async create(dto: TreatmentPlanDto, currentUser: AuthUser) {
    // Validate patient exists
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId },
    });
    if (!patient) throw new NotFoundException("Patient not found.");

    const providerId =
      currentUser.role === "staff"
        ? (await this.providerService.findByUserIdOrThrow(currentUser.id)).id
        : (dto.providerId ?? null);

    const plan = await this.prisma.treatmentPlan.create({
      data: {
        patientId: dto.patientId,
        createdById: currentUser.id,
        providerId,
        title: dto.title,
        description: dto.description ?? null,
        goals: dto.goals ?? null,
        status: dto.status ?? "draft",
        startDate: dto.startDate ?? null,
        endDate: dto.endDate ?? null,
      },
      include: this.include,
    });

    return { message: "Treatment plan created successfully.", data: plan };
  }

  async list(query: TreatmentPlanQueryDto, currentUser: AuthUser) {
    const { page = 1, limit = 10, patientId, status, search, includeIds = [] } = query;

    const baseWhere = await this.buildAccessWhere(currentUser, patientId);

    const where: Prisma.TreatmentPlanWhereInput = {
      ...baseWhere,
      ...(status && { status }),
      ...(search && {
        title: { contains: search, mode: "insensitive" },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.treatmentPlan.findMany({
        where,
        include: this.include,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.treatmentPlan.count({ where }),
    ]);
    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.treatmentPlan.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...baseWhere,
          },
          include: this.include,
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Treatment plans fetched successfully.",
      data: {
        treatmentPlans: mergedItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const plan = await this.prisma.treatmentPlan.findUnique({
      where: { id },
      include: {
        ...this.include,
        programs: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!plan) throw new NotFoundException("Treatment plan not found.");
    await this.assertAccess(plan, currentUser);
    return { message: "Treatment plan fetched successfully.", data: plan };
  }

  async update(id: string, dto: Partial<TreatmentPlanDto>, currentUser: AuthUser) {
    const plan = await this.prisma.treatmentPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException("Treatment plan not found.");
    await this.assertAccess(plan, currentUser);

    const updated = await this.prisma.treatmentPlan.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description ?? null }),
        ...(dto.goals !== undefined && { goals: dto.goals ?? null }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.providerId !== undefined && { providerId: dto.providerId ?? null }),
        ...(dto.startDate !== undefined && { startDate: dto.startDate ?? null }),
        ...(dto.endDate !== undefined && { endDate: dto.endDate ?? null }),
      },
      include: this.include,
    });

    return { message: "Treatment plan updated successfully.", data: updated };
  }

  async remove(id: string, currentUser: AuthUser) {
    const plan = await this.prisma.treatmentPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException("Treatment plan not found.");
    await this.assertAccess(plan, currentUser);
    await this.prisma.treatmentPlan.delete({ where: { id } });
    return { message: "Treatment plan deleted successfully." };
  }

  // ----- Access helpers -----

  private async buildAccessWhere(
    currentUser: AuthUser,
    patientId?: string,
  ): Promise<Prisma.TreatmentPlanWhereInput> {
    if (currentUser.role === "admin") {
      return patientId ? { patientId } : {};
    }

    if (currentUser.role === "staff") {
      // Reached as the plan's supervising provider, as its author, or through
      // an active caseload assignment on the patient.
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      return {
        ...(patientId ? { patientId } : {}),
        OR: [
          ...(provider ? [{ providerId: provider.id }] : []),
          { createdById: currentUser.id },
          {
            patient: {
              staffAssignments: {
                some: { staffId: currentUser.id, isActive: true },
              },
            },
          },
        ],
      };
    }

    // Patient - their own plans plus any patient they hold caregiver access to.
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    const caregiverIds =
      await this.caregiverAccessService.getCaregiverPatientIds(currentUser.id);
    const allPatientIds = [patient.id, ...caregiverIds];

    // A requested patient has to narrow the result, not be ignored. Without
    // this, opening a linked child's records returned every record the caregiver
    // could reach, so the child's page showed the parent's plans.
    if (patientId) {
      if (!allPatientIds.includes(patientId)) {
        throw new ForbiddenException(
          "You do not have access to this patient's records.",
        );
      }
      return { patientId };
    }

    return { patientId: { in: allPatientIds } };
  }

  private async assertAccess(plan: any, currentUser: AuthUser) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      if (plan.createdById === currentUser.id) return;

      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (provider && plan.providerId === provider.id) return;

      const assignment = await this.prisma.staffAssignment.findFirst({
        where: {
          patientId: plan.patientId,
          staffId: currentUser.id,
          isActive: true,
        },
      });
      if (!assignment) throw new ForbiddenException("Access denied.");
      return;
    }

    // Patient - own plan or active caregiver access
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    if (plan.patientId === patient.id) return;

    const hasAccess = await this.caregiverAccessService.checkAccess(
      currentUser.id,
      plan.patientId,
    );
    if (!hasAccess) throw new ForbiddenException("Access denied.");
  }

  private include = {
    patient: {
      include: {
        user: { select: { id: true, displayName: true, email: true } },
      },
    },
    createdBy: { select: { id: true, displayName: true } },
    provider: {
      include: {
        user: { select: { id: true, displayName: true } },
      },
    },
    _count: { select: { programs: true } },
  } satisfies Prisma.TreatmentPlanInclude;
}
