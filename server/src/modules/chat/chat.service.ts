import { ForbiddenException, Injectable, forwardRef, Inject } from "@nestjs/common";
import type {
  SendMessageDto,
  UpdateConversationDto,
} from "@workspace/contracts/chat/dto";
import type { Prisma } from "@workspace/db/client";

import { ProviderService } from "@/modules/provider/provider.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { NotificationService } from "@/modules/notification/notification.service";
import { InjectLogger } from "@/decorators/logger.decorator";
import { LoggerService } from "@/modules/logger/logger.service";
import { ChatGateway } from "./chat.gateway";

@Injectable()
export class ChatService {
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  async listConversations(currentUser: AuthUser) {
    const where =
      currentUser.role === "patient"
        ? await this.prisma.patientProfile
            .findUniqueOrThrow({ where: { userId: currentUser.id } })
            .then((p) => ({ patientId: p.id }))
        : currentUser.role === "staff"
          ? // A staff user sees threads on their own appointments plus any
            // conversation assigned to them directly.
            await this.providerService
              .findProfileForUser(currentUser.id)
              .then((provider) => ({
                OR: [
                  ...(provider
                    ? [{ appointment: { providerId: provider.id } }]
                    : []),
                  { assignedToId: currentUser.id },
                ],
              }))
          : {};

    const conversations = await this.prisma.conversation.findMany({
      where,
      orderBy: [{ lastMessageAt: { sort: "desc", nulls: "last" } }],
      include: {
        ...this.conversationInclude,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: this.messageInclude,
        },
        _count: {
          select: {
            messages: {
              where: { readAt: null, senderId: { not: currentUser.id } },
            },
          },
        },
      },
    });

    const result = conversations.map(({ messages, _count, ...conv }) => ({
      ...conv,
      lastMessage: messages[0] ?? null,
      unreadCount: _count.messages,
    }));

