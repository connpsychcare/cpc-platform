import type z from "zod";
import type { PatientProfile, SessionNote } from "@workspace/db/browser";
import type { sessionNoteSchema, sessionNoteQuerySchema } from "./schema";
import type { BaseQueryResponse, Sanitize } from "../lib/types";
import type { BaseUserResponse, UserResponse } from "../user/types";
import type { TreatmentPlanResponse } from "../treatment-plan/types";

export type SessionNoteType = z.input<typeof sessionNoteSchema>;
export type SessionNoteQueryType = z.input<typeof sessionNoteQuerySchema>;

export type SessionNotePatientResponse = Sanitize<
  Pick<PatientProfile, "id">
> & {
  user: BaseUserResponse;
};

export type SessionNoteTherapistResponse = BaseUserResponse & {
  role: UserResponse["role"];
};

export type SessionNoteTreatmentPlanResponse = Pick<
  TreatmentPlanResponse,
  "id" | "title"
>;

export type SessionNoteResponse = Sanitize<SessionNote> & {
  patient?: SessionNotePatientResponse;
  therapist?: SessionNoteTherapistResponse;
  treatmentPlan?: SessionNoteTreatmentPlanResponse;
};

export interface SessionNoteQueryResponse extends BaseQueryResponse {
  sessionNotes: SessionNoteResponse[];
}
