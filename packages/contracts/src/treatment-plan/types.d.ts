import type z from "zod";
import type {
  ProviderProfile,
  PatientProfile,
  TreatmentPlan,
} from "@workspace/db/browser";
import type { treatmentPlanSchema, treatmentPlanQuerySchema } from "./schema";
import type {
  BaseQueryResponse,
  Sanitize,
  TreatmentPlanStatus,
} from "../lib/types";
import type { BaseUserResponse } from "../user/types";
import type { BehaviorProgramResponse } from "../behavior-program/types";

export type TreatmentPlanType = z.input<typeof treatmentPlanSchema>;
export type TreatmentPlanQueryType = z.input<typeof treatmentPlanQuerySchema>;

export type TreatmentPlanPatientResponse = Sanitize<
  Pick<PatientProfile, "id">
> & {
  user: BaseUserResponse;
};

export type TreatmentPlanProviderResponse = Sanitize<
  Pick<ProviderProfile, "id">
> & {
  user: BaseUserResponse;
};

export type TreatmentPlanResponse = Sanitize<TreatmentPlan> & {
  patient?: TreatmentPlanPatientResponse;
  createdBy?: BaseUserResponse;
  provider?: TreatmentPlanProviderResponse;
  programs?: BehaviorProgramResponse[];
  /** Program count, so a list row can summarise a plan without loading it. */
  _count?: { programs: number };
};

export interface TreatmentPlanQueryResponse extends BaseQueryResponse {
  treatmentPlans: TreatmentPlanResponse[];
}
