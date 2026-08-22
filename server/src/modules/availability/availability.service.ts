import { BadRequestException, Injectable } from "@nestjs/common";
import type {
  AvailabilityScheduleDto,
  AvailabilitySlotsQueryDto,
} from "@workspace/contracts/availability/dto";
import type { AppointmentStatus, Prisma, Weekday } from "@workspace/db/client";

import { ProviderService } from "@/modules/provider/provider.service";
import { PrismaService } from "@/modules/prisma/prisma.service";

const ACTIVE_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "booked",
  "confirmed",
];

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
  ) {}

  async getSchedule(providerId: string) {
    const [rules, blockedTimes] = await Promise.all([
      this.prisma.providerAvailability.findMany({
        where: { providerId },
        orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
      }),
      this.prisma.providerBlockedTime.findMany({
        where: { providerId },
        orderBy: { startAt: "asc" },
      }),
    ]);

    return {
      message: "Availability fetched successfully.",
      data: { rules, blockedTimes },
    };
  }

  async replaceSchedule(
    providerId: string,
    dto: AvailabilityScheduleDto,
    currentUser: AuthUser,
  ) {
    await this.providerService.assertProviderAccess(currentUser, providerId);

    await this.prisma.$transaction(async (tx) => {
      await tx.providerAvailability.deleteMany({
        where: { providerId },
      });
      await tx.providerBlockedTime.deleteMany({ where: { providerId } });

      if (dto.rules.length) {
        await tx.providerAvailability.createMany({
          data: dto.rules.map((rule) => ({
            providerId,
            ...rule,
          })),
        });
      }

      if (dto.blockedTimes.length) {
        await tx.providerBlockedTime.createMany({
          data: dto.blockedTimes.map((blockedTime) => ({
            providerId,
            ...blockedTime,
          })),
        });
      }
    });

    return this.getSchedule(providerId);
  }

  async getAvailableSlots(
    providerId: string,
    query: AvailabilitySlotsQueryDto,
  ) {
    if (query.from >= query.to) {
      throw new BadRequestException("`from` must be earlier than `to`.");
    }

    const [rules, blockedTimes, appointments] = await Promise.all([
      this.prisma.providerAvailability.findMany({
        where: { providerId, isActive: true },
      }),
      this.prisma.providerBlockedTime.findMany({
        where: {
          providerId,
          startAt: { lt: query.to },
          endAt: { gt: query.from },
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          providerId,
          status: { in: ACTIVE_APPOINTMENT_STATUSES },
          scheduledStartAt: { lt: query.to },
          scheduledEndAt: { gt: query.from },
        },
        select: {
          scheduledStartAt: true,
          scheduledEndAt: true,
        },
      }),
    ]);

    // Blocked time is removed outright, but already-booked slots are kept and flagged so
    // booking UIs can show the full day and disable what is taken, rather than silently
    // hiding it and making a busy day look like no availability was ever offered.
    const slots = this.buildSlots(query.from, query.to, rules)
      .filter(
        (slot) =>
          !blockedTimes.some((blockedTime) =>
            this.overlaps(
              slot.startAt,
              slot.endAt,
              blockedTime.startAt,
              blockedTime.endAt,
            ),
          ),
      )
      .map((slot) => ({
        ...slot,
        isBooked: appointments.some((appointment) =>
          this.overlaps(
            slot.startAt,
            slot.endAt,
            appointment.scheduledStartAt,
            appointment.scheduledEndAt,
          ),
        ),
      }));

    return {
      message: "Available slots fetched successfully.",
      data: slots,
    };
  }

  async assertSlotAvailable(
    providerId: string,
    startAt: Date,
    endAt: Date,
  ) {
    const { data } = await this.getAvailableSlots(providerId, {
      from: startAt,
      to: endAt,
    });

    const available = data.some(
      (slot) =>
        !slot.isBooked &&
        slot.startAt.getTime() === startAt.getTime() &&
        slot.endAt.getTime() === endAt.getTime(),
    );

    if (!available) {
      throw new BadRequestException("Selected slot is not available.");
    }
  }

  private buildSlots(
    from: Date,
    to: Date,
    rules: Array<Prisma.ProviderAvailabilityGetPayload<Record<string, never>>>,
  ) {
    const slots: Array<{ startAt: Date; endAt: Date }> = [];
    const current = new Date(from);
    current.setUTCHours(0, 0, 0, 0);

    while (current < to) {
      const dayRules = rules.filter(
        (rule) => rule.weekday === this.weekdayFromDate(current),
      );

      for (const rule of dayRules) {
        let slotStart = this.combineDateAndTime(current, rule.startTime);
        const dayEnd = this.combineDateAndTime(current, rule.endTime);

        while (slotStart < dayEnd) {
          const slotEnd = new Date(
            slotStart.getTime() + rule.slotDurationMinute * 60 * 1000,
          );

          if (slotEnd > dayEnd) break;
          if (slotStart >= from && slotEnd <= to) {
            slots.push({ startAt: new Date(slotStart), endAt: slotEnd });
          }

          slotStart = slotEnd;
        }
      }

      current.setUTCDate(current.getUTCDate() + 1);
    }

    return slots;
  }

  private combineDateAndTime(date: Date, time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const result = new Date(date);
    result.setUTCHours(hours, minutes, 0, 0);
    return result;
  }

  private weekdayFromDate(date: Date): Weekday {
    return [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getUTCDay()] as Weekday;
  }

  private overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
    return startA < endB && endA > startB;
  }
}
