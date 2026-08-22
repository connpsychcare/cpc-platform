import type z from "zod";
import type {
  InsuranceAuthorization,
  PatientProfile,
} from "@workspace/db/browser";
import type {
  insuranceAuthorizationSchema,
  updateInsuranceAuthorizationSchema,
  insuranceAuthorizationQuerySchema,
} from "./schema";
import type {
  BaseQueryResponse,
  InsuranceAuthorizationStatus,
  Sanitize,
} from "../lib/types";
import type { BaseUserResponse } from "../user/types";
import type { TreatmentPlanResponse } from "../treatment-plan/types";

export type InsuranceAuthorizationType = z.input<
  typeof insuranceAuthorizationSchema
>;
export type UpdateInsuranceAuthorizationType = z.input<
  typeof updateInsuranceAuthorizationSchema
>;
export type InsuranceAuthorizationQueryType = z.input<
  typeof insuranceAuthorizationQuerySchema
>;

export type InsuranceAuthorizationPatientResponse = Sanitize<
  Pick<PatientProfile, "id">
> & {
  user: BaseUserResponse;
};

export type InsuranceAuthorizationTreatmentPlanResponse = Pick<
  TreatmentPlanResponse,
  "id" | "title"
>;

export type InsuranceAuthorizationResponse =
  Sanitize<InsuranceAuthorization> & {
    patient?: InsuranceAuthorizationPatientResponse;
    treatmentPlan?: InsuranceAuthorizationTreatmentPlanResponse;
    /** Derived: approvedHours - usedHours */
    remainingHours?: string;
    /** Derived: true when usedHours >= approvedHours * 0.8 */
    nearingLimit?: boolean;
  };

export interface InsuranceAuthorizationQueryResponse extends BaseQueryResponse {
  authorizations: InsuranceAuthorizationResponse[];
}
