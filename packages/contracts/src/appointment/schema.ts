import z from "zod";
import {
  AppointmentCancellationSourceEnum,
  AppointmentChannelEnum,
  AppointmentSearchByEnum,
  AppointmentSortByEnum,
  AppointmentStatusEnum,
  BookingSourceEnum,
  PaymentStatusEnum,
} from "../lib/enums";
import {
  baseQuerySchema,
  emailSchema,
  idSchema,
  isoDateSchema,
  nameSchema,
  optionalStringSchema,
  phoneSchema,
  timezoneSchema,
} from "../lib/schema";

export const createAppointmentSchema = z
  .object({
    patientId: idSchema,
    providerId: idSchema,
    channel: AppointmentChannelEnum,
    scheduledStartAt: isoDateSchema,
    scheduledEndAt: isoDateSchema,
    timezone: timezoneSchema,
    patientNotes: optionalStringSchema,
    bookingSource: BookingSourceEnum.default("app"),
  })
  .refine((v) => v.scheduledStartAt <= v.scheduledEndAt, {
    error: "Appointment end time must be after start time.",
  });

/**
 * Public booking from the marketing site. The visitor supplies their own contact details
 * instead of a patientId; the server resolves those to a brand-new patient account, or
 * rejects the request when an account already exists so the visitor signs in instead.
 */
export const guestAppointmentSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema.optional(),
    email: emailSchema,
    phone: phoneSchema,
    providerId: idSchema,
    channel: AppointmentChannelEnum.default("virtual"),
    scheduledStartAt: isoDateSchema,
    scheduledEndAt: isoDateSchema,
    timezone: timezoneSchema,
    patientNotes: optionalStringSchema,
  })
  .refine((v) => v.scheduledStartAt <= v.scheduledEndAt, {
    error: "Appointment end time must be after start time.",
  });

export const updateAppointmentStatusSchema = z.object({
  status: AppointmentStatusEnum,
  paymentStatus: PaymentStatusEnum.optional(),
  cancellationSource: AppointmentCancellationSourceEnum.optional(),
  cancellationReason: optionalStringSchema,
  providerNotes: optionalStringSchema,
  adminNotes: optionalStringSchema,
});

export const appointmentQuerySchema = baseQuerySchema(
  AppointmentSortByEnum,
  AppointmentSearchByEnum,
).extend({
  branchId: idSchema.optional(),
  providerId: idSchema.optional(),
  patientId: idSchema.optional(),
  status: AppointmentStatusEnum.optional(),
  paymentStatus: PaymentStatusEnum.optional(),
  channel: AppointmentChannelEnum.optional(),
  bookingSource: BookingSourceEnum.optional(),
  startsFrom: isoDateSchema.optional(),
  startsTo: isoDateSchema.optional(),
});
