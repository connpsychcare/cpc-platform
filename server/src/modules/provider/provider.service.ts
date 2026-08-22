import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma as PrismaClient } from "@workspace/db/client";
import type {
  ProviderProfileDto,
  ProviderQueryDto,
} from "@workspace/contracts/provider/dto";
import type { CreateProviderType } from "@workspace/contracts/provider";
import type { Prisma } from "@workspace/db/client";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { AuthService } from "@/modules/auth/auth.service";

@Injectable()
export class ProviderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async createWithUser(dto: CreateProviderType, createdById: string, clientUrl: string) {
    const { firstName, lastName, email, phone, password, ...profileFields } = dto;

    const { user } = await this.authService.createUser(
      { email, phone, firstName, lastName, password },
      // A provider account is a staff user that also owns a ProviderProfile.
      "staff",
      clientUrl,
    );

    try {
      const provider = await this.prisma.providerProfile.create({
        data: { ...(profileFields as any), userId: user.id, createdById },
        include: this.providerInclude,
      });
      return { message: "Provider created successfully.", data: provider };
    } catch (error) {
      if (error instanceof PrismaClient.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("This user already has a provider profile.");
      }
      throw error;
    }
  }

  async list(query: ProviderQueryDto, currentUser?: AuthUser) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      searchBy,
      branchId,
      specialty,
      isAvailable,
      includeIds = [],
    } = query;

    const where: Prisma.ProviderProfileWhereInput = {
      user: { isDemo: currentUser?.isDemo ?? false },
    };

    if (branchId) where.branchId = branchId;
    if (specialty) where.specialties = { has: specialty };
    if (isAvailable !== undefined) where.isAvailable = isAvailable;

    if (search && searchBy) {
      const searchWhereMap: Record<
        typeof searchBy,
        Prisma.ProviderProfileWhereInput
      > = {
        displayName: {
          user: { displayName: { contains: search, mode: "insensitive" } },
        },
        title: {
          title: { contains: search, mode: "insensitive" },
        },
        slug: {
          slug: { contains: search, mode: "insensitive" },
        },
        licenseNumber: {
          licenseNumber: { contains: search, mode: "insensitive" },
        },
      };

      Object.assign(where, searchWhereMap[searchBy]);
    }

    const skip = (page - 1) * limit;
    const orderBy =
      sortBy === "displayName"
        ? { user: { displayName: sortOrder } }
        : { [sortBy]: sortOrder };

    const [providers, total] = await Promise.all([
      this.prisma.providerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: this.providerInclude,
      }),
      this.prisma.providerProfile.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(providers, includeIds);
    const forcedProviders = missingIncludeIds.length
      ? await this.prisma.providerProfile.findMany({
          where: { id: { in: missingIncludeIds } },
          include: this.providerInclude,
        })
      : [];
    const mergedProviders = mergeIncludedRows(providers, forcedProviders);

    return {
      message: "Providers fetched successfully.",
      data: {
        providers: mergedProviders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(identifier: string) {
    const provider = await this.prisma.providerProfile.findFirstOrThrow({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: this.providerInclude,
    });

    return { message: "Provider fetched successfully.", data: provider };
  }

  async update(providerId: string, dto: ProviderProfileDto) {
    console.log("provider dto", dto);

    const provider = await this.prisma.providerProfile.update({
      where: { id: providerId },
      data: dto,
    });

    return { message: "Provider profile updated successfully.", data: provider };
  }

  async findByUserIdOrThrow(userId: string) {
    return this.prisma.providerProfile.findUniqueOrThrow({
      where: { userId },
      include: this.providerInclude,
    });
  }

  /**
   * Not every staff user is a provider, so callers scoping clinical data have to
   * ask rather than assume. Returns null when this staff member has no provider
   * profile, which is the normal case for reception and billing.
   */
  async findProfileForUser(userId: string) {
    return this.prisma.providerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  async findByUserId(userId: string) {
    const provider = await this.findByUserIdOrThrow(userId);
    return { message: "Provider profile fetched successfully.", data: provider };
  }

  async assertProviderAccess(currentUser: AuthUser, providerId: string) {
    if (currentUser.role === "admin") return;
    const provider = await this.findByUserIdOrThrow(currentUser.id);
    if (provider.id !== providerId) {
      throw new ForbiddenException("You can only manage your own profile.");
    }
  }

  private providerInclude = {
    user: {
      omit: { password: true },
      include: { avatar: true },
    },
    branch: true,
    licenseDocument: true,
  } satisfies Prisma.ProviderProfileInclude;
}
