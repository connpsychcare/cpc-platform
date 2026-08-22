import { Injectable, NotFoundException } from "@nestjs/common";
import type { JobListingDto, JobListingQueryDto } from "@workspace/contracts/job-listing/dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

@Injectable()
export class JobListingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: JobListingDto) {
    const job = await this.prisma.jobListing.create({ data: dto });
    return { message: "Job listing created successfully.", data: job };
  }

  async list(query: JobListingQueryDto) {
    const { page = 1, limit = 20, isActive, type, locationType, includeIds = [] } = query;

    const where = {
      ...(isActive !== undefined && { isActive }),
      ...(type && { type }),
      ...(locationType && { locationType }),
    };

    const [items, total] = await Promise.all([
      this.prisma.jobListing.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.jobListing.count({ where }),
    ]);
    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.jobListing.findMany({
          where: { id: { in: missingIncludeIds } },
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Job listings fetched successfully.",
      data: { jobListings: mergedItems, total, page, limit },
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.jobListing.findUnique({ where: { id } });
    if (!job) throw new NotFoundException("Job listing not found.");
    return { message: "Job listing fetched successfully.", data: job };
  }

  async update(id: string, dto: Partial<JobListingDto>) {
    await this.findOne(id);
    const updated = await this.prisma.jobListing.update({
      where: { id },
      data: dto,
    });
    return { message: "Job listing updated successfully.", data: updated };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.jobListing.delete({ where: { id } });
    return { message: "Job listing deleted successfully." };
  }

  async listActive() {
    const items = await this.prisma.jobListing.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return { message: "Job listings fetched successfully.", data: items };
  }
}
