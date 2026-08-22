import { createZodDto } from "nestjs-zod";
import { treatmentPlanSchema, treatmentPlanQuerySchema } from "./schema";

export class TreatmentPlanDto extends createZodDto(treatmentPlanSchema) {}
export class TreatmentPlanQueryDto extends createZodDto(
  treatmentPlanQuerySchema,
) {}
