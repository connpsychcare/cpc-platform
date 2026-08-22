import z from "zod";
import {
  BranchSearchByEnum,
  BranchSortByEnum,
  WeekdayEnum,
} from "../lib/enums";
import {
  baseQuerySchema,
  booleanSchema,
  emailSchema,
  idSchema,
  nameSchema,
  numberSchema,
  optionalStringSchema,
  phoneSchema,
  slugSchema,
  urlSchema,
} from "../lib/schema";

export const branchTimingSchema = z.object({
  weekday: WeekdayEnum,
  openTime: z.string(),
  closeTime: z.string(),
  isClosed: booleanSchema.default(false),
});

export const CUBranchSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  email: emailSchema,
  phone: phoneSchema,
  whatsapp: phoneSchema.optional(),

  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),

  latitude: numberSchema.optional(),
  longitude: numberSchema.optional(),

  timezone: optionalStringSchema,
  isActive: booleanSchema.default(true),

  branchTimings: z.array(branchTimingSchema).min(5),
});

export const branchQuerySchema = baseQuerySchema(
  BranchSortByEnum,
  BranchSearchByEnum,
).extend({
  isActive: booleanSchema.optional(),
});

export const businessProfileSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  description: z.string(),

  faviconId: idSchema,
  logoLightId: idSchema,
  logoDarkId: idSchema,
  coverId: idSchema.optional(),

  email: emailSchema,
  phone: phoneSchema,
  whatsapp: phoneSchema.optional(),
  website: urlSchema.optional(),

  facebook: urlSchema.optional(),
  instagram: urlSchema.optional(),
  tiktok: urlSchema.optional(),
  twitter: urlSchema.optional(),
  linkedin: urlSchema.optional(),

  metaTitle: z.string(),
  metaDescription: z.string(),
});
