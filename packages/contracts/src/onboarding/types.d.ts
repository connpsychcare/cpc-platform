import type z from "zod";
import type {
  submitOnboardingSchema,
  onboardingFormResponseSchema,
  onboardingConsentSchema,
} from "./schema";

export type SubmitOnboardingType = z.input<typeof submitOnboardingSchema>;
export type OnboardingFormResponseType = z.input<
  typeof onboardingFormResponseSchema
>;
export type OnboardingConsentType = z.input<typeof onboardingConsentSchema>;

export interface OnboardingStatusResponse {
  completed: boolean;
  completedAt?: string;
  steps: {
    personalInfo: boolean;
    insurance: boolean;
    intakeForm: boolean;
    screeningForms: boolean;
    consent: boolean;
  };
}
