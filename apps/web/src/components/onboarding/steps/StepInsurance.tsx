"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { isoDateSchema, optionalStringSchema, phoneSchema } from "@workspace/contracts/lib/schema";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { Form } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { StepFooter, StepIntro } from "../shared";
import type { OnboardingData } from "../types";

const RELATIONSHIP_OPTIONS = [
  { label: "Self", value: "self" },
  { label: "Spouse", value: "spouse" },
  { label: "Child", value: "child" },
  { label: "Other", value: "other" },
];

const schema = z.object({
  insuranceProvider: optionalStringSchema,
  insuranceMemberId: optionalStringSchema,
  insuranceGroupNumber: optionalStringSchema,
  insuranceAuthNumber: optionalStringSchema,
  insurancePolicyNumber: optionalStringSchema,
  insuranceCopay: z.coerce.number().nonnegative().optional(),
  insuranceDeductible: z.coerce.number().nonnegative().optional(),
  insurancePhone: phoneSchema.optional(),
  insurancePolicyHolder: optionalStringSchema,
  insurancePolicyHolderDob: isoDateSchema.optional(),
  insuranceRelationship: z.enum(["self", "spouse", "child", "other"]).optional(),
});

type Values = z.input<typeof schema>;

interface StepInsuranceProps {
  data: OnboardingData;
  stepLabel: string;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepInsurance({ data, stepLabel, onNext, onBack, onSkip }: StepInsuranceProps) {
  const form = useForm({
    defaultValues: {
      insuranceProvider: data.insuranceProvider,
      insuranceMemberId: data.insuranceMemberId,
      insuranceGroupNumber: data.insuranceGroupNumber,
      insuranceAuthNumber: data.insuranceAuthNumber,
      insurancePolicyNumber: data.insurancePolicyNumber,
      insuranceCopay: data.insuranceCopay,
      insuranceDeductible: data.insuranceDeductible,
      insurancePhone: data.insurancePhone,
      insurancePolicyHolder: data.insurancePolicyHolder,
      insurancePolicyHolderDob: data.insurancePolicyHolderDob,
      insuranceRelationship: data.insuranceRelationship as any,
    } as Values,
    validators: { onSubmit: schema },
    onSubmit: ({ value }) =>
      onNext({
        ...value,
        insuranceCopay: value.insuranceCopay as number | undefined,
        insuranceDeductible: value.insuranceDeductible as number | undefined,
      }),
  });

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="Do you have insurance?"
        body="Add your details now so billing is ready before your first visit, or skip this and our care coordinator will follow up with you directly."
      />

      <Form form={form} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            form={form}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="e.g., Blue Shield of California"
          />
          <InputField
            form={form}
            name="insuranceMemberId"
            label="Member ID"
            placeholder="From your insurance card"
          />
          <InputField
            form={form}
            name="insuranceGroupNumber"
            label="Group number"
            placeholder="Optional"
          />
          <InputField
            form={form}
            name="insurancePolicyNumber"
            label="Policy number"
            placeholder="If different from Member ID"
          />
          <InputField
            form={form}
            name="insuranceAuthNumber"
            label="Authorization number"
            placeholder="If known"
          />
          <InputField
            form={form}
            name="insuranceCopay"
            label="Copay amount ($)"
            type="number"
            placeholder="e.g., 25"
          />
          <InputField
            form={form}
            name="insuranceDeductible"
            label="Deductible amount ($)"
            type="number"
            placeholder="e.g., 1500"
          />
          <PhoneField
            form={form}
            name="insurancePhone"
            label="Insurance member services phone"
          />
        </div>

        <div className="rounded-2xl bg-secondary/60 p-5">
          <p className="eyebrow text-accent">Policy holder</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Only needed if the policy belongs to someone other than you.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField
              form={form}
              name="insurancePolicyHolder"
              label="Policy holder name"
            />
            <SelectField
              form={form}
              name="insuranceRelationship"
              label="Your relationship to policy holder"
              options={RELATIONSHIP_OPTIONS}
            />
          </div>
          <div className="mt-4">
            <DatePickerField
              form={form}
              name="insurancePolicyHolderDob"
              label="Policy holder date of birth"
            />
          </div>
        </div>

        <StepFooter
          onBack={onBack}
          onContinue={() => form.handleSubmit()}
          secondaryAction={
            <button
              type="button"
              onClick={onSkip}
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
