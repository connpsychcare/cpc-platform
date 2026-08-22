import { z } from "zod";
import {
  baseQuerySchema,
  idSchema,
  isoDateSchema,
  nameSchema,
  optionalStringSchema,
} from "../lib/schema";
import { TreatmentPlanStatusEnum } from "../lib/enums";

export const treatmentPlanSchema = z.object({
  patientId: idSchema,
  providerId: idSchema.optional(),
  title: nameSchema,
  description: optionalStringSchema,
  goals: optionalStringSchema,
  status: TreatmentPlanStatusEnum.default("draft"),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});

export const treatmentPlanQuerySchema = baseQuerySchema(
  z.enum(["title", "createdAt", "status", "startDate"]),
  z.enum(["title"]),
).extend({
  patientId: idSchema.optional(),
  status: TreatmentPlanStatusEnum.optional(),
});
