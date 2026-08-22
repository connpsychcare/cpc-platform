import { Injectable } from "@nestjs/common";
import { resolveEmailTemplate } from "@workspace/templates";
import { appName } from "@workspace/shared/constants";
import type { ConfigurePushNotificationsDto } from "@workspace/contracts/notification/dto";

import { PushService } from "./push.service";
import { EmailService } from "./email.service";
import { MessagingService } from "./messaging.service";
import { NotificationSseService } from "./notification.sse.service";
import { InjectLogger } from "@/decorators/logger.decorator";
import { EnvService } from "@/modules/env/env.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { LoggerService } from "@/modules/logger/logger.service";
import type {
  NotificationChannel,
  NotificationPurpose,
  NotificationStatus,
} from "@workspace/contracts";
import type { SafeUser } from "@workspace/contracts/user";
import type { Otp } from "@workspace/db/client";

export type SendNotificationProps = {
  purpose: NotificationPurpose;
  identifier: string;
  user: SafeUser;
  otp?: Otp;
  actionUrl?: string;
} & Record<string, unknown>;

/**
 * Transactional purposes are delivered to the identifier (email/SMS) only.
 * No DB record, no in-app entry.
 *
 * Any notification that carries an OTP is also treated as identifier-only
 * regardless of purpose - the secret must never reach the in-app feed.
 */
const TRANSACTIONAL_PURPOSES = new Set<NotificationPurpose>([
  "signUp",
  "newsletter",
  "contactMessage",
]);

@Injectable()
export class NotificationService {
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly env: EnvService,
    private readonly emailService: EmailService,
    private readonly messagingService: MessagingService,
    private readonly pushService: PushService,
    private readonly sseService: NotificationSseService,
  ) {}

  /** Send to a single recipient. */
  async sendNotification(props: SendNotificationProps) {
    const { html, subject, message } = await resolveEmailTemplate(props);

    // OTP-bearing notifications and purely transactional purposes are delivered
    // to the identifier (email/SMS) only - no DB record, no in-app notification.
    if (props.otp || TRANSACTIONAL_PURPOSES.has(props.purpose)) {
      const isEmail = props.identifier.includes("@");
      try {
        if (isEmail) {
          await this.sendEmail(props.identifier, subject, html);
        } else {
          await this.sendMessage("sms", props.identifier, message);
        }
      } catch (error) {
        this.logger.error("Transactional notification delivery failed", {
          purpose: props.purpose,
          identifier: props.identifier,
          error,
        });
        throw error;
      }
      return;
    }

    // All other purposes (security confirmations, care events) create an
    // in-app record and are delivered via push when the user has it enabled.
    const channels = this.resolveChannels(props.user);

    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: props.user.id,
          recipient: props.identifier,
          purpose: props.purpose,
          channels,
          title: subject,
          message,
          meta: { ...props, otp: undefined } as any,
        },
      });

      this.sseService.emit(props.user.id, {
        type: "notification",
        id: notification.id,
      });

      let allSuccess = true;
      let anySuccess = false;

      for (const channel of channels) {
        try {
          if (channel === "push") {
            await this.sendPush(
              props.user,
              subject,
              message,
              props.actionUrl,
              notification.id,
            );
          }
          anySuccess = true;
        } catch (error) {
          allSuccess = false;
          this.logger.error("Notification channel delivery failed", {
            purpose: props.purpose,
            channel,
            error,
          });
        }
      }

      const status: NotificationStatus = allSuccess
        ? "sent"
        : anySuccess
          ? "partial"
          : "failed";

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status },
      });
    } catch (error) {
      this.logger.error("Notification send failed", {
        purpose: props.purpose,
        identifier: props.identifier,
        error,
      });
      throw error;
    }
  }

  /**
   * Send the same notification to multiple recipients concurrently.
   * Each recipient gets their own Notification record.
   */
  async sendNotifications(
    recipients: Array<{ user: SafeUser; identifier: string }>,
    props: Omit<SendNotificationProps, "user" | "identifier">,
  ) {
    await Promise.allSettled(
      recipients.map(({ user, identifier }) =>
        this.sendNotification({ ...props, user, identifier } as any),
      ),
    );
  }

  async sendEmail(to: string, subject: string, html: string) {
    const from = `${appName.default} <${this.env.get("SMTP_USER")}>`;
    await this.emailService.sendMail({ from, to, subject, html });
  }

  async sendMessage(type: "sms" | "whatsapp", to: string, text: string) {
    if (type === "sms") {
      await this.messagingService.sendSms(to, text);
    } else {
      await this.messagingService.sendWhatsapp(to, text);
    }
  }

  async sendPush(
    user: SafeUser,
    subject: string,
    message: string,
    href?: string,
    notificationId?: string,
  ) {
    await this.pushService.sendPush(user, subject, message, href, notificationId);
  }

  async configurePushNotifications(
    user: AuthUser,
    { payload }: ConfigurePushNotificationsDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: user.sessionId },
        data: payload.enabled
          ? { pushToken: payload.token, pushProvider: payload.provider }
          : { pushToken: null, pushProvider: null },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { pushNotifications: payload.enabled },
      });

      return {
        message: payload.enabled
          ? "Push notifications enabled."
          : "Push notifications disabled.",
      };
    });
  }

  private resolveChannels(user: SafeUser): NotificationChannel[] {
    const channels: NotificationChannel[] = [];
    if (user.pushNotifications) {
      channels.push("push");
    }
    return channels;
  }
}
