import { createZodDto } from "nestjs-zod";
import {
  appointmentQuerySchema,
  createAppointmentSchema,
  guestAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./schema";

export class CreateAppointmentDto extends createZodDto(
  createAppointmentSchema,
) {}

export class GuestAppointmentDto extends createZodDto(guestAppointmentSchema) {}

export class UpdateAppointmentStatusDto extends createZodDto(
  updateAppointmentStatusSchema,
) {}

export class AppointmentQueryDto extends createZodDto(appointmentQuerySchema) {}
