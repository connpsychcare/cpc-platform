import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import type {
  AppointmentQueryDto,
  CreateAppointmentDto,
  GuestAppointmentDto,
  UpdateAppointmentStatusDto,
} from "@workspace/contracts/appointment/dto";
import type { AppointmentStatus, Prisma } from "@workspace/db/client";
import { createReference } from "@workspace/shared/utils";

import { AvailabilityService } from "@/modules/availability/availability.service";
import { ProviderService } from "@/modules/provider/provider.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { NotificationService } from "@/modules/notification/notification.service";
import { InjectLogger } from "@/decorators/logger.decorator";
import { LoggerService } from "@/modules/logger/logger.service";
import { getMissingIncludeIds, mergeIncludedRows } from "@/lib/query";

@Injectable()
export class AppointmentService {
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
    private readonly providerService: ProviderService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateAppointmentDto, currentUser: AuthUser) {
    await this.validateBookingAccess(dto, currentUser);
    return this.persistBooking(dto, currentUser.id);
  }

  /** Slot check, appointment row, and its chat conversation. Shared by the authenticated
   *  and public booking paths so both produce an identical appointment record. */
  private async persistBooking(dto: CreateAppointmentDto, createdById: string) {
    const provider = await this.ensureProvider(dto);
    await this.availabilityService.assertSlotAvailable(
      dto.providerId,
      dto.scheduledStartAt,
      dto.scheduledEndAt,
    );

    const appointment = await this.prisma.appointment.create({
      data: {
        ...dto,
        branchId: provider.branchId,
        createdById,
        appointmentNumber: createReference("appointment"),
      },
      include: this.appointmentInclude,
    });

    this.logger.debug("Appointment created; creating chat conversation", {
      appointmentId: appointment.id,
      appointmentNumber: appointment.appointmentNumber,
      patientId: appointment.patientId,
      providerId: appointment.providerId,
      assignedToId: appointment.provider.userId,
      createdById,
    });

    const conversation = await this.prisma.conversation.create({
      data: {
        branchId: appointment.branchId,
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        assignedToId: appointment.provider.userId,
        type: "appointment",
        subject: `Appointment ${appointment.appointmentNumber}`,
      },
    });

    this.logger.debug("Chat conversation created for appointment", {
      appointmentId: appointment.id,
      conversationId: conversation.id,
      patientId: appointment.patientId,
      assignedToId: appointment.provider.userId,
    });

    return {
      message: "Appointment booked successfully.",
      data: appointment,
    };
  }

  /**
   * Books an appointment for a visitor who does not have an account yet.
   *
   * If the supplied email or phone already belongs to an account we refuse rather than
   * silently attaching the booking, so a stranger cannot create appointments against
   * someone else's record - the caller is told to sign in instead. Otherwise a pending
   * patient account is provisioned (no password; they set one via the normal
   * set-password flow) and the booking proceeds through the same path as an in-app one.
   */
  async createAsGuest(dto: GuestAppointmentDto) {
    const { firstName, lastName, email, phone, ...booking } = dto;

    const existing = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email }, { phone }],
      },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(
        "An account already exists with these details. Please sign in to finish booking.",
      );
    }

    // Validate the slot before provisioning an account, so a taken slot cannot leave
    // behind an orphaned patient record.
    await this.ensureProvider(booking);
    await this.availabilityService.assertSlotAvailable(
      booking.providerId,
      booking.scheduledStartAt,
      booking.scheduledEndAt,
    );

    const patient = await this.prisma.patientProfile.create({
      data: {
        user: {
          create: {
            firstName,
            lastName,
            displayName: [firstName, lastName].filter(Boolean).join(" "),
            email,
            phone,
            role: "patient",
            status: "pending",
          },
        },
      },
      select: { id: true, userId: true },
    });

    this.logger.debug("Guest patient account provisioned for booking", {
      patientId: patient.id,
      userId: patient.userId,
    });

    return this.persistBooking(
      { ...booking, patientId: patient.id, bookingSource: "app" },
      patient.userId,
    );
  }

  async list(query: AppointmentQueryDto, currentUser: AuthUser) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      searchBy,
      branchId,
      providerId,
      patientId,
      status,
      paymentStatus,
      channel,
      bookingSource,
      startsFrom,
      startsTo,
      includeIds = [],
    } = query;

    const where: Prisma.AppointmentWhereInput = {};

    if (branchId) where.branchId = branchId;
    if (providerId) where.providerId = providerId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (channel) where.channel = channel;
    if (bookingSource) where.bookingSource = bookingSource;
    if (startsFrom || startsTo) {
      where.scheduledStartAt = {
        ...(startsFrom ? { gte: startsFrom } : {}),
        ...(startsTo ? { lte: startsTo } : {}),
      };
    }

    await this.applyRoleScope(where, currentUser);

    if (search && searchBy) {
      const searchWhereMap: Record<
        typeof searchBy,
        Prisma.AppointmentWhereInput
      > = {
        id: {
          OR: [
            { id: search },
            { appointmentNumber: { contains: search, mode: "insensitive" } },
          ],
        },
        status: { status: search as AppointmentStatus },
        providerName: {
          provider: {
            user: { displayName: { contains: search, mode: "insensitive" } },
          },
        },
        patientName: {
          patient: {
            user: { displayName: { contains: search, mode: "insensitive" } },
          },
        },
        appointmentNumber: {
          appointmentNumber: { contains: search, mode: "insensitive" },
        },
      };

      Object.assign(where, searchWhereMap[searchBy]);
    }

    const skip = (page - 1) * limit;
    const orderBy =
      sortBy === "scheduledStartAt"
        ? { scheduledStartAt: sortOrder }
        : { [sortBy]: sortOrder };

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: this.appointmentInclude,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    const missingIncludeIds = getMissingIncludeIds(appointments, includeIds);
    const forcedAppointments = missingIncludeIds.length
      ? await this.prisma.appointment.findMany({
          where: {
            id: { in: missingIncludeIds },
            // A staff user reaches an appointment either as its provider or
            // through an active caseload assignment on the patient.
            ...(currentUser.role === "staff"
              ? {
                  OR: [
                    ...(where.providerId
                      ? [{ providerId: where.providerId }]
                      : []),
                    {
                      patient: {
                        staffAssignments: {
                          some: { staffId: currentUser.id, isActive: true },
                        },
                      },
                    },
                  ],
                }
              : currentUser.role === "patient"
                ? { patientId: where.patientId }
                : {}),
          },
          include: this.appointmentInclude,
        })
      : [];
    const mergedAppointments = mergeIncludedRows(
      appointments,
      forcedAppointments,
    );

    return {
      message: "Appointments fetched successfully.",
      data: {
        appointments: mergedAppointments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(appointmentId: string, currentUser: AuthUser) {
    const appointment = await this.prisma.appointment.findUniqueOrThrow({
      where: { id: appointmentId },
      include: this.appointmentInclude,
    });

    await this.assertAppointmentAccess(appointment, currentUser);

    return {
      message: "Appointment fetched successfully.",
      data: appointment,
    };
  }

  async updateStatus(
    appointmentId: string,
    dto: UpdateAppointmentStatusDto,
    currentUser: AuthUser,
  ) {
    const appointment = await this.prisma.appointment.findUniqueOrThrow({
      where: { id: appointmentId },
      include: this.appointmentInclude,
    });

    await this.assertStatusUpdateAccess(appointment, dto.status, currentUser);

    const timestamps = this.statusTimestamps(dto.status);
    const cancellationSource =
      dto.status === "cancelled" ? currentUser.role : undefined;

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: dto.status,
        paymentStatus: dto.paymentStatus ?? appointment.paymentStatus,
        providerNotes: dto.providerNotes ?? appointment.providerNotes,
        adminNotes: dto.adminNotes ?? appointment.adminNotes,
        cancellationReason:
          dto.cancellationReason ?? appointment.cancellationReason,
        ...(cancellationSource
          ? {
              cancellationSource:
                dto.cancellationSource ?? (cancellationSource as any),
            }
          : {}),
        ...timestamps,
      },
      include: this.appointmentInclude,
    });

    const patientUser = updated.patient?.user;
    const statusMessages: Record<string, string> = {
      confirmed: "Your appointment has been confirmed.",
      cancelled: "Your appointment has been cancelled.",
      completed: "Your appointment has been marked as completed.",
      noShow: "Your appointment was marked as a no-show.",
      booked: "Your appointment has been booked.",
    };
    const statusMessage = statusMessages[dto.status];
    if (patientUser && statusMessage) {
      const identifier = patientUser.email ?? patientUser.phone;
      if (identifier) {
        this.notificationService
          .sendNotification({
            purpose: "appointmentStatus",
            identifier,
            user: patientUser as any,
            message: statusMessage,
            actionUrl: `/patient/appointments/${updated.id}`,
          })
          .catch(() => {});

        if (dto.status === "completed") {
          this.notificationService
            .sendNotification({
              purpose: "testimonialRequest",
              identifier,
              user: patientUser as any,
              message:
                "We'd love to hear about your experience! Share your feedback by leaving a testimonial.",
              actionUrl: `/patient/testimonials`,
            })
            .catch(() => {});
        }
      }
    }

    return {
      message: "Appointment updated successfully.",
      data: updated,
    };
  }

  private async validateBookingAccess(
    dto: CreateAppointmentDto,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "patient") {
      const patientProfile = await this.prisma.patientProfile.findUniqueOrThrow(
        {
          where: { userId: currentUser.id },
        },
      );

      if (patientProfile.id !== dto.patientId) {
        throw new ForbiddenException(
          "You can only book appointments for yourself.",
        );
      }

      return;
    }

    if (currentUser.role === "staff") {
      const providerProfile = await this.providerService.findByUserIdOrThrow(
        currentUser.id,
      );

      if (providerProfile.id !== dto.providerId) {
        throw new ForbiddenException(
          "Providers can only book appointments for themselves.",
        );
      }
    }
  }

  private async ensureProvider(dto: Pick<CreateAppointmentDto, "providerId">) {
    const provider = await this.prisma.providerProfile.findUniqueOrThrow({
      where: { id: dto.providerId },
      include: {
        branch: true,
      },
    });

    if (!provider.isAvailable) {
      throw new BadRequestException("Provider is not available for booking.");
    }

    return provider;
  }

  private async applyRoleScope(
    where: Prisma.AppointmentWhereInput,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      // Reception and billing staff have no provider profile, so the provider
      // arm only applies to the ones who actually see patients.
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );

      where.OR = [
        ...(provider ? [{ providerId: provider.id }] : []),
        {
          patient: {
            staffAssignments: {
              some: { staffId: currentUser.id, isActive: true },
            },
          },
        },
      ];
      return;
    }

    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    where.patientId = patient.id;
  }

  private async assertAppointmentAccess(
    appointment: any,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (provider && appointment.providerId === provider.id) return;

      const assignment = await this.prisma.staffAssignment.findFirst({
        where: {
          patientId: appointment.patientId,
          staffId: currentUser.id,
          isActive: true,
        },
        select: { id: true },
      });

      if (!assignment) {
        throw new ForbiddenException(
          "You can only view your own appointments or assigned patients.",
        );
      }
      return;
    }

    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });

    if (appointment.patientId !== patient.id) {
      throw new ForbiddenException("You can only view your own appointments.");
    }
  }

  private async assertStatusUpdateAccess(
    appointment: any,
    nextStatus: AppointmentStatus,
    currentUser: AuthUser,
  ) {
    if (currentUser.role === "admin") return;

    if (currentUser.role === "staff") {
      // Only the provider on the appointment may move its status. Other staff,
      // including assigned caseload staff, can view but not change it.
      const provider = await this.providerService.findProfileForUser(
        currentUser.id,
      );
      if (!provider || appointment.providerId !== provider.id) {
        throw new ForbiddenException(
          "Only the provider on this appointment can update its status.",
        );
      }

      const allowed: AppointmentStatus[] = [
        "confirmed",
        "completed",
        "cancelled",
        "noShow",
      ];
      if (!allowed.includes(nextStatus)) {
        throw new ForbiddenException(
          "Providers cannot set this appointment status.",
        );
      }
      return;
    }

    const patient = await this.prisma.patientProfile.findUniqueOrThrow({
      where: { userId: currentUser.id },
    });
    if (appointment.patientId !== patient.id || nextStatus !== "cancelled") {
      throw new ForbiddenException(
        "Patients can only cancel their own appointments.",
      );
    }
  }

  private statusTimestamps(status: AppointmentStatus) {
    switch (status) {
      case "confirmed":
        return { confirmedAt: new Date() };
      case "cancelled":
        return { cancelledAt: new Date() };
      case "completed":
        return { completedAt: new Date() };
      default:
        return {};
    }
  }

  private appointmentInclude = {
    branch: true,
    provider: {
      include: {
        user: { omit: { password: true }, include: { avatar: true } },
        branch: true,
      },
    },
    patient: {
      include: {
        user: { omit: { password: true }, include: { avatar: true } },
      },
    },
    conversation: true,
    payments: true,
  } satisfies Prisma.AppointmentInclude;
}
