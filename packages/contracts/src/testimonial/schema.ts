import z from "zod";
import {
  baseQuerySchema,
  booleanSchema,
  idSchema,
  nameSchema,
  optionalStringSchema,
  positiveIntSchema,
} from "../lib/schema";

export const testimonialSchema = z.object({
  authorId: idSchema.optional(),
  authorName: nameSchema,
  authorRole: optionalStringSchema,
  content: z.string().min(10),
  rating: positiveIntSchema.max(5).default(5),
  isPublished: booleanSchema.default(false),
  patientId: idSchema.optional(),
  appointmentId: idSchema.optional(),
});

export const submitTestimonialSchema = z.object({
  content: z.string().min(10),
  rating: positiveIntSchema.max(5).default(5),
  appointmentId: idSchema.optional(),
});

export const testimonialQuerySchema = baseQuerySchema(
  // TODO move these to lib/enums as others
  z.enum(["authorName", "createdAt"]),
  z.enum(["authorName", "content"]),
).extend({
  isPublished: booleanSchema.optional(),
  patientId: idSchema.optional(),
});
