import { ForbiddenException, Injectable } from "@nestjs/common";
import type { ClinicalFormQueryDto } from "@workspace/contracts/clinical-form/dto";
import type { Prisma } from "@workspace/db/client";

import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class ClinicalFormsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ClinicalFormQueryDto, currentUser: AuthUser) {
    const {
      patientId,
      formType,
      formTypes,
      isOnboarding,
      page = 1,
      limit = 20,
      sortBy = "completedAt",
      sortOrder = "desc",
      search,
      searchBy = "displayName",
    } = query;

    // Combined with AND rather than spread: the access clause and the search
    // clause both key on "patient", so spreading would silently drop the
    // access restriction and widen what a staff user can read.
    const where: Prisma.ClinicalFormResponseWhereInput = {
      ...(formType
        ? { formType }
        : formTypes?.length && { formType: { in: formTypes } }),
      ...(isOnboarding !== undefined && { isOnboarding }),
      AND: [
        await this.buildAccessWhere(currentUser, patientId),
        ...(search ? [this.buildSearchWhere(search, searchBy)] : []),
      ],
    };

    const [forms, total] = await Promise.all([
      this.prisma.clinicalFormResponse.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: this.include,
      }),
      this.prisma.clinicalFormResponse.count({ where }),
    ]);

    return {
      message: "Clinical form responses fetched.",
      data: {
        forms,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const form = await this.prisma.clinicalFormResponse.findUniqueOrThrow({
      where: { id },
      include: {
        ...this.include,
        patient: {
          select: {
            id: true,
            userId: true,
            user: { select: { id: true, displayName: true, email: true } },
          },
        },
      },
    });

    if (currentUser.role === "patient") {
      if (form.patient.userId !== currentUser.id) {
        throw new ForbiddenException("Not authorized.");
      }
    } else if (currentUser.role === "staff") {
      await this.assertStaffReachesPatient(form.patientId, currentUser.id);
    } else if (currentUser.role !== "admin") {
      throw new ForbiddenException("Not authorized.");
    }

    return { message: "Clinical form response fetched.", data: form };
  }

  // ----- Access helpers -----

  private async buildAccessWhere(
    currentUser: AuthUser,
    patientId?: string,
  ): Promise<Prisma.ClinicalFormResponseWhereInput> {
    if (currentUser.role === "admin") {
      return patientId ? { patientId } : {};
    }

    if (currentUser.role === "staff") {
      // A staff user reaches a patient as the provider on their appointments or
      // through an active caseload assignment. Staff without a provider profile
      // (reception, billing) still reach their caseload.
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: currentUser.id },
        select: { id: true },
      });

      return {
        ...(patientId && { patientId }),
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

    if (currentUser.role === "patient") {
      // A patient only ever sees their own forms, so any requested patientId is
      // ignored rather than trusted.
      const profile = await this.prisma.patientProfile.findUniqueOrThrow({
        where: { userId: currentUser.id },
        select: { id: true },
      });
      return { patientId: profile.id };
    }

    throw new ForbiddenException("Not authorized.");
  }

  private async assertStaffReachesPatient(patientId: string, staffId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: staffId },
      select: { id: true },
    });

    if (provider) {
      const appointment = await this.prisma.appointment.findFirst({
        where: { patientId, providerId: provider.id },
        select: { id: true },
      });
      if (appointment) return;
    }

    const assignment = await this.prisma.staffAssignment.findFirst({
      where: { patientId, staffId, isActive: true },
      select: { id: true },
    });
    if (!assignment) throw new ForbiddenException("Not authorized.");
  }

  private buildSearchWhere(
    search: string,
    searchBy: string,
  ): Prisma.ClinicalFormResponseWhereInput {
    if (searchBy === "interpretation") {
      return { interpretation: { contains: search, mode: "insensitive" } };
    }

    const field = searchBy === "email" ? "email" : "displayName";
    return {
      patient: { user: { [field]: { contains: search, mode: "insensitive" } } },
    };
  }

  private include = {
    patient: {
      select: {
        id: true,
        user: { select: { id: true, displayName: true, email: true } },
      },
    },
    administeredBy: { select: { id: true, displayName: true, email: true } },
    teacherAssessmentToken: {
      select: {
        id: true,
        teacherName: true,
        teacherEmail: true,
        schoolName: true,
      },
    },
  } satisfies Prisma.ClinicalFormResponseInclude;
}
