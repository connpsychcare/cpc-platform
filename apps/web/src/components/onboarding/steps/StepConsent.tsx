"use client";

import { useForm } from "@tanstack/react-form";
import {
  onboardingConsentSchema,
  type OnboardingConsentType,
} from "@workspace/contracts/onboarding";
import { CheckboxField } from "@workspace/ui/components/checkbox-field";
import { Form } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { StepFooter, StepIntro } from "../shared";
import type { OnboardingData } from "../types";

// signedAt has no bound field - it's set from onNext below, after
// validation passes - so it is excluded from both the form's own data
// shape and its validator.
const consentFieldsSchema = onboardingConsentSchema.omit({ signedAt: true });
type ConsentFormValues = Omit<OnboardingConsentType, "signedAt">;

interface StepConsentProps {
  data: OnboardingData;
  stepLabel: string;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  isPending?: boolean;
}

export function StepConsent({
  data,
  stepLabel,
  onNext,
  onBack,
  isPending,
}: StepConsentProps) {
  const form = useForm({
    defaultValues: {
      hipaaAcknowledged: true,
      consentToTreat: true,
      telehealthConsent: true,
      signatureName: data.signatureName,
    } as ConsentFormValues,
    validators: { onSubmit: consentFieldsSchema },
    onSubmit: ({ value }) =>
      onNext({ ...value, signedAt: new Date().toISOString() }),
  });

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="Review and sign."
        body="Please review and acknowledge the following before we complete your onboarding. Your electronic signature carries the same legal weight as a handwritten signature."
      />

      <Form form={form} className="mt-8 space-y-6">
        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Privacy notice (HIPAA)
          </h4>
          <div className="max-h-36 space-y-2 overflow-y-auto rounded-xl bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            <p>
              Connected Psychiatric Care is required by law to maintain the
              privacy of your protected health information (PHI) and to provide
              you with this notice of our legal duties and privacy practices.
            </p>
            <p>
              We may use and disclose your health information for treatment
              purposes, to obtain payment for services, and for healthcare
              operations. We will not use or disclose your health information
              for any other purpose without your written authorization, except
              as permitted or required by law.
            </p>
            <p>
              You have the right to request restrictions on disclosures of your
              PHI, to receive confidential communications, to inspect and copy
              your PHI, to request amendments, and to receive an accounting of
              disclosures.
            </p>
            <p>
              For minors ages 12 to 17 who have self-consented under California
              Family Code §6924, information disclosed in the course of mental
              health treatment is confidential and will not be shared with
              parents or guardians without the minor&apos;s consent, except in
              cases of imminent danger.
            </p>
          </div>
          <CheckboxField
            form={form}
            required
            name="hipaaAcknowledged"
            label="I acknowledge the HIPAA Privacy Notice"
            desc="I have received and reviewed the Connected Psychiatric Care HIPAA Privacy Notice and understand my rights regarding my health information."
          />
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Consent to treatment
          </h4>
          <CheckboxField
            form={form}
            required
            name="consentToTreat"
            label="I consent to evaluation and treatment"
            desc="I voluntarily consent to evaluation and treatment by providers at Connected Psychiatric Care, Professional Nursing Corporation. I understand I may withdraw this consent at any time and that my care team will discuss all proposed treatments and medications with me before proceeding."
          />
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Telehealth consent
          </h4>
          <CheckboxField
            form={form}
            required
            name="telehealthConsent"
            label="I consent to telehealth-only care"
            desc="I understand that Connected Psychiatric Care is a telehealth-only practice and that all appointments are conducted via secure video rather than in-person visits. I consent to receiving psychiatric services via telehealth and understand its benefits and limitations compared to an in-person visit."
          />
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Electronic signature
          </h4>
          <p className="text-xs text-muted-foreground">
            By typing your full name below you are electronically signing this
            intake and consent package. Date:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <InputField
            form={form}
            required
            name="signatureName"
            placeholder="Type your full legal name"
            className="font-medium italic"
          />
        </section>

        <StepFooter
          onBack={onBack}
          onContinue={() => form.handleSubmit()}
          continueLabel="Complete onboarding"
          isPending={isPending}
        />
      </Form>
    </div>
  );
}
