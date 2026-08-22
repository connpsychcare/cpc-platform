import { z } from "zod";
import {
  baseQuerySchema,
  idSchema,
  isoDateSchema,
  optionalStringSchema,
  positiveIntSchema,
} from "../lib/schema";

export const sessionNoteSchema = z.object({
  patientId: idSchema,
  therapistId: idSchema,
  treatmentPlanId: idSchema.optional(),
  appointmentId: idSchema.optional(),
  sessionDate: isoDateSchema,
  durationMinutes: positiveIntSchema.optional(),
  summary: optionalStringSchema,
  clientBehavior: optionalStringSchema,
  nextSteps: optionalStringSchema,
});

export const sessionNoteQuerySchema = baseQuerySchema(
  // TODO move these to lib/enums as others
  z.enum(["sessionDate", "createdAt", "durationMinutes"]),
  z.enum(["sessionDate", "summary"]),
).extend({
  patientId: idSchema.optional(),
  therapistId: idSchema.optional(),
  treatmentPlanId: idSchema.optional(),
});
