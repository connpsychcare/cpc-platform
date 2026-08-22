import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { GrantStaffPermissionsDto } from "@workspace/contracts/staff-permission/dto";
import type { PermissionModule } from "@workspace/contracts";

import { AuditService } from "@/modules/audit/audit.service";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class StaffPermissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Admin-only: replace a staff member's permission set with exactly the
   * provided modules list (upsert present, delete absent).
   */
  async sync(staffId: string, dto: GrantStaffPermissionsDto, currentUser: AuthUser) {
    if (currentUser.role !== "admin") {
      throw new ForbiddenException("Only admins can manage staff permissions.");
    }

    const staff = await this.prisma.staffProfile.findUnique({ where: { id: staffId } });
    if (!staff) throw new NotFoundException("Staff profile not found.");

    // Delete removed modules, upsert kept/new ones in one transaction
    await this.prisma.$transaction([
      this.prisma.staffPermission.deleteMany({
        where: {
          staffId,
          module: { notIn: dto.modules },
        },
      }),
      ...dto.modules.map((module) =>
        this.prisma.staffPermission.upsert({
          where: { staffId_module: { staffId, module } },
          create: { staffId, module, grantedById: currentUser.id },
          update: { grantedById: currentUser.id },
        }),
      ),
    ]);

    const updated = await this.getModulesForStaff(staffId);

    void this.auditService.log({
      action: "update",
      entityType: "StaffPermission",
      entityId: staffId,
      userId: currentUser.id,
      meta: { modules: dto.modules },
    });

    return {
      message: "Staff permissions updated successfully.",
      data: { staffId, modules: updated },
    };
  }

  /** Admin-only: get the current permission modules for a staff member. */
  async findByStaff(staffId: string, currentUser: AuthUser) {
    if (currentUser.role !== "admin") {
      throw new ForbiddenException("Only admins can view staff permissions.");
    }

    const staff = await this.prisma.staffProfile.findUnique({ where: { id: staffId } });
    if (!staff) throw new NotFoundException("Staff profile not found.");

    const modules = await this.getModulesForStaff(staffId);

    return {
      message: "Staff permissions fetched successfully.",
      data: { staffId, modules },
    };
  }

  /** Utility: returns the permission module list for a staff profile ID. */
  async getModulesForStaff(staffId: string): Promise<PermissionModule[]> {
    const rows = await this.prisma.staffPermission.findMany({
      where: { staffId },
      select: { module: true },
    });
    return rows.map((r) => r.module as PermissionModule);
  }

  /** Utility: check if a staff profile has a specific permission module. */
  async hasModule(staffId: string, module: PermissionModule): Promise<boolean> {
    const row = await this.prisma.staffPermission.findUnique({
      where: { staffId_module: { staffId, module } },
      select: { id: true },
    });
    return !!row;
  }
}
