import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  TestimonialDto,
  TestimonialQueryDto,
  SubmitTestimonialDto,
} from "@workspace/contracts/testimonial/dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

const include = {
  author: { omit: { password: true }, include: { avatar: true } },
} as const;

@Injectable()
export class TestimonialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: TestimonialDto) {
    const testimonial = await this.prisma.testimonial.create({
      data: dto,
      include,
    });
    return { message: "Testimonial created successfully.", data: testimonial };
  }

  async submit(dto: SubmitTestimonialDto, currentUser: AuthUser) {
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
      include: { user: { omit: { password: true } } },
    });

    if (dto.appointmentId) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: dto.appointmentId },
      });

      if (!appointment || appointment.patientId !== patient.id) {
        throw new ForbiddenException(
          "You can only submit a testimonial for your own appointments.",
        );
      }

      if (appointment.status !== "completed") {
        throw new ForbiddenException(
          "Testimonials can only be submitted for completed appointments.",
        );
      }

      const existing = await this.prisma.testimonial.findUnique({
        where: { appointmentId: dto.appointmentId },
      });

      if (existing) {
        throw new ConflictException(
          "A testimonial for this appointment already exists.",
        );
      }
    }

    const testimonial = await this.prisma.testimonial.create({
      data: {
        content: dto.content,
        rating: dto.rating ?? 5,
        patientId: patient.id,
        authorId: currentUser.id,
        authorName:
          patient.user.displayName ?? patient.user.firstName ?? "Patient",
        authorRole: "Patient",
        isPublished: false,
        ...(dto.appointmentId && { appointmentId: dto.appointmentId }),
      },
      include,
    });

    return {
      message: "Testimonial submitted successfully.",
      data: testimonial,
    };
  }

  async listMine(currentUser: AuthUser) {
    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });

    const items = await this.prisma.testimonial.findMany({
      where: { patientId: patient.id },
      include,
      orderBy: { createdAt: "desc" },
    });

    return {
      message: "Your testimonials fetched successfully.",
      data: {
        testimonials: items,
        total: items.length,
        page: 1,
        limit: items.length,
      },
    };
  }

  async list(query: TestimonialQueryDto) {
    const {
      page = 1,
      limit = 20,
      isPublished,
      patientId,
      includeIds = [],
    } = query;

    const where = {
      ...(isPublished !== undefined && { isPublished }),
      ...(patientId && { patientId }),
    };

    const [items, total] = await Promise.all([
      this.prisma.testimonial.findMany({
        where,
        include,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.testimonial.count({ where }),
    ]);
    const missingIncludeIds = getMissingIncludeIds(items, includeIds);
    const forcedItems = missingIncludeIds.length
      ? await this.prisma.testimonial.findMany({
          where: { id: { in: missingIncludeIds } },
          include,
        })
      : [];
    const mergedItems = mergeIncludedRows(items, forcedItems);

    return {
      message: "Testimonials fetched successfully.",
      data: { testimonials: mergedItems, total, page, limit },
    };
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
      include,
    });
    if (!testimonial) throw new NotFoundException("Testimonial not found.");
    return { message: "Testimonial fetched successfully.", data: testimonial };
  }

  async update(id: string, dto: Partial<TestimonialDto>) {
    await this.findOne(id);
    const updated = await this.prisma.testimonial.update({
      where: { id },
      data: dto,
      include,
    });
    return { message: "Testimonial updated successfully.", data: updated };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.testimonial.delete({ where: { id } });
    return { message: "Testimonial deleted successfully." };
  }
}
