import { z } from "zod";
import { ClinicalFormTypeEnum } from "../lib/enums";
import { isoDateSchema, nameSchema } from "../lib/schema";

export const onboardingFormResponseSchema = z.object({
  formType: ClinicalFormTypeEnum,
  responses: z.record(z.string(), z.unknown()),
  totalScore: z.number().optional(),
  interpretation: z.string().optional(),
});

export const onboardingCompletedStepsSchema = z.object({
  personalInfo: z.boolean().optional(),
  insurance: z.boolean().optional(),
  intake: z.boolean().optional(),
  screenings: z.boolean().optional(),
  consent: z.boolean().optional(),
});

export const onboardingConsentSchema = z.object({
  hipaaAcknowledged: z.literal(true, {
    message: "HIPAA acknowledgment is required.",
  }),
  consentToTreat: z.literal(true, {
    message: "Consent to treatment is required.",
  }),
  telehealthConsent: z.literal(true, {
    message: "Telehealth consent is required.",
  }),
  signatureName: nameSchema,
  signedAt: isoDateSchema,
});

export const submitOnboardingSchema = z.object({
  forms: z.array(onboardingFormResponseSchema).default([]),
  completedSteps: onboardingCompletedStepsSchema.optional(),
  consentData: onboardingConsentSchema,
});
