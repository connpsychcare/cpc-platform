import { createZodDto } from "nestjs-zod";
import { clinicalFormQuerySchema } from "./schema";

export class ClinicalFormQueryDto extends createZodDto(
  clinicalFormQuerySchema,
) {}
