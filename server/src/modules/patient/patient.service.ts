import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type {
  PatientProfileDto,
  PatientQueryDto,
  CreateDependentDto,
} from "@workspace/contracts/patient/dto";
import type { CreatePatientDto } from "@workspace/contracts/patient/dto";
import { Prisma } from "@workspace/db/client";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

import { AuthService } from "@/modules/auth/auth.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { SubmitOnboardingDto } from "@workspace/contracts/onboarding/dto";

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async getMyProfile(currentUser: AuthUser) {
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
      include: this.patientInclude,
    });

    return { message: "Patient profile fetched successfully.", data: patient };
  }

  async updateMyProfile(dto: PatientProfileDto, currentUser: AuthUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _, phone, ...data } = dto;

    // Onboarding completion is set only by submitOnboarding, once the
    // wizard truly finishes (consent + signature). Saving the profile
    // partway through the wizard must not mark the account onboarded.
    const dbUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: currentUser.id },
      select: { phone: true },
    });

    if (phone && !dbUser.phone) {
      await this.prisma.user.update({
        where: { id: currentUser.id },
        data: { phone },
      });
    }

    const patient = await this.prisma.patientProfile.update({
      where: { userId: currentUser.id },
      data,
      include: this.patientInclude,
    });

    return { message: "Patient profile updated successfully.", data: patient };
  }

  async getOnboardingStatus(currentUser: AuthUser) {
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
      select: { id: true, onboarding: true },
    });

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: currentUser.id },
      select: { onboardingCompletedAt: true },
    });

    const ob = patient.onboarding;
    return {
      message: "Onboarding status fetched.",
      data: {
        completed: !!user.onboardingCompletedAt,
        completedAt: user.onboardingCompletedAt,
        steps: {
          personalInfo: !!ob?.personalInfoCompletedAt,
          insurance: !!ob?.insuranceCompletedAt,
          intakeForm: !!ob?.intakeFormCompletedAt,
          screeningForms: !!ob?.screeningFormsCompletedAt,
          consent: !!ob?.consentCompletedAt,
        },
      },
    };
  }

  async submitOnboarding(dto: SubmitOnboardingDto, currentUser: AuthUser) {
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
      select: { id: true },
    });

    const now = new Date();

    // Save each clinical form response
    if (dto.forms?.length) {
      await this.prisma.clinicalFormResponse.createMany({
        data: dto.forms.map((form) => ({
          patientId: patient.id,
          formType: form.formType,
          responses: form.responses as Prisma.InputJsonValue,
          totalScore: form.totalScore,
          interpretation: form.interpretation,
          isOnboarding: true,
          completedAt: now,
        })),
        skipDuplicates: false,
      });
    }

    const consentFields = {
      hipaaAcknowledged: dto.consentData.hipaaAcknowledged,
      consentToTreat: dto.consentData.consentToTreat,
      telehealthConsent: dto.consentData.telehealthConsent,
      signatureName: dto.consentData.signatureName,
      signedAt: dto.consentData.signedAt,
    };

    // Upsert the onboarding step record
    await this.prisma.patientOnboarding.upsert({
      where: { patientId: patient.id },
      create: {
        patientId: patient.id,
        personalInfoCompletedAt: dto.completedSteps?.personalInfo ? now : undefined,
        insuranceCompletedAt: dto.completedSteps?.insurance ? now : undefined,
        intakeFormCompletedAt: dto.completedSteps?.intake ? now : undefined,
        screeningFormsCompletedAt: dto.completedSteps?.screenings ? now : undefined,
        consentCompletedAt: now,
        ...consentFields,
        completedAt: now,
      },
      update: {
        personalInfoCompletedAt: dto.completedSteps?.personalInfo ? now : undefined,
        insuranceCompletedAt: dto.completedSteps?.insurance ? now : undefined,
        intakeFormCompletedAt: dto.completedSteps?.intake ? now : undefined,
        screeningFormsCompletedAt: dto.completedSteps?.screenings ? now : undefined,
        consentCompletedAt: now,
        ...consentFields,
        completedAt: now,
      },
    });

    // Mark the user as onboarding-complete
    await this.prisma.user.update({
      where: { id: currentUser.id },
      data: { onboardingCompletedAt: now },
    });

    return { message: "Onboarding submitted successfully.", data: { completedAt: now } };
  }

  async createDependent(dto: CreateDependentDto, currentUser: AuthUser) {
    const parentProfile = await this.prisma.patientProfile.findUnique({
      where: { userId: currentUser.id },
      select: { id: true },
    });
    if (!parentProfile) {
      throw new NotFoundException("Patient profile not found for current user.");
    }

    const { firstName, lastName, dateOfBirth, relationship, notes } = dto;

    const depUser = await this.prisma.user.create({
      data: {
        email: `dep.${currentUser.id}.${Date.now()}@system.nologin`,
        firstName,
        lastName: lastName ?? undefined,
        displayName: lastName ? `${firstName} ${lastName}` : firstName,
        role: "patient",
        status: "active",
        onboardingCompletedAt: new Date(),
        patientProfile: {
          create: {
            ...(dateOfBirth && { birthDate: new Date(dateOfBirth) }),
          },
        },
      },
      include: { patientProfile: { select: { id: true } } },
    });

    const childPatientId = depUser.patientProfile!.id;

    await this.prisma.caregiverAccess.create({
      data: {
        caregiverId: currentUser.id,
        patientId: childPatientId,
        grantedById: currentUser.id,
        isActive: true,
        relationship: relationship ?? "parent",
        grantedAt: new Date(),
        ...(notes && { notes }),
      },
    });

    return {
      message: "Dependent profile created successfully.",
      data: { patientId: childPatientId, displayName: depUser.displayName },
    };
  }

  async createWithUser(dto: CreatePatientDto, clientUrl: string) {
    const { firstName, lastName, email, phone, password, ...profileFields } =
      dto;

    const { user } = await this.authService.createUser(
      { email, phone, firstName, lastName, password },
      "patient",
      clientUrl,
    );

    const patient = await this.prisma.patientProfile.update({
      where: { userId: user.id },
      data: profileFields,
      include: this.patientInclude,
    });

    return { message: "Patient created successfully.", data: patient };
  }

  async list(query: PatientQueryDto, currentUser: AuthUser) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      searchBy,
      includeIds = [],
      excludeIds = [],
    } = query;

    const where: Prisma.PatientProfileWhereInput = {
      user: { isDemo: currentUser.isDemo ?? false },
      ...(excludeIds.length > 0 && { id: { notIn: excludeIds } }),
    };
    let forcedIncludeWhere: Prisma.PatientProfileWhereInput = {};

    if (currentUser.role === "staff") {
      // A staff user reaches a patient as the provider on their appointments or
      // through an active caseload assignment.
      const providerProfile = await this.prisma.providerProfile.findUnique({
        where: { userId: currentUser.id },
        select: { id: true },
      });

      const reach: Prisma.PatientProfileWhereInput["OR"] = [
        ...(providerProfile
          ? [{ appointments: { some: { providerId: providerProfile.id } } }]
          : []),
        { staffAssignments: { some: { staffId: currentUser.id, isActive: true } } },
      ];

      where.OR = reach;
      forcedIncludeWhere = { OR: reach };
    }

    if (search && searchBy) {
      const searchWhereMap: Record<
        typeof searchBy,
        Prisma.PatientProfileWhereInput
      > = {
        displayName: {
          user: { displayName: { contains: search, mode: "insensitive" } },
        },
        email: {
          user: { email: { contains: search, mode: "insensitive" } },
        },
        phone: {
          user: { phone: { contains: search, mode: "insensitive" } },
        },
      };
      Object.assign(where, searchWhereMap[searchBy]);
    }

    const skip = (page - 1) * limit;
    const orderBy =
      sortBy === "displayName"
        ? { user: { displayName: sortOrder } }
        : sortBy === "email"
          ? { user: { email: sortOrder } }
          : { createdAt: sortOrder };

    const [patients, total] = await Promise.all([
      this.prisma.patientProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: this.patientInclude,
      }),
      this.prisma.patientProfile.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(patients, includeIds);
    const forcedPatients = missingIncludeIds.length
      ? await this.prisma.patientProfile.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...forcedIncludeWhere,
          },
          include: this.patientInclude,
        })
      : [];
    const mergedPatients = mergeIncludedRows(patients, forcedPatients);

    return {
      message: "Patients fetched successfully.",
      data: {
        patients: mergedPatients,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(patientId: string, currentUser: AuthUser) {
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { id: patientId },
      include: this.patientInclude,
    });

    if (currentUser.role === "admin") {
      return {
        message: "Patient profile fetched successfully.",
        data: patient,
      };
    }

    if (currentUser.role === "patient") {
      if (patient.userId !== currentUser.id) {
        throw new ForbiddenException(
          "You can only access your own patient profile.",
        );
      }

      return {
        message: "Patient profile fetched successfully.",
        data: patient,
      };
    }

    if (currentUser.role === "staff") {
      const providerProfile = await this.prisma.providerProfile.findUnique({
        where: { userId: currentUser.id },
        select: { id: true },
      });

      if (providerProfile) {
        const isProviderPatient = await this.prisma.appointment.findFirst({
          where: { patientId, providerId: providerProfile.id },
          select: { id: true },
        });

        if (isProviderPatient) {
          return {
            message: "Patient profile fetched successfully.",
            data: patient,
          };
        }
      }

      const hasAccess = await this.prisma.staffAssignment.findFirst({
        where: { patientId, staffId: currentUser.id, isActive: true },
        select: { id: true },
      });

      if (!hasAccess) {
        throw new ForbiddenException(
          "You can only access patients assigned to you.",
        );
      }

      return {
        message: "Patient profile fetched successfully.",
        data: patient,
      };
    }

    throw new ForbiddenException("Access denied.");
  }

  async update(
    patientId: string,
    dto: PatientProfileDto,
    currentUser: AuthUser,
  ) {
    await this.assertUpdateAccess(patientId, currentUser);

    const patient = await this.prisma.patientProfile.update({
      where: { id: patientId },
      data: dto,
    });

    return { message: "Patient profile updated successfully.", data: patient };
  }

  private async assertUpdateAccess(patientId: string, currentUser: AuthUser) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      const providerProfile = await this.prisma.providerProfile.findUnique({
        where: { userId: currentUser.id },
        select: { id: true },
      });

      if (providerProfile) {
        const isProviderPatient = await this.prisma.appointment.findFirst({
          where: { patientId, providerId: providerProfile.id },
          select: { id: true },
        });
        if (isProviderPatient) return;
      }

      const hasAccess = await this.prisma.staffAssignment.findFirst({
        where: { patientId, staffId: currentUser.id, isActive: true },
        select: { id: true },
      });

      if (!hasAccess) {
        throw new ForbiddenException(
          "You can only update your own patients or those assigned to you.",
        );
      }
      return;
    }

    throw new ForbiddenException("Access denied.");
  }

  private patientInclude = {
    user: {
      omit: { password: true },
      include: { avatar: true },
    },
    identificationDocument: true,
    appointments: {
      orderBy: { scheduledStartAt: "desc" },
      take: 10,
    },
  } satisfies Prisma.PatientProfileInclude;
}
