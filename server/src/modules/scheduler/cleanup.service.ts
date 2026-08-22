import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { InjectLogger } from "@/decorators/logger.decorator";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { LoggerService } from "@/modules/logger/logger.service";
import { NotificationService } from "@/modules/notification/notification.service";

@Injectable()
export class CleanupService {
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  // ─── Auth Cleanup ─────────────────────────────────────────────────────────

  @Cron(CronExpression.EVERY_HOUR)
  async handleOtpCleanup() {
    this.logger.log("🧹 Running OTP cleanup job...");
    const result = await this.prisma.otp.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    this.logger.log(`✅ Deleted ${result.count} expired OTPs`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRefreshTokenCleanup() {
    this.logger.log("🧹 Running Session Revokes job...");
    const updated = await this.prisma.session.updateMany({
      where: { expiresAt: { lt: new Date() } },
      data: { status: "expired" },
    });
    this.logger.log(`✅ Updated ${updated.count} expired sessions`);

    const deleted = await this.prisma.session.deleteMany({
      where: {
        pushToken: null,
        OR: [{ expiresAt: { lt: new Date() } }, { status: "revoked" }],
      },
    });
    this.logger.log(`✅ Deleted ${deleted.count} expired sessions`);
  }

  // ─── Appointment Jobs ─────────────────────────────────────────────────────

  /** Daily at 7 AM - send reminders for appointments in the next 24h */
  @Cron("0 7 * * *")
  async handleAppointmentReminders() {
    this.logger.log("🔔 Running appointment reminder job...");

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        scheduledStartAt: { gte: in24h, lte: in25h },
        status: { in: ["booked", "confirmed"] },
      },
      include: {
        patient: {
          include: { user: { omit: { password: true } } },
        },
        provider: {
          include: { user: { omit: { password: true } } },
        },
      },
    });

    let sent = 0;
    for (const appt of appointments) {
      const patientUser = appt.patient?.user;
      if (!patientUser) continue;

      const identifier = patientUser.email ?? patientUser.phone;
      if (!identifier) continue;

      const providerName =
        appt.provider?.user?.displayName ?? "your provider";
      const dateStr = appt.scheduledStartAt.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const timeStr = appt.scheduledStartAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      try {
        await this.notificationService.sendNotification({
          purpose: "appointmentReminder",
          identifier,
          user: patientUser as any,
          message: `Reminder: You have an appointment with ${providerName} tomorrow, ${dateStr} at ${timeStr}.`,
          actionUrl: `/patient/appointments/${appt.id}`,
        });
        sent++;
      } catch (error) {
        this.logger.error("Failed to send appointment reminder", {
          appointmentId: appt.id,
          error,
        });
      }
    }

    this.logger.log(`✅ Sent ${sent} appointment reminders`);
  }

  /** Every hour - auto-mark no-shows for past appointments still in booked/confirmed */
  @Cron(CronExpression.EVERY_HOUR)
  async handleNoShowMarking() {
    this.logger.log("🕐 Running no-show marking job...");

    const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 min ago

    const result = await this.prisma.appointment.updateMany({
      where: {
        scheduledStartAt: { lt: cutoff },
        status: { in: ["booked", "confirmed"] },
      },
      data: { status: "noShow" },
    });

    this.logger.log(`✅ Marked ${result.count} appointments as no-show`);
  }

  // ─── Inventory Jobs ───────────────────────────────────────────────────────

  /** Daily at 8 AM - alert admin/staff about low-stock products */

  // ─── Soft-Delete Purge ────────────────────────────────────────────────────

  /** Daily at 2 AM - permanently delete soft-deleted records older than 30 days */
  @Cron("0 2 * * *")
  async handleSoftDeletePurge() {
    this.logger.log("🗑️  Running soft-delete purge job...");

    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [users, branches, messages, subscribers] =
      await Promise.all([
        this.prisma.user.deleteMany({
          where: { deletedAt: { lt: cutoff, not: null } },
        }),
        this.prisma.branch.deleteMany({
          where: { deletedAt: { lt: cutoff, not: null } },
        }),
        this.prisma.contactMessage.deleteMany({
          where: { deletedAt: { lt: cutoff, not: null } },
        }),
        this.prisma.newsletterSubscriber.deleteMany({
          where: { deletedAt: { lt: cutoff, not: null } },
        }),
      ]);

    this.logger.log(
      `✅ Purged: ${users.count} users, ${branches.count} branches, ` +
        `${messages.count} contact messages, ${subscribers.count} newsletter subscribers`,
    );
  }
}
