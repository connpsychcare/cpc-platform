import type { PHQ9Result } from "./forms/PHQ9Form";
import type { GAD7Result } from "./forms/GAD7Form";
import type { ASRSResult } from "./forms/ASRSForm";
import type { VanderbiltParentResult } from "./forms/VanderbiltParentForm";
import type { AdultIntakeData } from "./forms/AdultIntakeForm";
import type { AdolescentIntakeData } from "./forms/AdolescentIntakeForm";

export type OnboardingData = {
  // Step 0: verified at login
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  // Step 1: Personal Info
  birthDate?: string;
  gender?: string;
  address?: string;
  occupation?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelationship?: string;
  ageGroup?: "adult" | "adolescent";

  // Step 2: Insurance
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceMemberId?: string;
  insuranceGroupNumber?: string;
  insuranceAuthNumber?: string;
  insuranceCopay?: number;
  insuranceDeductible?: number;
  insurancePhone?: string;
  insurancePolicyHolder?: string;
  insurancePolicyHolderDob?: string;
  insuranceRelationship?: string;

  // Step 3: Medical History
  allergies?: string;
  currentMedication?: string;
  pastMedicalHistory?: string;
  familyMedicalHistory?: string;

  // Step 4: Psychiatric Intake Form
  intakeFormData?: AdultIntakeData | AdolescentIntakeData;

  // Step 5: Screening
  phq9?: PHQ9Result;
  gad7?: GAD7Result;
  asrs?: ASRSResult;
  vanderbiltParent?: VanderbiltParentResult;

  // Screening opt-out, chosen on the screening intro step
  skipScreenings?: boolean;

  // Step 6: Consent
  hipaaAcknowledged?: boolean;
  consentToTreat?: boolean;
  telehealthConsent?: boolean;
  signatureName?: string;
  signedAt?: string;
};

export function getAgeGroup(birthDate?: string): "adult" | "adolescent" {
  if (!birthDate) return "adult";
  const dob = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 18 ? "adult" : "adolescent";
}
