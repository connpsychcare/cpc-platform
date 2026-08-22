import { Controller, Put, Post, Param, Body, Get, Sse } from "@nestjs/common";
import type { Observable } from "rxjs";
import { ConfigurePushNotificationsDto } from "@workspace/contracts/notification/dto";

import { User } from "@/decorators/user.decorator";
import { PrismaService } from "@/modules/prisma/prisma.service";
import {
  NotificationSseService,
  type SseNotificationEvent,
} from "./notification.sse.service";
import { NotificationService } from "./notification.service";

@Controller("notifications")
export class NotificationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sseService: NotificationSseService,
    private readonly notificationService: NotificationService,
  ) {}

  @Sse("stream")
  stream(@User("id") userId: string): Observable<SseNotificationEvent> {
    return this.sseService.getStream(userId);
  }

  @Get()
  async getAllNotification(@User("id") userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: [
        {
          readAt: {
            sort: "asc",
            nulls: "first",
          },
        },
        { createdAt: "desc" },
      ],
    });

    return {
      message: "Notifications Fetched Successfully.",
      data: notifications,
    };
  }

  // Declared before the ":id" route so the literal path wins the match rather
  // than being read as a notification id.
  @Put("mark-all-read")
  async markAllAsRead(@User("id") userId: string) {
    const { count } = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });

    return {
      message: "All notifications marked as read.",
      data: { count },
    };
  }

  @Put("/:id")
  async markAsRead(@Param("id") id: string, @User("id") userId: string) {
    await this.prisma.notification.findFirstOrThrow({
      where: { id, userId },
    });

    await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return { message: "Notification read successfully." };
  }

  @Post("push/configure")
  async configurePushNotifications(
    @Body() dto: ConfigurePushNotificationsDto,
    @User() user: AuthUser,
  ) {
    return this.notificationService.configurePushNotifications(user, dto);
  }
}
