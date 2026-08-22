import { z } from "zod";
import { baseQuerySchema, booleanSchema, idSchema } from "../lib/schema";
import { ClinicalFormTypeEnum } from "../lib/enums";

export const clinicalFormQuerySchema = baseQuerySchema(
  z.enum(["completedAt", "totalScore", "createdAt"]),
  z.enum(["displayName", "email", "interpretation"]),
).extend({
  patientId: idSchema.optional(),
  formType: ClinicalFormTypeEnum.optional(),
  /**
   * Narrows to a set of instruments, so a surface can scope itself to
   * screenings or to intake forms without one request per type. A single
   * `formType` still wins when both are sent.
   */
  formTypes: z
    .union([ClinicalFormTypeEnum, ClinicalFormTypeEnum.array()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional(),
  isOnboarding: booleanSchema.optional(),
});
