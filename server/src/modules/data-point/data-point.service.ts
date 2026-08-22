import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  DataPointDto,
  DataPointQueryDto,
} from "@workspace/contracts/data-point/dto";
import type { Prisma } from "@workspace/db/client";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class DataPointService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: DataPointDto, currentUser: AuthUser) {
    // Verify the session note exists and resolve patient
    const note = await this.prisma.sessionNote.findUnique({
      where: { id: dto.sessionNoteId },
      select: { id: true, patientId: true },
    });
    if (!note) throw new NotFoundException("Session note not found.");

    // Verify the behavior program exists and belongs to the patient's treatment plan
    const program = await this.prisma.behaviorProgram.findUnique({
      where: { id: dto.programId },
      select: { id: true, treatmentPlan: { select: { patientId: true } } },
    });
    if (!program) throw new NotFoundException("Behavior program not found.");

    if (currentUser.role !== "admin") {
      await this.assertPatientAccess(note.patientId, currentUser);
    }

    const point = await this.prisma.dataPoint.create({
      data: {
        sessionNoteId: dto.sessionNoteId,
        programId: dto.programId,
        recordingType: dto.recordingType,
        response: dto.response ?? null,
        value: dto.value !== undefined ? dto.value : null,
        trialNumber: dto.trialNumber ?? null,
        notes: dto.notes ?? null,
        ...(dto.recordedAt && { recordedAt: dto.recordedAt }),
      },
      include: this.include,
    });

    return { message: "Data point recorded successfully.", data: point };
  }

  async list(query: DataPointQueryDto, currentUser: AuthUser) {
    const {
      page = 1,
      limit = 10,
      sessionNoteId,
      programId,
      recordingType,
      response,
      includeIds = [],
    } = query;

    const accessWhere = await this.buildAccessWhere(currentUser, sessionNoteId);

    const where: Prisma.DataPointWhereInput = {
      ...accessWhere,
      ...(programId && { programId }),
      ...(recordingType && { recordingType }),
      ...(response && { response }),
    };

    const [items, total] = await Promise.all([
      this.prisma.dataPoint.findMany({
        where,
        include: this.include,
        orderBy: { recordedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.dataPoint.count({ where }),
    ]);
    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.dataPoint.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...accessWhere,
          },
          include: this.include,
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Data points fetched successfully.",
      data: {
        dataPoints: mergedItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const point = await this.prisma.dataPoint.findUnique({
      where: { id },
      include: this.include,
    });
    if (!point) throw new NotFoundException("Data point not found.");
    await this.assertDataPointAccess(point.sessionNoteId, currentUser);
    return { message: "Data point fetched successfully.", data: point };
  }

  async update(id: string, dto: Partial<DataPointDto>, currentUser: AuthUser) {
    const point = await this.prisma.dataPoint.findUnique({
      where: { id },
      select: { id: true, sessionNoteId: true },
    });
    if (!point) throw new NotFoundException("Data point not found.");
    await this.assertDataPointAccess(point.sessionNoteId, currentUser);

    const updated = await this.prisma.dataPoint.update({
      where: { id },
      data: {
        ...(dto.recordingType !== undefined && { recordingType: dto.recordingType }),
        ...(dto.response !== undefined && { response: dto.response ?? null }),
        ...(dto.value !== undefined && { value: dto.value ?? null }),
        ...(dto.trialNumber !== undefined && { trialNumber: dto.trialNumber ?? null }),
        ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
        ...(dto.recordedAt !== undefined && { recordedAt: dto.recordedAt }),
      },
      include: this.include,
    });

    return { message: "Data point updated successfully.", data: updated };
  }

  async remove(id: string, currentUser: AuthUser) {
    const point = await this.prisma.dataPoint.findUnique({
      where: { id },
      select: { id: true, sessionNoteId: true },
    });
    if (!point) throw new NotFoundException("Data point not found.");
    await this.assertDataPointAccess(point.sessionNoteId, currentUser);
    await this.prisma.dataPoint.delete({ where: { id } });
    return { message: "Data point deleted successfully." };
  }

  // ----- Access helpers -----

  private async buildAccessWhere(
    currentUser: AuthUser,
    sessionNoteId?: string,
  ): Promise<Prisma.DataPointWhereInput> {
    if (currentUser.role === "admin") {
      return sessionNoteId ? { sessionNoteId } : {};
    }

    if (currentUser.role === "staff") {
      // Reached by authoring the note, by being the provider on the patient's
      // appointments, or by having the patient on their caseload.
      return {
        ...(sessionNoteId ? { sessionNoteId } : {}),
        sessionNote: {
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
        },
      };
    }

    // Patient - own data only
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    return {
      ...(sessionNoteId ? { sessionNoteId } : {}),
      sessionNote: { patientId: patient.id },
    };
  }

  private async assertDataPointAccess(
    sessionNoteId: string,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    const note = await this.prisma.sessionNote.findUnique({
      where: { id: sessionNoteId },
      select: { patientId: true, therapistId: true },
    });
    if (!note) throw new NotFoundException("Session note not found.");

    // Provider reach is already applied by buildAccessWhere at list level, so
    // here we only need the caseload check for staff without a provider profile.
    if (currentUser.role === "staff") {
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: currentUser.id },
        select: { id: true },
      });
      if (provider) return;

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

    // Patient - own data only
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    if (note.patientId !== patient.id) throw new ForbiddenException("Access denied.");
  }

  private async assertPatientAccess(
    patientId: string,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "staff") {
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: currentUser.id },
        select: { id: true },
      });
      if (provider) return;

      const assignment = await this.prisma.staffAssignment.findFirst({
        where: { patientId, staffId: currentUser.id, isActive: true },
      });
      if (!assignment) {
        throw new ForbiddenException("Not assigned to this patient.");
      }
    }
  }

  private include = {
    program: { select: { id: true, name: true, type: true } },
    sessionNote: { select: { id: true, sessionDate: true } },
  } satisfies Prisma.DataPointInclude;
}
