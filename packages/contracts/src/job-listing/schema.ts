import z from "zod";
import {
  baseQuerySchema,
  booleanSchema,
  nameSchema,
  optionalStringSchema,
} from "../lib/schema";

export const JobTypeEnum = z.enum([
  "fullTime",
  "partTime",
  "contract",
  "internship",
]);

export const JobLocationTypeEnum = z.enum(["onSite", "remote", "hybrid"]);

export const jobListingSchema = z.object({
  title: nameSchema,
  type: JobTypeEnum,
  locationType: JobLocationTypeEnum.default("onSite"),
  location: nameSchema,
  department: optionalStringSchema,
  description: z.string().min(10),
  requirements: optionalStringSchema,
  salary: optionalStringSchema,
  isActive: booleanSchema.default(true),
});

export const jobListingQuerySchema = baseQuerySchema(
  // TODO move these to lib/enums as others
  z.enum(["title", "createdAt"]),
  z.enum(["title", "location"]),
).extend({
  isActive: booleanSchema.optional(),
  type: JobTypeEnum.optional(),
  locationType: JobLocationTypeEnum.optional(),
});
