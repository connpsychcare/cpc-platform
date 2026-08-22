import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Prisma } from "@workspace/db/client";
import type {
  CategoryDto,
  CategoryQueryDto,
} from "@workspace/contracts/category/dto";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { AuditService } from "@/modules/audit/audit.service";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: CategoryQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      searchBy,
      parentId,
      includeDeleted,
    } = query;

    const where: Prisma.CategoryWhereInput = {
      deletedAt: includeDeleted ? { not: null } : null,
      ...(parentId ? { parentId } : {}),
    };

    if (search && searchBy) {
      const map: Record<string, Prisma.CategoryWhereInput> = {
        id: { id: search },
        name: { name: { contains: search, mode: "insensitive" } },
        slug: { slug: { contains: search, mode: "insensitive" } },
      };
      Object.assign(where, map[searchBy] ?? {});
    }

    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: this.include,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      message: "Categories fetched successfully.",
      data: {
        categories,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listPublic() {
    const categories = await this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      include: { cover: true },
    });

    return { message: "Categories fetched successfully.", data: categories };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: this.include,
    });
    if (!category) throw new NotFoundException("Category not found.");

    return { message: "Category fetched successfully.", data: category };
  }

  async create(dto: CategoryDto, currentUser: AuthUser) {
    await this.assertSlugAvailable(dto.slug);

    const category = await this.prisma.category.create({
      data: dto,
      include: this.include,
    });

    await this.audit.log({
      action: "create",
      entityType: "Category",
      entityId: category.id,
      userId: currentUser.id,
    });

    return { message: "Category created successfully.", data: category };
  }

  async update(id: string, dto: CategoryDto, currentUser: AuthUser) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Category not found.");

    if (dto.slug && dto.slug !== existing.slug) {
      await this.assertSlugAvailable(dto.slug);
    }
    // A category cannot be its own parent, which would orphan the tree.
    if (dto.parentId === id) {
      throw new BadRequestException("A category cannot be its own parent.");
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
      include: this.include,
    });

    await this.audit.log({
      action: "update",
      entityType: "Category",
      entityId: id,
      userId: currentUser.id,
    });

    return { message: "Category updated successfully.", data: category };
  }

  async remove(id: string, force: boolean, currentUser: AuthUser) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    });
    if (!existing) throw new NotFoundException("Category not found.");

    // Post.categoryId is onDelete: Restrict, so a hard delete would fail at the
    // database with an opaque error. Refuse it here with an explanation instead.
    if (force && existing._count.posts > 0) {
      throw new BadRequestException(
        `This category still has ${existing._count.posts} post(s). Move or delete them first.`,
      );
    }

    if (force) {
      await this.prisma.category.delete({ where: { id } });
    } else {
      await this.prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }

    await this.audit.log({
      action: "delete",
      entityType: "Category",
      entityId: id,
      userId: currentUser.id,
      meta: { force },
    });

    return { message: "Category deleted successfully.", data: null };
  }

  async restore(id: string, currentUser: AuthUser) {
    const category = await this.prisma.category.update({
      where: { id },
      data: { deletedAt: null },
      include: this.include,
    });

    await this.audit.log({
      action: "update",
      entityType: "Category",
      entityId: id,
      userId: currentUser.id,
      meta: { restored: true },
    });

    return { message: "Category restored successfully.", data: category };
  }

  private async assertSlugAvailable(slug: string) {
    const clash = await this.prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (clash) {
      throw new BadRequestException("A category with this slug already exists.");
    }
  }

  private include = {
    cover: true,
    parent: { select: { id: true, name: true, slug: true } },
    _count: { select: { posts: true } },
  } satisfies Prisma.CategoryInclude;
}
