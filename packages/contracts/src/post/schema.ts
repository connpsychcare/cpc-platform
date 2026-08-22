import z from "zod";
import * as $Enums from "@workspace/db/enums";
import {
  baseQuerySchema,
  booleanSchema,
  idSchema,
  isoDateSchema,
  optionalStringSchema,
  requiredStringSchema,
} from "../lib/schema";

export const PostStatusEnum = z.enum($Enums.PostStatus);

/**
 * Posts are draft-first: a writer saves early and often, so nearly everything is
 * optional here. The completeness rules that matter are enforced only at the
 * point of publishing, in `assertPublishable` on the server.
 */
export const postSchema = z.object({
  categoryId: idSchema.optional(),
  title: optionalStringSchema,
  slug: optionalStringSchema,
  excerpt: optionalStringSchema,
  content: optionalStringSchema,
  coverId: idSchema.optional(),
  headerImageId: idSchema.optional(),
  status: PostStatusEnum.default("draft"),
  publishedAt: isoDateSchema.optional(),
  metaTitle: optionalStringSchema,
  metaDescription: optionalStringSchema,
  metaKeywords: z.array(requiredStringSchema).optional(),
});

export const postQuerySchema = baseQuerySchema(
  z.enum([
    "title",
    "slug",
    "updatedAt",
    "publishedAt",
    "viewsCount",
    "createdAt",
  ]),
  z.enum(["id", "title", "slug", "category"]),
).extend({
  status: PostStatusEnum.optional(),
  categoryId: idSchema.optional(),
  authorId: idSchema.optional(),
  includeDeleted: booleanSchema.optional(),
});

export const trackPostViewSchema = z.object({
  visitorKey: optionalStringSchema,
  trafficSourceId: idSchema.optional(),
});
