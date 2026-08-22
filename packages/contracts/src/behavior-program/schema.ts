import { z } from "zod";
import {
  baseQuerySchema,
  idSchema,
  nameSchema,
  optionalStringSchema,
} from "../lib/schema";
import { ProgramTypeEnum, ProgramStatusEnum } from "../lib/enums";

export const behaviorProgramSchema = z.object({
  treatmentPlanId: idSchema,
  name: nameSchema,
  description: optionalStringSchema,
  type: ProgramTypeEnum,
  status: ProgramStatusEnum.default("active"),
  masteryDefinition: optionalStringSchema,
  baselineData: optionalStringSchema,
});

export const behaviorProgramQuerySchema = baseQuerySchema(
  z.enum(["name", "createdAt", "status", "type"]), // TODO move these  to enums as others
  z.enum(["name"]),
).extend({
  treatmentPlanId: idSchema.optional(),
  type: ProgramTypeEnum.optional(),
  status: ProgramStatusEnum.optional(),
});
