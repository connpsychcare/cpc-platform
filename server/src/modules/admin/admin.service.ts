import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

import { AuthService } from "@/modules/auth/auth.service";
import { AuditService } from "@/modules/audit/audit.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { CUUserDto, UserQueryDto } from "@workspace/contracts/admin/dto";
import type { CUUserType } from "@workspace/contracts/admin";
import type { Prisma } from "@workspace/db/client";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
  ) {}

  async findAllUsers(query: UserQueryDto, currentUser: AuthUser) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      searchBy,
      role,
      isEmailVerified,
      isPhoneVerified,
      includeIds = [],
      excludeIds = [],
      includeDeleted,
      hasNoProfile,
      hasNoProviderProfile,
    } = query;

    const where: Prisma.UserWhereInput = {
      deletedAt: includeDeleted ? { not: null } : null,
      isDemo: currentUser.isDemo ?? false,
      ...(excludeIds.length > 0 && { id: { notIn: excludeIds } }),
    };

    const effectiveRole = currentUser.role === "staff" ? "patient" : role;
    if (effectiveRole) {
      where.role = effectiveRole;
    } else {
      where.role = { not: "admin" };
    }

    if (hasNoProfile) {
      if (effectiveRole === "patient") where.patientProfile = { is: null };
      else if (effectiveRole === "staff") where.staffProfile = { is: null };
    }

    // Provider is a profile a staff user may own, not a role, so it filters
    // separately from hasNoProfile.
    if (hasNoProviderProfile) where.providerProfile = { is: null };

    if (isEmailVerified !== undefined) where.isEmailVerified = isEmailVerified;
    if (isPhoneVerified !== undefined) where.isPhoneVerified = isPhoneVerified;

    if (search && searchBy) {
      const searchWhereMap: Record<typeof searchBy, any> = {
        id: { id: search },
        email: {
          email: { contains: search, mode: "insensitive" },
        },
        phone: {
          phone: { contains: search, mode: "insensitive" },
        },
        displayName: {
          displayName: { contains: search, mode: "insensitive" },
        },
      };
      Object.assign(where, searchWhereMap[searchBy]);
    }

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        ...this.authService.userView,
      }),
      this.prisma.user.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(users, includeIds);
    const forcedUsers = missingIncludeIds.length
      ? await this.prisma.user.findMany({
          where: {
            id: { in: missingIncludeIds },
            deletedAt: includeDeleted ? { not: null } : null,
            ...(effectiveRole
              ? { role: effectiveRole }
              : { role: { not: "admin" } }),
          },
          ...this.authService.userView,
        })
      : [];
    const mergedUsers = mergeIncludedRows(users, forcedUsers);

    return {
      message: "Users fetched successfully.",
      data: {
        users: mergedUsers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUser(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      ...this.authService.userView,
    });

    return { message: "User Fetched Successfully.", data: user };
  }

  private async assertNotAdmin(userId: string, action: string) {
    const target = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!target) throw new NotFoundException("User not found.");
    if (target.role === "admin") {
      throw new ForbiddenException(`Cannot ${action} another admin account.`);
    }
  }

  async updateUser(dto: CUUserDto, userId: string, currentUser: AuthUser) {
    if (userId !== currentUser.id) {
      await this.assertNotAdmin(userId, "update");
    }

    const { password: rawPassword, ...fields } = dto as CUUserType;

    const hashedPassword = rawPassword
      ? await this.authService.hashPassword(rawPassword)
      : undefined;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...fields,
        ...(hashedPassword && { password: hashedPassword }),
      },
      ...this.authService.userView,
    });

    void this.auditService.log({
      action: "update",
      entityType: "User",
      entityId: userId,
      userId: currentUser.id,
    });

    return { message: "User Updated Successfully", data: updated };
  }

  async deleteUser(userId: string, currentUser: AuthUser) {
    if (userId === currentUser.id) {
      throw new ForbiddenException("You cannot delete your own account.");
    }

    await this.assertNotAdmin(userId, "delete");

    await this.prisma.user.delete({
      where: { id: userId },
    });

    void this.auditService.log({
      action: "delete",
      entityType: "User",
      entityId: userId,
      userId: currentUser.id,
    });

    return { message: "User Deleted Successfully." };
  }

  async restoreUser(userId: string, currentUser: AuthUser) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null },
    });

    void this.auditService.log({
      action: "update",
      entityType: "User",
      entityId: userId,
      userId: currentUser.id,
      meta: { action: "restore" },
    });

    return { message: "User Restored Successfully." };
  }
}
