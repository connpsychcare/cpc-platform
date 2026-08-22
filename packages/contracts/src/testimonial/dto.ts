import { createZodDto } from "nestjs-zod";
import {
  testimonialSchema,
  testimonialQuerySchema,
  submitTestimonialSchema,
} from "./schema";

export class TestimonialDto extends createZodDto(testimonialSchema) {}
export class TestimonialQueryDto extends createZodDto(testimonialQuerySchema) {}
export class SubmitTestimonialDto extends createZodDto(
  submitTestimonialSchema,
) {}
