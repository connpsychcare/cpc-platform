import z from "zod";
import {
  CaregiverRelationshipEnum,
  GenderEnum,
  IdentificationTypeEnum,
  PatientSearchByEnum,
  PatientSortByEnum,
} from "../lib/enums";
import {
  baseQuerySchema,
  idSchema,
  isoDateSchema,
  nameSchema,
  optionalStringSchema,
  phoneSchema,
} from "../lib/schema";
import { signUpSchema } from "../auth";

const patientProfileFieldsSchema = z.object({
  identificationDocumentId: idSchema.optional(),

  birthDate: isoDateSchema.optional(),
  gender: GenderEnum.optional(),

  address: optionalStringSchema,
  occupation: optionalStringSchema,

  emergencyContactName: optionalStringSchema,
  emergencyContactNumber: phoneSchema.optional(),

  insuranceProvider: optionalStringSchema,
  insurancePolicyNumber: optionalStringSchema,

  // Extended insurance fields for psychiatric billing
  insuranceMemberId: optionalStringSchema,
  insuranceGroupNumber: optionalStringSchema,
  insuranceAuthNumber: optionalStringSchema,
  insuranceCopay: z.number().nonnegative().optional(),
  insuranceDeductible: z.number().nonnegative().optional(),
  insurancePhone: phoneSchema.optional(),
  insurancePolicyHolder: optionalStringSchema,
  insurancePolicyHolderDob: isoDateSchema.optional(),
  insuranceRelationship: z
    .enum(["self", "spouse", "child", "other"])
    .optional(),

  emergencyContactRelationship: optionalStringSchema,

  allergies: optionalStringSchema,
  currentMedication: optionalStringSchema,
  familyMedicalHistory: optionalStringSchema,
  pastMedicalHistory: optionalStringSchema,

  // Derived from DOB at onboarding time
  ageGroup: z.enum(["adult", "adolescent"]).optional(),

  identificationType: IdentificationTypeEnum.optional(),
  identificationNumber: optionalStringSchema,
});

export const patientProfileSchema = patientProfileFieldsSchema.extend({
  userId: idSchema.optional(),
  phone: phoneSchema.optional(),
});

export const createPatientSchema = patientProfileFieldsSchema.extend(
  signUpSchema.shape,
);

export const patientQuerySchema = baseQuerySchema(
  PatientSortByEnum,
  PatientSearchByEnum,
);

export const createDependentSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  dateOfBirth: isoDateSchema.optional(),
  relationship: CaregiverRelationshipEnum.default("parent"),
  notes: optionalStringSchema,
});
