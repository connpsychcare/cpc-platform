import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma as PrismaClient } from "@workspace/db/client";
import type {
  StaffProfileDto,
  StaffQueryDto,
} from "@workspace/contracts/staff/dto";
import type { CreateStaffType } from "@workspace/contracts/staff";
import type { Prisma } from "@workspace/db/client";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { AuthService } from "@/modules/auth/auth.service";

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async createWithUser(dto: CreateStaffType, clientUrl: string) {
    const { firstName, lastName, email, phone, password, ...profileFields } = dto;

    const { user } = await this.authService.createUser(
      { email, phone, firstName, lastName, password },
      "staff",
      clientUrl,
    );

    try {
      const staff = await this.prisma.staffProfile.create({
        data: { ...profileFields, userId: user.id, isActive: profileFields.isActive as boolean | undefined },
        include: this.staffInclude,
      });
      return { message: "Staff member created successfully.", data: staff };
    } catch (error) {
      if (error instanceof PrismaClient.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("This user already has a staff profile.");
      }
      throw error;
    }
  }

  async list(query: StaffQueryDto, currentUser: AuthUser) {
    const { page, limit, sortBy, sortOrder, search, searchBy, branchId, isActive, includeIds = [] } =
      query;

    const where: Prisma.StaffProfileWhereInput = {
      user: { isDemo: currentUser.isDemo ?? false },
    };

    if (branchId) where.branchId = branchId;
    if (isActive !== undefined) where.isActive = isActive;

    if (search && searchBy) {
      const searchWhereMap: Record<typeof searchBy, Prisma.StaffProfileWhereInput> = {
        displayName: {
          user: { displayName: { contains: search, mode: "insensitive" } },
        },
        email: {
          user: { email: { contains: search, mode: "insensitive" } },
        },
        title: {
          title: { contains: search, mode: "insensitive" },
        },
      };

      Object.assign(where, searchWhereMap[searchBy]);
    }

    const skip = (page - 1) * limit;
    const orderBy =
      sortBy === "displayName"
        ? { user: { displayName: sortOrder } }
        : { [sortBy]: sortOrder };

    const [staff, total] = await Promise.all([
      this.prisma.staffProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: this.staffInclude,
      }),
      this.prisma.staffProfile.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(staff, includeIds);
    const forcedStaff = missingIncludeIds.length
      ? await this.prisma.staffProfile.findMany({
          where: { id: { in: missingIncludeIds } },
          include: this.staffInclude,
        })
      : [];
    const mergedStaff = mergeIncludedRows(staff, forcedStaff);

    return {
      message: "Staff fetched successfully.",
      data: {
        staff: mergedStaff,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const staff = await this.prisma.staffProfile.findUniqueOrThrow({
      where: { id },
      include: this.staffInclude,
    });

    return { message: "Staff profile fetched successfully.", data: staff };
  }

  async findByUserIdOrThrow(userId: string) {
    return this.prisma.staffProfile.findUniqueOrThrow({
      where: { userId },
      include: this.staffInclude,
    });
  }

  async findByUserId(userId: string) {
    const staff = await this.findByUserIdOrThrow(userId);
    return { message: "Staff profile fetched successfully.", data: staff };
  }

  async update(staffId: string, dto: Partial<StaffProfileDto>) {
    const staff = await this.prisma.staffProfile.update({
      where: { id: staffId },
      data: dto,
    });

    return { message: "Staff profile updated successfully.", data: staff };
  }

  async assertStaffAccess(currentUser: AuthUser, staffId: string) {
    const staff = await this.findByUserIdOrThrow(currentUser.id);
    if (staff.id !== staffId) {
      throw new ForbiddenException("You can only manage your own profile.");
    }
  }

  private staffInclude = {
    user: {
      omit: { password: true },
      include: { avatar: true },
    },
    branch: true,
    permissions: { select: { module: true } },
  } satisfies Prisma.StaffProfileInclude;
}
