"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { GenderEnum } from "@workspace/contracts";
import { isoDateSchema, phoneSchema } from "@workspace/contracts/lib/schema";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { Form } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { RadioField } from "@workspace/ui/components/radio-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { StepFooter, StepIntro } from "../shared";
import type { OnboardingData } from "../types";

const RELATIONSHIPS = [
  "Spouse / Partner",
  "Parent",
  "Sibling",
  "Child",
  "Friend",
  "Other",
];

const schema = z.object({
  phone: phoneSchema,
  birthDate: isoDateSchema,
  gender: GenderEnum,
  address: z.string().optional(),
  occupation: z.string().optional(),
  emergencyContactName: z.string().min(2, "Please enter a name"),
  emergencyContactNumber: phoneSchema,
  emergencyContactRelationship: z.string().optional(),
});

type Values = z.input<typeof schema>;

interface StepPersonalInfoProps {
  data: OnboardingData;
  stepLabel: string;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export function StepPersonalInfo({ data, stepLabel, onNext, onBack }: StepPersonalInfoProps) {
  const form = useForm({
    defaultValues: {
      phone: data.phone,
      birthDate: data.birthDate,
      gender: data.gender as any,
      address: data.address,
      occupation: data.occupation,
      emergencyContactName: data.emergencyContactName,
      emergencyContactNumber: data.emergencyContactNumber,
      emergencyContactRelationship: data.emergencyContactRelationship,
    } as Values,
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => onNext(value),
  });

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="Tell us about yourself."
        body="Your name is already on file from sign-up. A few more details help your care team reach you and prepare for your visit."
      />

      <Form form={form} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <PhoneField form={form} required name="phone" label="Your phone number" />
          <DatePickerField
            form={form}
            required
            name="birthDate"
            label="Date of birth"
            placeholder="Select your date of birth"
          />
        </div>
        <RadioField
          form={form}
          required
          name="gender"
          label="Gender"
          options={GenderEnum.options.map((o) => ({
            label: o.charAt(0).toUpperCase() + o.slice(1),
            value: o,
          }))}
        />
        <InputField
          form={form}
          name="address"
          label="Home address"
          placeholder="Street, City, State, ZIP (optional)"
        />
        <InputField
          form={form}
          name="occupation"
          label="Occupation"
          placeholder="Your current job or status (optional)"
        />

        <div className="rounded-2xl bg-secondary/60 p-5">
          <p className="eyebrow text-accent">Emergency contact</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Someone we can reach if we are ever unable to reach you.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField
              form={form}
              required
              name="emergencyContactName"
              label="Contact name"
            />
            <PhoneField
              form={form}
              required
              name="emergencyContactNumber"
              label="Contact phone"
            />
          </div>
          <div className="mt-4">
            <SelectField
              form={form}
              name="emergencyContactRelationship"
              label="Relationship to you"
              placeholder="Optional"
              options={RELATIONSHIPS}
            />
          </div>
        </div>

        <StepFooter onBack={onBack} onContinue={() => form.handleSubmit()} />
      </Form>
    </div>
  );
}
