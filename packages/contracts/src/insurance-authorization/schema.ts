import { z } from "zod";
import {
  baseQuerySchema,
  idSchema,
  isoDateSchema,
  numberSchema,
  optionalStringSchema,
  requiredStringSchema,
} from "../lib/schema";
import { InsuranceAuthorizationStatusEnum } from "../lib/enums";

export const insuranceAuthorizationSchema = z.object({
  patientId: idSchema,
  treatmentPlanId: idSchema.optional(),
  insurancePlan: requiredStringSchema,
  authorizationNumber: requiredStringSchema,
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  approvedHours: numberSchema.positive(),
  usedHours: numberSchema.optional(),
  status: InsuranceAuthorizationStatusEnum.optional(),
  notes: optionalStringSchema,
});

export const updateInsuranceAuthorizationSchema = insuranceAuthorizationSchema
  .partial()
  .omit({ patientId: true });

export const insuranceAuthorizationQuerySchema = baseQuerySchema(
  // TODO move these to lib/enums as others
  z.enum(["startDate", "endDate", "approvedHours", "usedHours", "createdAt"]),
  z.enum(["insurancePlan", "authorizationNumber", "notes"]),
).extend({
  patientId: idSchema.optional(),
  treatmentPlanId: idSchema.optional(),
  status: InsuranceAuthorizationStatusEnum.optional(),
});
