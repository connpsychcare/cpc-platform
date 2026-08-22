import { createZodDto } from "nestjs-zod";
import {
  progressReportSchema,
  updateProgressReportSchema,
  progressReportQuerySchema,
} from "./schema";

export class ProgressReportDto extends createZodDto(progressReportSchema) {}
export class UpdateProgressReportDto extends createZodDto(
  updateProgressReportSchema,
) {}
export class ProgressReportQueryDto extends createZodDto(
  progressReportQuerySchema,
) {}
