import { createZodDto } from "nestjs-zod";
import { jobListingSchema, jobListingQuerySchema } from "./schema";

export class JobListingDto extends createZodDto(jobListingSchema) {}
export class JobListingQueryDto extends createZodDto(jobListingQuerySchema) {}
