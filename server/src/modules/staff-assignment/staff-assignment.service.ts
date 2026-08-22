import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  StaffAssignmentDto,
  StaffAssignmentQueryDto,
  UnassignStaffDto,
} from "@workspace/contracts/staff-assignment/dto";
import type { Prisma } from "@workspace/db/client";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class StaffAssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO see all server if we writing un efficient code se below we always need to write clean efficeint and performance code need in mind don't make multiple queries awlays try one query  alwas write clean performance  efficient cod e
  // async assign(dto: StaffAssignmentDto, currentUser: AuthUser) {
  //   console.log("dto", dto);

  //   const staffProfile = await this.prisma.staffProfile.findUnique({
  //     where: { id: dto.staffId },
  //     include: { user: true },
  //   });

  //   if (!staffProfile || staffProfile.user.role !== "staff") {
  //     throw new NotFoundException("Staff member not found.");
  //   }

  //   const staffUserId = staffProfile.userId;

  //   const results: string[] = [];
  //   const skipped: string[] = [];

  //   for (const patientId of dto.patientIds) {
  //     const patient = await this.prisma.patientProfile.findUnique({
  //       where: { id: patientId },
  //     });
  //     if (!patient) {
  //       skipped.push(patientId);
  //       continue;
  //     }

  //     const existing = await this.prisma.staffAssignment.findFirst({
  //       where: { patientId, staffId: staffUserId, isActive: true },
  //     });
  //     if (existing) {
  //       skipped.push(patientId);
  //       continue;
  //     }

  //     const inactive = await this.prisma.staffAssignment.findFirst({
  //       where: { patientId, staffId: staffUserId, isActive: false },
  //     });

  //     if (inactive) {
  //       await this.prisma.staffAssignment.update({
  //         where: { id: inactive.id },
  //         data: {
  //           isActive: true,
  //           assignedById: currentUser.id,
  //           assignedAt: new Date(),
  //           unassignedAt: null,
  //           notes: dto.notes ?? null,
  //         },
  //       });
  //     } else {
  //       await this.prisma.staffAssignment.create({
  //         data: {
  //           patientId,
  //           staffId: staffUserId,
  //           assignedById: currentUser.id,
  //           notes: dto.notes ?? null,
  //         },
  //       });
  //     }
  //     results.push(patientId);
  //   }

  //   return {
  //     message: `${results.length} patient(s) assigned. ${skipped.length} skipped (already assigned or not found).`,
  //     data: { assigned: results.length, skipped: skipped.length },
  //   };
  // }

  async assign(dto: StaffAssignmentDto, currentUser: AuthUser) {
    const { staffId: staffProfileId, patientIds, notes } = dto;

    // 1. Validate staff profile
    const staffProfile = await this.prisma.staffProfile.findUnique({
      where: { id: staffProfileId },
      select: {
        id: true,
        userId: true,
        user: { select: { role: true } },
      },
    });

    if (!staffProfile || staffProfile.user.role !== "staff") {
      throw new NotFoundException("Staff member not found.");
    }

    const staffUserId = staffProfile.userId;

    // 2. Fetch valid patients in one go
    const patients = await this.prisma.patientProfile.findMany({
      where: { id: { in: patientIds } },
      select: { id: true },
    });

    const validPatientIds = new Set(patients.map((p) => p.id));

    const results: string[] = [];
    const skipped: string[] = [];

    // 3. Process assignments (safe + idempotent)
    for (const patientId of patientIds) {
      if (!validPatientIds.has(patientId)) {
        skipped.push(patientId);
        continue;
      }

      await this.prisma.staffAssignment.upsert({
        where: {
          patientId_staffId: {
            patientId,
            staffId: staffUserId,
          },
        },
        update: {
          isActive: true,
          assignedById: currentUser.id,
          assignedAt: new Date(),
          unassignedAt: null,
          notes: notes ?? null,
        },
        create: {
          patientId,
          staffId: staffUserId,
          assignedById: currentUser.id,
          notes: notes ?? null,
        },
      });

      results.push(patientId);
    }

    return {
      message: `${results.length} patient(s) assigned. ${skipped.length} skipped (not found).`,
      data: {
        assigned: results.length,
        skipped: skipped.length,
      },
    };
  }

  async list(query: StaffAssignmentQueryDto, currentUser: AuthUser) {
    const {
      page = 1,
      limit = 10,
      staffId,
      patientId,
      isActive,
      includeIds = [],
    } = query;

    const resolvedStaffId =
      currentUser.role === "staff"
        ? currentUser.id
        : await this.resolveStaffUserId(staffId);

    const where: Prisma.StaffAssignmentWhereInput = {
      ...(resolvedStaffId && { staffId: resolvedStaffId }),
      ...(patientId && { patientId }),
      ...(isActive !== undefined && { isActive }),
    };

    const [items, total] = await Promise.all([
      this.prisma.staffAssignment.findMany({
        where,
        include: this.include,
        orderBy: { assignedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.staffAssignment.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.staffAssignment.findMany({
          where: {
            id: { in: missingIncludeIds },
            ...(resolvedStaffId && { staffId: resolvedStaffId }),
          },
          include: this.include,
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Staff assignments fetched successfully.",
      data: {
        assignments: mergedItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const assignment = await this.prisma.staffAssignment.findUnique({
      where: { id },
      include: this.include,
    });
    if (!assignment) throw new NotFoundException("Assignment not found.");
    this.assertAccess(assignment, currentUser);
    return { message: "Assignment fetched successfully.", data: assignment };
  }

  async unassign(id: string, dto: UnassignStaffDto, currentUser: AuthUser) {
    const assignment = await this.prisma.staffAssignment.findUnique({
      where: { id },
    });
    if (!assignment) throw new NotFoundException("Assignment not found.");
    if (!assignment.isActive) {
      throw new BadRequestException("This assignment is already inactive.");
    }
    this.assertAccess(assignment, currentUser);

    const updated = await this.prisma.staffAssignment.update({
      where: { id },
      data: {
        isActive: false,
        unassignedAt: new Date(),
        ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
      },
      include: this.include,
    });

    return { message: "Patient unassigned from staff member.", data: updated };
  }

  async remove(id: string, currentUser: AuthUser) {
    if (currentUser.role !== "admin")
      throw new ForbiddenException("Admin only.");
    const assignment = await this.prisma.staffAssignment.findUnique({
      where: { id },
    });
    if (!assignment) throw new NotFoundException("Assignment not found.");
    await this.prisma.staffAssignment.delete({ where: { id } });
    return { message: "Assignment deleted." };
  }

  // Caseload summary for a staff member
  async getCaseload(staffId: string, currentUser: AuthUser) {
    const staffUserId = await this.resolveStaffUserId(staffId);

    if (!staffUserId) {
      throw new NotFoundException("Staff member not found.");
    }

    if (currentUser.role === "staff" && currentUser.id !== staffUserId) {
      throw new ForbiddenException("Access denied.");
    }

    const [active, total] = await Promise.all([
      this.prisma.staffAssignment.count({
        where: { staffId: staffUserId, isActive: true },
      }),
      this.prisma.staffAssignment.count({ where: { staffId: staffUserId } }),
    ]);

    const activePatients = await this.prisma.staffAssignment.findMany({
      where: { staffId: staffUserId, isActive: true },
      include: this.include,
      orderBy: { assignedAt: "desc" },
    });

    return {
      message: "Caseload fetched successfully.",
      data: {
        staffId: staffUserId,
        activeCount: active,
        totalEver: total,
        assignments: activePatients,
      },
    };
  }

  private assertAccess(assignment: { staffId: string }, currentUser: AuthUser) {
    if (currentUser.role === "admin" || currentUser.role === "staff") return;
    throw new ForbiddenException("Access denied.");
  }

  private async resolveStaffUserId(staffId?: string) {
    if (!staffId) return undefined;

    const staffProfile = await this.prisma.staffProfile.findFirst({
      where: {
        OR: [{ id: staffId }, { userId: staffId }],
      },
      select: { userId: true },
    });

    return staffProfile?.userId;
  }

  private include = {
    patient: {
      include: {
        user: { select: { id: true, displayName: true, email: true } },
      },
    },
    staff: { select: { id: true, displayName: true, email: true } },
    assignedBy: { select: { id: true, displayName: true } },
  } satisfies Prisma.StaffAssignmentInclude;
}
