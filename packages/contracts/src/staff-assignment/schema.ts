import { z } from "zod";
import {
  baseQuerySchema,
  optionalStringSchema,
  idSchema,
  booleanSchema,
} from "../lib/schema";

export const staffAssignmentSchema = z.object({
  patientIds: z.array(idSchema).min(1, "Select at least one patient."),
  staffId: idSchema,
  notes: optionalStringSchema,
});

export const staffAssignmentQuerySchema = baseQuerySchema(
  // TODO move these to lib/enums as others
  z.enum(["assignedAt", "unassignedAt", "isActive"]),
  z.enum(["notes"]),
  "assignedAt",
).extend({
  staffId: idSchema.optional(),
  patientId: idSchema.optional(),
  isActive: booleanSchema.optional(),
});

export const unassignStaffSchema = z.object({
  notes: optionalStringSchema,
});
