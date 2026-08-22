import type { Request } from "express";
import { Injectable } from "@nestjs/common";
import type {
  ContactMessageQueryDto,
  CreateContactMessageDto,
  UpdateContactMessageDto,
} from "@workspace/contracts/contact/dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { NotificationService } from "@/modules/notification/notification.service";
import { resolveEmailTemplate } from "@workspace/templates";
import type { ContactMessage, Prisma } from "@workspace/db/client";
import { ClientService } from "@/modules/client/client.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notify: NotificationService,
    private readonly client: ClientService,
  ) {}

  async createMessage(dto: CreateContactMessageDto, req?: Request) {
    const message = await this.prisma.contactMessage.create({
      data: {
        ...dto,
        trafficSourceId: req && this.client.getTrafficSourceId(req),
      },
    });

    await this.notifyUser(message);

    return {
      message: "Contact message created successfully.",
    };
  }

  async updateMessage(id: string, dto: UpdateContactMessageDto) {
    const message = await this.prisma.contactMessage.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.status === "replied" ? { repliedAt: new Date() } : {}),
      },
    });

    if (dto.status === "replied") await this.notifyUser(message);

    return {
      message: "Contact message updated successfully.",
    };
  }

  async getMessage(id: string) {
    const message = await this.prisma.contactMessage.findFirstOrThrow({
      where: { id },
    });

    return {
      message: "Contact message fetched successfully.",
      data: message,
    };
  }

  async queryMessages(query: ContactMessageQueryDto) {
    const { page, limit, status, search, searchBy, sortBy, sortOrder, includeIds = [], includeDeleted } = query;

    const where: Prisma.ContactMessageWhereInput = {
      deletedAt: includeDeleted ? { not: null } : null,
    };
    if (status) where.status = status;

    if (search && searchBy) {
      const searchWhereMap: Record<
        typeof searchBy,
        Prisma.ContactMessageWhereInput
      > = {
        email: {
          email: { contains: search, mode: "insensitive" },
        },
        phone: {
          phone: { contains: search, mode: "insensitive" },
        },
        name: {
          firstName: { contains: search, mode: "insensitive" },
        },
        subject: {
          subject: { contains: search, mode: "insensitive" },
        },
      };
      Object.assign(where, searchWhereMap[searchBy]);
    }

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder };

    const [messages, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(messages, includeIds);
    const forcedMessages = missingIncludeIds.length
      ? await this.prisma.contactMessage.findMany({
          where: {
            id: { in: missingIncludeIds },
            deletedAt: includeDeleted ? { not: null } : null,
          },
        })
      : [];
    const mergedMessages = mergeIncludedRows(messages, forcedMessages);

    return {
      message: "Messages fetched successfully.",
      data: {
        messages: mergedMessages,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteMessage(id: string) {
    await this.prisma.contactMessage.delete({
      where: { id },
    });

    return { message: "Contact message deleted successfully." };
  }

  async restoreMessage(id: string) {
    await this.prisma.contactMessage.update({
      where: { id },
      data: { deletedAt: null },
    });

    return { message: "Contact message restored successfully." };
  }

  private async notifyUser(contactMessage: ContactMessage) {
    const { subject, html } = await resolveEmailTemplate({
      purpose: "contactMessage",
      contactMessage,
    });

    await this.notify.sendEmail(contactMessage.email, subject, html);
  }
}
