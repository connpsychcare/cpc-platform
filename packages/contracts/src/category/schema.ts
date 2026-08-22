import z from "zod";
import {
  baseQuerySchema,
  booleanSchema,
  idSchema,
  nameSchema,
  optionalStringSchema,
  slugSchema,
} from "../lib/schema";

export const categorySchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: optionalStringSchema,
  metaTitle: optionalStringSchema,
  metaDescription: optionalStringSchema,
  coverId: idSchema.optional(),
  parentId: idSchema.optional(),
});

export const categoryQuerySchema = baseQuerySchema(
  z.enum(["name", "slug", "createdAt", "updatedAt"]),
  z.enum(["id", "name", "slug"]),
).extend({
  parentId: idSchema.optional(),
  includeDeleted: booleanSchema.optional(),
});
