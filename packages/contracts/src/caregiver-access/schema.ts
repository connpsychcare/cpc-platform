import { z } from "zod";
import {
  baseQuerySchema,
  optionalStringSchema,
  idSchema,
  booleanSchema,
  requiredStringSchema,
} from "../lib/schema";
import {
  CaregiverInvitationStatusEnum,
  CaregiverRelationshipEnum,
} from "../lib/enums";

export const caregiverAccessSchema = z.object({
  patientIds: z.array(idSchema).min(1, "Select at least one patient."),
  caregiverIds: z.array(idSchema).min(1, "Select at least one caregiver."),
  relationship: CaregiverRelationshipEnum.optional(),
  notes: optionalStringSchema,
});

export const revokeCaregiverAccessSchema = z.object({
  notes: optionalStringSchema,
});

export const caregiverAccessQuerySchema = baseQuerySchema(
  z.enum(["grantedAt", "revokedAt"]),
  z.enum(["notes"]),
  "grantedAt",
).extend({
  patientId: idSchema.optional(),
  caregiverId: idSchema.optional(),
  isActive: booleanSchema.optional(),
});

export const sendCaregiverInvitationSchema = z.object({
  patientId: idSchema,
  invitedEmail: z.string().email("Enter a valid email address."),
  relationship: CaregiverRelationshipEnum.default("parent"),
  notes: optionalStringSchema,
});

export const respondCaregiverInvitationSchema = z.object({
  // sent as query param on the public accept/reject routes
});

export const caregiverInvitationQuerySchema = baseQuerySchema(
  z.enum(["createdAt", "expiresAt"]),
  z.enum(["invitedEmail", "status"]),
).extend({
  patientId: idSchema.optional(),
  status: CaregiverInvitationStatusEnum.optional(),
});
