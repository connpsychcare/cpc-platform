import type z from "zod";
import type { Testimonial } from "@workspace/db/browser";
import type {
  testimonialSchema,
  testimonialQuerySchema,
  submitTestimonialSchema,
} from "./schema";
import type { BaseQueryResponse, Sanitize } from "../lib/types";
import type { UserResponse } from "../user/types";

export type TestimonialType = z.input<typeof testimonialSchema>;
export type TestimonialQueryType = z.input<typeof testimonialQuerySchema>;
export type SubmitTestimonialType = z.input<typeof submitTestimonialSchema>;

export type TestimonialResponse = Sanitize<Testimonial> & {
  author?: UserResponse;
};

export interface TestimonialQueryResponse extends BaseQueryResponse {
  testimonials: TestimonialResponse[];
}
