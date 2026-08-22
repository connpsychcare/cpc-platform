import { z } from "zod";
import {
  baseQuerySchema,
  idSchema,
  isoDateSchema,
  optionalStringSchema,
  requiredStringSchema,
} from "../lib/schema";
import { ProgressReportStatusEnum } from "../lib/enums";

export const progressReportSchema = z.object({
  patientId: idSchema,
  treatmentPlanId: idSchema.optional(),
  title: requiredStringSchema,
  periodStart: isoDateSchema,
  periodEnd: isoDateSchema,
  notes: optionalStringSchema,
});

export const updateProgressReportSchema = z.object({
  title: requiredStringSchema.optional(),
  notes: optionalStringSchema,
  status: ProgressReportStatusEnum.optional(),
});

export const progressReportQuerySchema = baseQuerySchema(
  z.enum(["periodStart", "periodEnd", "createdAt"]),
  z.enum(["title"]),
).extend({
  patientId: idSchema.optional(),
  treatmentPlanId: idSchema.optional(),
  status: ProgressReportStatusEnum.optional(),
});
