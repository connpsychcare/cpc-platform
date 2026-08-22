import type z from "zod";
import type {
  ClinicalFormResponse,
  PatientProfile,
} from "@workspace/db/browser";
import type { clinicalFormQuerySchema } from "./schema";
import type {
  BaseQueryResponse,
  ClinicalFormType,
  Sanitize,
} from "../lib/types";
import type { BaseUserResponse } from "../user/types";

export type ClinicalFormQueryType = z.input<typeof clinicalFormQuerySchema>;

export type ClinicalFormPatientResponse = Sanitize<
  Pick<PatientProfile, "id">
> & {
  user: BaseUserResponse;
};

/**
 * One submitted form. `responses` is the raw question/answer payload, which
 * varies by `formType`, so readers must key off the form type rather than
 * assume a shape.
 */
export type ClinicalFormItemResponse = Sanitize<ClinicalFormResponse> & {
  formType: ClinicalFormType;
  responses: Record<string, unknown>;
  patient?: ClinicalFormPatientResponse;
  administeredBy?: BaseUserResponse;
  teacherAssessmentToken?: {
    id: string;
    teacherName?: string;
    teacherEmail: string;
    schoolName?: string;
  };
};

export interface ClinicalFormQueryResponse extends BaseQueryResponse {
  forms: ClinicalFormItemResponse[];
}
