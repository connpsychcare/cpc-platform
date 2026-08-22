"use client";

import { AdultIntakeForm } from "../forms/AdultIntakeForm";
import type { AdultIntakeData } from "../forms/AdultIntakeForm";
import { AdolescentIntakeForm } from "../forms/AdolescentIntakeForm";
import type { OnboardingData } from "../types";

interface StepIntakeFormProps {
  data: OnboardingData;
  ageGroup: "adult" | "adolescent";
  stepLabel: string;
  isMinorSelfConsenting?: boolean;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export function StepIntakeForm({
  data,
  ageGroup,
  stepLabel,
  isMinorSelfConsenting,
  onNext,
  onBack,
}: StepIntakeFormProps) {
  if (ageGroup === "adult") {
    return (
      <AdultIntakeForm
        prefill={{
          chiefComplaint: (data.intakeFormData as AdultIntakeData | undefined)?.chiefComplaint,
        }}
        stepLabel={stepLabel}
        onComplete={(intakeFormData) => onNext({ intakeFormData })}
        onBack={onBack}
      />
    );
  }

  return (
    <AdolescentIntakeForm
      isMinorSelfConsenting={isMinorSelfConsenting}
      stepLabel={stepLabel}
      onComplete={(intakeFormData) => onNext({ intakeFormData })}
      onBack={onBack}
    />
  );
}
