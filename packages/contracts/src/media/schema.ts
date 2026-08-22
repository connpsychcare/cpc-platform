import z from "zod";
import {
  baseQuerySchema,
  optionalStringSchema,
  requiredStringSchema,
} from "../lib/schema";
import {
  MediaSearchByEnum,
  MediaSortByEnum,
  MediaTypeEnum,
  MediaVisibilityEnum,
} from "../lib/enums";

export const mediaUpdateSchema = z.object({
  name: requiredStringSchema,
  altText: optionalStringSchema,
  notes: optionalStringSchema,
});

export const mediaCreateSchema = mediaUpdateSchema.partial().extend({
  type: MediaTypeEnum,
  visibility: MediaVisibilityEnum.default("private"),
});

export const mediaQuerySchema = baseQuerySchema(
  MediaSortByEnum,
  MediaSearchByEnum,
).extend({
  type: MediaTypeEnum.optional(),
  mimeType: z.string().optional(),
});
