import type z from "zod";
import type {
  CaregiverAccess,
  CaregiverInvitation,
  PatientProfile,
} from "@workspace/db/browser";
import type {
  caregiverAccessSchema,
  revokeCaregiverAccessSchema,
  caregiverAccessQuerySchema,
  sendCaregiverInvitationSchema,
  caregiverInvitationQuerySchema,
} from "./schema";
import type {
  BaseQueryResponse,
  CaregiverInvitationStatus,
  CaregiverRelationship,
  Sanitize,
} from "../lib/types";
import type { BaseUserResponse } from "../user/types";

export type CaregiverAccessType = z.input<typeof caregiverAccessSchema>;
export type RevokeCaregiverAccessType = z.input<
  typeof revokeCaregiverAccessSchema
>;
export type CaregiverAccessQueryType = z.input<
  typeof caregiverAccessQuerySchema
>;
export type SendCaregiverInvitationType = z.input<
  typeof sendCaregiverInvitationSchema
>;
export type CaregiverInvitationQueryType = z.input<
  typeof caregiverInvitationQuerySchema
>;

export type CaregiverAccessPatientResponse = Sanitize<
  Pick<PatientProfile, "id">
> & {
  user: BaseUserResponse;
};

export type CaregiverAccessResponse = Sanitize<CaregiverAccess> & {
  relationship: CaregiverRelationship;
  caregiver: BaseUserResponse;
  patient: CaregiverAccessPatientResponse;
  grantedBy: BaseUserResponse;
};

export interface CaregiverAccessQueryResponse extends BaseQueryResponse {
  caregiverAccesses: CaregiverAccessResponse[];
}

export type CaregiverInvitationResponse = Sanitize<CaregiverInvitation> & {
  status: CaregiverInvitationStatus;
  relationship: CaregiverRelationship;
  invitedBy: BaseUserResponse;
  patient: CaregiverAccessPatientResponse;
};

export interface CaregiverInvitationQueryResponse extends BaseQueryResponse {
  invitations: CaregiverInvitationResponse[];
}
