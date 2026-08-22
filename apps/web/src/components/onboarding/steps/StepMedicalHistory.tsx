"use client";

import { useForm } from "@tanstack/react-form";
import { Form } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { StepFooter, StepIntro } from "../shared";
import type { OnboardingData } from "../types";

interface StepMedicalHistoryProps {
  data: OnboardingData;
  stepLabel: string;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export function StepMedicalHistory({ data, stepLabel, onNext, onBack }: StepMedicalHistoryProps) {
  const form = useForm({
    defaultValues: {
      allergies: data.allergies,
      currentMedication: data.currentMedication,
      pastMedicalHistory: data.pastMedicalHistory,
      familyMedicalHistory: data.familyMedicalHistory,
    },
    onSubmit: ({ value }) => onNext(value),
  });

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="A little about your health history."
        body="This helps your provider make safe prescribing decisions. Everything here is optional but strongly encouraged - skip anything you are not sure about and fill it in later."
      />

      <Form form={form} className="mt-8 space-y-5">
        <InputField
          form={form}
          name="allergies"
          label="Known allergies"
          type="textarea"
          rows={3}
          placeholder="List any medication or food allergies and your reactions. Or write 'None known'"
        />
        <InputField
          form={form}
          name="currentMedication"
          label="Current medications & supplements"
          type="textarea"
          rows={4}
          placeholder="List name, dose, and frequency for each. Include vitamins and supplements. Or write 'None'"
        />
        <InputField
          form={form}
          name="pastMedicalHistory"
          label="Past medical history"
          type="textarea"
          rows={4}
          placeholder="List significant medical conditions, surgeries, or hospitalizations. Or write 'None'"
        />
        <InputField
          form={form}
          name="familyMedicalHistory"
          label="Family medical history"
          type="textarea"
          rows={3}
          placeholder="List significant conditions in immediate family (heart disease, diabetes, cancer, etc.). Or write 'Unknown'"
        />

        <StepFooter
          onBack={onBack}
          onContinue={() => form.handleSubmit()}
          secondaryAction={
            <button
              type="button"
              onClick={() => onNext({})}
              className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Skip for now
            </button>
          }
        />
      </Form>
    </div>
  );
}
