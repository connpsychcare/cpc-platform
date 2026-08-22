import type z from "zod";
import type { Appointment } from "@workspace/db/browser";
import type {
  appointmentQuerySchema,
  createAppointmentSchema,
  guestAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./schema";
import type { BaseQueryResponse, Sanitize } from "../lib/types";
import type { BranchResponse } from "../business/types";
import type { ProviderProfileResponse } from "../provider/types";
import type { PatientProfileResponse } from "../patient/types";
import type { PaymentResponse } from "../payment/types";
import type { ConversationResponse } from "../chat/types";

export type CreateAppointmentType = z.input<typeof createAppointmentSchema>;
export type GuestAppointmentType = z.input<typeof guestAppointmentSchema>;
export type UpdateAppointmentStatusType = z.input<
  typeof updateAppointmentStatusSchema
>;

export type AppointmentResponse = Sanitize<Appointment> & {
  branch: BranchResponse;
  provider: ProviderProfileResponse;
  patient: PatientProfileResponse;
  conversation?: ConversationResponse;
  payments?: PaymentResponse[];
};

export type AppointmentQueryType = z.input<typeof appointmentQuerySchema>;

export interface AppointmentQueryResponse extends BaseQueryResponse {
  appointments: AppointmentResponse[];
}
