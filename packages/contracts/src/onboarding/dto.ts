import { createZodDto } from "nestjs-zod";
import { submitOnboardingSchema } from "./schema";

export class SubmitOnboardingDto extends createZodDto(submitOnboardingSchema) {}