    return { message: "Conversations fetched successfully.", data: result };
  }

  async getConversationByAppointment(
    appointmentId: string,
    currentUser: AuthUser,
  ) {
    this.logger.debug("Fetching conversation by appointment", {
      appointmentId,
      userId: currentUser.id,
      userRole: currentUser.role,
    });

    const conversation = await this.prisma.conversation.findUniqueOrThrow({
      where: { appointmentId },
      include: this.conversationInclude,
    });

    this.logger.debug("Conversation found for appointment", {
      appointmentId,
      conversationId: conversation.id,
      patientId: conversation.patientId,
      assignedToId: conversation.assignedToId,
      appointmentStatus: conversation.appointment?.status,
    });

    await this.assertConversationAccess(conversation, currentUser);
    return {
      message: "Conversation fetched successfully.",
      data: conversation,
    };
  }

  async listMessages(conversationId: string, currentUser: AuthUser) {
    const conversation = await this.prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: this.conversationInclude,
    });

    await this.assertConversationAccess(conversation, currentUser);

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: this.messageInclude,
    });

    return { message: "Messages fetched successfully.", data: messages };
  }

  async sendMessage(dto: SendMessageDto, currentUser: AuthUser) {
    this.logger.debug("Attempting to send chat message", {
      conversationId: dto.conversationId,
      bodyLength: dto.body.length,
      attachmentIdsCount: dto.attachmentIds.length,
      userId: currentUser.id,
      userRole: currentUser.role,
    });

    const conversation = await this.prisma.conversation.findUniqueOrThrow({
      where: { id: dto.conversationId },
      include: this.conversationInclude,
    });

    await this.assertConversationAccess(conversation, currentUser);
    this.assertMessagingAllowed(conversation);

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: currentUser.id,
        body: dto.body,
        attachments: dto.attachmentIds.length
          ? {
              createMany: {
                data: dto.attachmentIds.map((mediaId) => ({
                  mediaId,
                })),
              },
            }
          : undefined,
      },
      include: this.messageInclude,
    });

    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { lastMessageAt: new Date(), status: "open" },
    });

    this.logger.debug("Chat message persisted successfully", {
      conversationId: dto.conversationId,
      messageId: message.id,
      senderId: currentUser.id,
    });

    // Collect all participant user IDs for socket broadcasts
    const patientUser = conversation.patient?.user;
    const providerUser = conversation.appointment?.provider?.user;
    const assignedUser = conversation.assignedTo;
    const participantUserIds = [
      patientUser?.id,
      providerUser?.id,
      assignedUser?.id,
    ].filter((id): id is string => Boolean(id));

    // Broadcast new message to room subscribers + notify participant user rooms
    this.chatGateway.broadcastMessage(dto.conversationId, message, participantUserIds);

    // Send in-app + push notifications (fire-and-forget)
    const senderIsPatient = currentUser.role === "patient";
    const notificationMessage = senderIsPatient
      ? `You have a new message from a patient.`
      : `You have a new message regarding your appointment.`;

    const actionUrlForPatient = conversation.appointment?.id
      ? `/patient/appointments/${conversation.appointment.id}`
      : `/patient/messages`;
    const actionUrlForStaff = conversation.appointment?.id
      ? `/messages/${conversation.appointment.id}`
      : `/messages`;

    // Collect recipient user objects for notification
    const notificationRecipients: Array<{ user: any; identifier: string }> = [];

    if (senderIsPatient) {
      if (providerUser) {
        const id = providerUser.email ?? providerUser.phone;
        if (id) notificationRecipients.push({ user: providerUser, identifier: id });
      }
      if (assignedUser && assignedUser.id !== providerUser?.id) {
        const id = assignedUser.email ?? assignedUser.phone;
        if (id) notificationRecipients.push({ user: assignedUser, identifier: id });
      }
    } else {
      if (patientUser) {
        const id = patientUser.email ?? patientUser.phone;
        if (id) notificationRecipients.push({ user: patientUser, identifier: id });
      }
    }

    if (notificationRecipients.length) {
      this.notificationService
        .sendNotifications(notificationRecipients, {
          purpose: "newChatMessage",
          message: notificationMessage,
          actionUrl: senderIsPatient ? actionUrlForStaff : actionUrlForPatient,
        })
        .catch(() => {});
    }

    return { message: "Message sent successfully.", data: message };
  }

  async updateConversation(
    conversationId: string,
    dto: UpdateConversationDto,
    currentUser: AuthUser,
  ) {
    const conversation = await this.prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: this.conversationInclude,
    });

    await this.assertConversationAccess(conversation, currentUser);

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: dto.status,
        subject: dto.subject ?? conversation.subject,
      },
      include: this.conversationInclude,
    });

    return {
      message: "Conversation updated successfully.",
      data: updated,
    };
  }

  async markMessageRead(messageId: string, currentUser: AuthUser) {
    const message = await this.prisma.message.findUniqueOrThrow({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            appointment: {
              include: {
                patient: true,
                provider: true,
              },
            },
            patient: true,
          },
        },
      },
    });

    await this.assertConversationAccess(message.conversation, currentUser);

    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
      include: this.messageInclude,
    });

    // Broadcast read receipt to room so all participants update tick state
    if (message.senderId !== currentUser.id) {
      this.chatGateway.broadcastMessageRead(
        message.conversationId,
        messageId,
        updated.readAt!,
      );
    }

    return { message: "Message marked as read.", data: updated };
  }

  private async assertConversationAccess(
    conversation: any,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      if (conversation.assignedToId === currentUser.id) return;

      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (provider && conversation.appointment?.providerId === provider.id) {
        return;
      }

      throw new ForbiddenException(
        "You can only access your own conversations.",
      );
    }

    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });

    if (conversation.patientId !== patient.id) {
      throw new ForbiddenException(
        "You can only access your own conversations.",
      );
    }
  }

  private assertMessagingAllowed(conversation: any) {
    const appointmentStatus = conversation.appointment?.status;

    if (!appointmentStatus) {
      return;
    }

    if (!["booked", "confirmed"].includes(appointmentStatus)) {
      throw new ForbiddenException(
        "Messaging is only available for booked or confirmed appointments.",
      );
    }
  }

  private conversationInclude = {
    branch: true,
    patient: {
      include: {
        user: { omit: { password: true }, include: { avatar: true } },
      },
    },
    assignedTo: {
      omit: { password: true },
      include: { avatar: true },
    },
    appointment: {
      include: {
        provider: {
          include: {
            user: { omit: { password: true }, include: { avatar: true } },
          },
        },
        patient: {
          include: {
            user: { omit: { password: true }, include: { avatar: true } },
          },
        },
      },
    },
  } satisfies Prisma.ConversationInclude;

  private messageInclude = {
    sender: {
      omit: { password: true },
      include: { avatar: true },
    },
    attachments: {
      include: { media: true },
    },
  } satisfies Prisma.MessageInclude;
}
