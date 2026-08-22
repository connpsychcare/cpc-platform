import z from "zod";
import {
  ClinicalCredentialEnum,
  ClinicalSpecialtyEnum,
  ProviderSearchByEnum,
  ProviderSortByEnum,
  SpokenLanguageEnum,
} from "../lib/enums";
import {
  baseQuerySchema,
  booleanSchema,
  idSchema,
  intNumberSchema,
  nameSchema,
  optionalStringSchema,
  percentSchema,
  positiveNumberSchema,
  slugSchema,
} from "../lib/schema";
import { signUpSchema } from "../auth";

const providerProfileFieldsSchema = z.object({
  branchId: idSchema,
  licenseDocumentId: idSchema.optional(),

  slug: slugSchema,
  title: nameSchema,
  bio: optionalStringSchema,

  licenseNumber: optionalStringSchema,
  yearsExperience: intNumberSchema.optional(),
  education: optionalStringSchema,
  credentials: z.array(ClinicalCredentialEnum).default([]),
  specialties: z.array(ClinicalSpecialtyEnum).default([]),
  languages: z.array(SpokenLanguageEnum).default([]),

  consultationFee: positiveNumberSchema,
  commissionPercent: percentSchema.optional(),
  isAvailable: booleanSchema.default(true),
});

export const providerProfileSchema = providerProfileFieldsSchema.extend({
  userId: idSchema.optional(),
});

export const createProviderSchema = providerProfileFieldsSchema.extend(
  signUpSchema.shape,
);

export const providerQuerySchema = baseQuerySchema(
  ProviderSortByEnum,
  ProviderSearchByEnum,
).extend({
  specialty: z.string().optional(),
  branchId: idSchema.optional(),
  isAvailable: booleanSchema.optional(),
});
