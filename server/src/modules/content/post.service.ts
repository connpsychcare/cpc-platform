import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Prisma } from "@workspace/db/client";
import type { PostDto, PostQueryDto, TrackPostViewDto } from "@workspace/contracts/post/dto";

import { PrismaService } from "@/modules/prisma/prisma.service";
import { AuditService } from "@/modules/audit/audit.service";

/** Fields a post must actually have before it can go live. */
const REQUIRED_TO_PUBLISH = [
  "categoryId",
  "title",
  "slug",
  "excerpt",
  "content",
] as const;

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ── Internal ──────────────────────────────────────────────────────────────

  async list(query: PostQueryDto, currentUser: AuthUser) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      searchBy,
      status,
      categoryId,
      authorId,
      includeDeleted,
    } = query;

    const where: Prisma.PostWhereInput = {
      deletedAt: includeDeleted ? { not: null } : null,
    };

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    // An author only ever sees their own drafts; admin and content staff see all.
    if (currentUser.role === "author") where.authorId = currentUser.id;
    else if (authorId) where.authorId = authorId;

    if (search && searchBy) {
      const map: Record<string, Prisma.PostWhereInput> = {
        id: { id: search },
        title: { title: { contains: search, mode: "insensitive" } },
        slug: { slug: { contains: search, mode: "insensitive" } },
        category: {
          category: { slug: { contains: search, mode: "insensitive" } },
        },
      };
      Object.assign(where, map[searchBy] ?? {});
    }

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: this.include,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      message: "Posts fetched successfully.",
      data: {
        posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.include,
    });
    if (!post) throw new NotFoundException("Post not found.");

    this.assertOwnership(post.authorId, currentUser);
    return { message: "Post fetched successfully.", data: post };
  }

  async create(dto: PostDto, currentUser: AuthUser) {
    const data = this.normalize(dto);
    this.assertPublishable(data);
    await this.assertSlugAvailable(data.slug);

    const post = await this.prisma.post.create({
      data: {
        ...data,
        authorId: currentUser.id,
        publishedAt: this.resolvePublishedAt(data, null),
      },
      include: this.include,
    });

    await this.audit.log({
      action: "create",
      entityType: "Post",
      entityId: post.id,
      userId: currentUser.id,
    });

    return { message: "Post created successfully.", data: post };
  }

  async update(id: string, dto: PostDto, currentUser: AuthUser) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Post not found.");
    this.assertOwnership(existing.authorId, currentUser);

    const patch = this.normalize(dto);
    // Publish rules run against the post as it will be, not just the patch.
    this.assertPublishable({ ...existing, ...patch });
    if (patch.slug && patch.slug !== existing.slug) {
      await this.assertSlugAvailable(patch.slug);
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        ...patch,
        publishedAt: this.resolvePublishedAt(
          { ...existing, ...patch },
          existing.publishedAt,
        ),
      },
      include: this.include,
    });

    await this.audit.log({
      action: "update",
      entityType: "Post",
      entityId: id,
      userId: currentUser.id,
    });

    return { message: "Post updated successfully.", data: post };
  }

  async remove(id: string, force: boolean, currentUser: AuthUser) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Post not found.");
    this.assertOwnership(existing.authorId, currentUser);

    if (force) {
      // Only an admin can destroy a post outright; everyone else soft-deletes.
      if (currentUser.role !== "admin") {
        throw new ForbiddenException(
          "Only an administrator can permanently delete a post.",
        );
      }
      await this.prisma.post.delete({ where: { id } });
    } else {
      await this.prisma.post.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }

    await this.audit.log({
      action: "delete",
      entityType: "Post",
      entityId: id,
      userId: currentUser.id,
      meta: { force },
    });

    return { message: "Post deleted successfully.", data: null };
  }

  async restore(id: string, currentUser: AuthUser) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Post not found.");
    this.assertOwnership(existing.authorId, currentUser);

    const post = await this.prisma.post.update({
      where: { id },
      data: { deletedAt: null },
      include: this.include,
    });

    await this.audit.log({
      action: "update",
      entityType: "Post",
      entityId: id,
      userId: currentUser.id,
      meta: { restored: true },
    });

    return { message: "Post restored successfully.", data: post };
  }

  // ── Public ────────────────────────────────────────────────────────────────

  async listPublic(query: PostQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = "publishedAt",
      sortOrder = "desc",
      search,
      categoryId,
    } = query;

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      status: "published",
      // A future publishedAt keeps a scheduled post out of the public list.
      OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {}),
    };

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: this.publicInclude,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      message: "Posts fetched successfully.",
      data: {
        posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPublicBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: "published",
        OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
      },
      include: this.publicInclude,
    });
    if (!post) throw new NotFoundException("Post not found.");

    return { message: "Post fetched successfully.", data: post };
  }

  /**
   * One view per visitor per post per day, so a refresh or a reload does not
   * inflate the count. The unique index carries that rule at the database level;
   * this just reports whether the view was new.
   */
  async trackView(slug: string, dto: TrackPostViewDto) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: "published",
        OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
      },
      select: { id: true, viewsCount: true },
    });
    if (!post) throw new NotFoundException("Post not found.");

    const visitorKey = dto.visitorKey ?? crypto.randomUUID();
    const viewedOn = new Date();
    viewedOn.setUTCHours(0, 0, 0, 0);

    const existing = await this.prisma.postView.findUnique({
      where: {
        postId_visitorKey_viewedOn: { postId: post.id, visitorKey, viewedOn },
      },
      select: { id: true },
    });

    if (existing) {
      return {
        message: "View already counted today.",
        data: { tracked: false, viewsCount: post.viewsCount, visitorKey },
      };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.postView.create({
        data: {
          postId: post.id,
          visitorKey,
          viewedOn,
          trafficSourceId: dto.trafficSourceId,
        },
      });
      return tx.post.update({
        where: { id: post.id },
        data: { viewsCount: { increment: 1 } },
        select: { viewsCount: true },
      });
    });

    return {
      message: "View tracked.",
      data: { tracked: true, viewsCount: updated.viewsCount, visitorKey },
    };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** An author may only touch their own posts. */
  private assertOwnership(authorId: string, currentUser: AuthUser) {
    if (currentUser.role !== "author") return;
    if (authorId !== currentUser.id) {
      throw new ForbiddenException("You can only manage your own posts.");
    }
  }

  private async assertSlugAvailable(slug?: string | null) {
    if (!slug) return;
    const clash = await this.prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (clash) {
      throw new BadRequestException("A post with this slug already exists.");
    }
  }

  /** Empty strings from a form mean "cleared", not "set to empty". */
  private normalize(dto: PostDto) {
    const out: Record<string, unknown> = { ...dto };
    for (const [key, value] of Object.entries(out)) {
      if (typeof value === "string" && value.trim() === "") out[key] = null;
    }
    return out as PostDto;
  }

  /**
   * Draft posts can be as incomplete as the writer likes. Publishing is the
   * point where the fields a reader and a crawler need have to be present.
   */
  private assertPublishable(post: Record<string, unknown>) {
    if (post.status !== "published") return;

    const missing = REQUIRED_TO_PUBLISH.filter((field) => {
      const value = post[field];
      if (typeof value !== "string") return true;
      // Rich text arrives as HTML, so strip tags before judging emptiness.
      const text =
        field === "content"
          ? value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
          : value;
      return text.trim().length === 0;
    });

    if (missing.length > 0) {
      throw new BadRequestException(
        `Cannot publish post. Missing required fields: ${missing.join(", ")}.`,
      );
    }
  }

  private resolvePublishedAt(
    post: Record<string, unknown>,
    existing: Date | null,
  ) {
    if (post.status === "draft") return null;
    if (post.status !== "published") return existing;
    if (post.publishedAt) return new Date(post.publishedAt as string);
    return existing ?? new Date();
  }

  private include = {
    author: { select: { id: true, displayName: true, email: true } },
    category: { select: { id: true, name: true, slug: true } },
    cover: true,
    headerImage: true,
  } satisfies Prisma.PostInclude;

  private publicInclude = {
    author: { select: { id: true, displayName: true } },
    category: { select: { id: true, name: true, slug: true } },
    cover: true,
    headerImage: true,
  } satisfies Prisma.PostInclude;
}
