import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  SessionNoteDto,
  SessionNoteQueryDto,
} from "@workspace/contracts/session-note/dto";
import type { Prisma } from "@workspace/db/client";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { CaregiverAccessService } from "@/modules/caregiver-access/caregiver-access.service";
import { ProviderService } from "@/modules/provider/provider.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

@Injectable()
export class SessionNoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly caregiverAccessService: CaregiverAccessService,
    private readonly providerService: ProviderService,
  ) {}

  async create(dto: SessionNoteDto, currentUser: AuthUser) {
    // Verify patient exists
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId },
    });
    if (!patient) throw new NotFoundException("Patient not found.");

    // Staff/provider can only log notes for patients they have access to
    if (currentUser.role !== "admin") {
      await this.assertPatientAccess(dto.patientId, currentUser);
    }

    const note = await this.prisma.sessionNote.create({
      data: {
        patientId: dto.patientId,
        therapistId: dto.therapistId,
        treatmentPlanId: dto.treatmentPlanId ?? null,
        appointmentId: dto.appointmentId ?? null,
        sessionDate: dto.sessionDate,
        durationMinutes: dto.durationMinutes ?? null,
        summary: dto.summary ?? null,
        clientBehavior: dto.clientBehavior ?? null,
        nextSteps: dto.nextSteps ?? null,
      },
      include: this.include,
    });

    return { message: "Session note created successfully.", data: note };
  }

  async list(query: SessionNoteQueryDto, currentUser: AuthUser) {
    const { page = 1, limit = 10, patientId, therapistId, treatmentPlanId, search, includeIds = [] } = query;

    const accessWhere = await this.buildAccessWhere(currentUser, patientId);

    const where: Prisma.SessionNoteWhereInput = {
      ...accessWhere,
      ...(therapistId && { therapistId }),
      ...(treatmentPlanId && { treatmentPlanId }),
      ...(search && {
        OR: [
          { summary: { contains: search, mode: "insensitive" } },
          { clientBehavior: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.sessionNote.findMany({
        where,
        include: this.include,
        orderBy: { sessionDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sessionNote.count({ where }),
    ]);
    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.sessionNote.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...accessWhere,
          },
          include: this.include,
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Session notes fetched successfully.",
      data: {
        sessionNotes: mergedItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const note = await this.prisma.sessionNote.findUnique({
      where: { id },
      include: this.include,
    });
    if (!note) throw new NotFoundException("Session note not found.");
    await this.assertNoteAccess(note, currentUser);
    return { message: "Session note fetched successfully.", data: note };
  }

  async update(id: string, dto: Partial<SessionNoteDto>, currentUser: AuthUser) {
    const note = await this.prisma.sessionNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException("Session note not found.");
    await this.assertNoteAccess(note, currentUser);

    // Only allow mutations for staff/provider/admin - patients are read-only
    if (currentUser.role === "patient") {
      throw new ForbiddenException("Patients cannot edit session notes.");
    }

    const updated = await this.prisma.sessionNote.update({
      where: { id },
      data: {
        ...(dto.sessionDate !== undefined && { sessionDate: dto.sessionDate }),
        ...(dto.durationMinutes !== undefined && { durationMinutes: dto.durationMinutes ?? null }),
        ...(dto.treatmentPlanId !== undefined && { treatmentPlanId: dto.treatmentPlanId ?? null }),
        ...(dto.summary !== undefined && { summary: dto.summary ?? null }),
        ...(dto.clientBehavior !== undefined && { clientBehavior: dto.clientBehavior ?? null }),
        ...(dto.nextSteps !== undefined && { nextSteps: dto.nextSteps ?? null }),
      },
      include: this.include,
    });

    return { message: "Session note updated successfully.", data: updated };
  }

  async remove(id: string, currentUser: AuthUser) {
    const note = await this.prisma.sessionNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException("Session note not found.");
    await this.assertNoteAccess(note, currentUser);
    await this.prisma.sessionNote.delete({ where: { id } });
    return { message: "Session note deleted successfully." };
  }

  // ----- Access helpers -----

  private async buildAccessWhere(
    currentUser: AuthUser,
    patientId?: string,
  ): Promise<Prisma.SessionNoteWhereInput> {
    if (currentUser.role === "admin") {
      return patientId ? { patientId } : {};
    }

    if (currentUser.role === "staff") {
      // A staff user reaches a note by authoring it, by being the provider on
      // the patient's appointments, or by having the patient on their caseload.
      return {
        ...(patientId ? { patientId } : {}),
        OR: [
          { therapistId: currentUser.id },
          {
            patient: {
              appointments: {
                some: { provider: { userId: currentUser.id } },
              },
            },
          },
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

    // Patient - own notes + caregiver-accessible notes (read-only)
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    const caregiverIds =
      await this.caregiverAccessService.getCaregiverPatientIds(currentUser.id);
    const allPatientIds = [patient.id, ...caregiverIds];

    // A requested patient narrows the result rather than being ignored, so a
    // linked child's page shows that child's notes and not the caregiver's.
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

  private async assertPatientAccess(patientId: string, currentUser: AuthUser) {
    if (currentUser.role === "staff") {
      // A staff user reaches a patient as the provider on their appointments or
      // through an active caseload assignment.
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
        where: { patientId, staffId: currentUser.id, isActive: true },
      });
      if (!assignment) throw new ForbiddenException("Access denied.");
    }
  }

  private async assertNoteAccess(
    note: { patientId: string; therapistId: string },
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      if (note.therapistId === currentUser.id) return;

      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (provider) {
        const appointment = await this.prisma.appointment.findFirst({
          where: { patientId: note.patientId, providerId: provider.id },
          select: { id: true },
        });
        if (appointment) return;
      }

      const assignment = await this.prisma.staffAssignment.findFirst({
        where: {
          patientId: note.patientId,
          staffId: currentUser.id,
          isActive: true,
        },
      });
      if (!assignment) throw new ForbiddenException("Access denied.");
      return;
    }

    // Patient - own notes or active caregiver access (read-only)
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    if (note.patientId === patient.id) return;

    const hasAccess = await this.caregiverAccessService.checkAccess(
      currentUser.id,
      note.patientId,
    );
    if (!hasAccess) throw new ForbiddenException("Access denied.");
  }

  private include = {
    patient: {
      include: {
        user: { select: { id: true, displayName: true, email: true } },
      },
    },
    therapist: { select: { id: true, displayName: true, role: true } },
    treatmentPlan: { select: { id: true, title: true } },
  } satisfies Prisma.SessionNoteInclude;
}
