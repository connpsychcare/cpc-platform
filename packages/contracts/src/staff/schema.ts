import z from "zod";
import {
  ClinicalCredentialEnum,
  StaffSearchByEnum,
  StaffSortByEnum,
} from "../lib/enums";
import {
  baseQuerySchema,
  booleanSchema,
  idSchema,
  nameSchema,
  optionalStringSchema,
} from "../lib/schema";
import { signUpSchema } from "../auth";

const staffProfileFieldsSchema = z.object({
  branchId: idSchema,

  title: nameSchema,
  specialty: optionalStringSchema,
  bio: optionalStringSchema,
  credentials: z.array(ClinicalCredentialEnum).default([]),

  isActive: booleanSchema.default(true),
});

export const staffProfileSchema = staffProfileFieldsSchema.extend({
  userId: idSchema.optional(),
});

export const createStaffSchema = staffProfileFieldsSchema.extend(
  signUpSchema.shape,
);

export const staffQuerySchema = baseQuerySchema(
  StaffSortByEnum,
  StaffSearchByEnum,
).extend({
  branchId: idSchema.optional(),
  isActive: booleanSchema.optional(),
});
