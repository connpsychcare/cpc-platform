"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import { useProtectedSession } from "@workspace/ui/hooks/use-protected-session";
import { cn } from "@workspace/ui/lib/utils";
import * as patient from "@workspace/sdk/patient";
import * as onboardingApi from "@workspace/sdk/onboarding";
import type { PatientProfileType } from "@workspace/contracts/patient";
import PageHeader from "@/components/shared/PageHeader";
import { FadeUp } from "@/components/shared/animations";
import type { OnboardingData } from "@/components/onboarding/types";
import { getAgeGroup } from "@/components/onboarding/types";
import { StepPersonalInfo } from "@/components/onboarding/steps/StepPersonalInfo";
import { StepInsurance } from "@/components/onboarding/steps/StepInsurance";
import { StepMedicalHistory } from "@/components/onboarding/steps/StepMedicalHistory";
import { StepIntakeForm } from "@/components/onboarding/steps/StepIntakeForm";
import { StepScreeningIntro } from "@/components/onboarding/steps/StepScreeningIntro";
import { StepConsent } from "@/components/onboarding/steps/StepConsent";
import { PHQ9Form } from "@/components/onboarding/forms/PHQ9Form";
import { GAD7Form } from "@/components/onboarding/forms/GAD7Form";
import { ASRSForm } from "@/components/onboarding/forms/ASRSForm";
import { VanderbiltParentForm } from "@/components/onboarding/forms/VanderbiltParentForm";

type StepKey =
  | "personalInfo"
  | "insurance"
  | "medicalHistory"
  | "intake"
  | "screeningIntro"
  | "phq9"
  | "gad7"
  | "asrs"
  | "vanderbiltParent"
  | "consent";

const RAIL_LABELS: Record<StepKey, string> = {
  personalInfo: "Personal",
  insurance: "Insurance",
  medicalHistory: "Health",
  intake: "Intake",
  screeningIntro: "Screening",
  phq9: "PHQ-9",
  gad7: "GAD-7",
  asrs: "ASRS",
  vanderbiltParent: "Vanderbilt",
  consent: "Consent",
};

function buildSteps(ageGroup: "adult" | "adolescent", skipScreenings: boolean): StepKey[] {
  const base: StepKey[] = ["personalInfo", "insurance", "medicalHistory", "intake", "screeningIntro"];
  if (skipScreenings) return [...base, "consent"];
  const screenings: StepKey[] =
    ageGroup === "adult" ? ["phq9", "gad7", "asrs"] : ["phq9", "vanderbiltParent"];
  return [...base, ...screenings, "consent"];
}

function Stepper({ steps, current }: { steps: StepKey[]; current: number }) {
  return (
    <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hidden">
      {steps.map((key, i) => (
        <div key={key} className="flex shrink-0 items-center gap-2">
          <span
            aria-current={i === current ? "step" : undefined}
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
              current >= i
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {current > i ? "✓" : i + 1}
          </span>
          <span
            className={cn(
              "hidden text-[11px] font-bold uppercase tracking-widest sm:block",
              current >= i ? "text-primary" : "text-muted-foreground/60",
            )}
          >
            {RAIL_LABELS[key]}
          </span>
          {i < steps.length - 1 && (
            <span className={cn("h-px w-6 shrink-0", current > i ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CompleteProfilePageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isPending: isSessionPending } = useProtectedSession();
  const { currentUser, isLoading } = useCurrentUser();

  const [stepKey, setStepKey] = useState<StepKey>("personalInfo");
  const [data, setData] = useState<OnboardingData>({});
  const topRef = useRef<HTMLDivElement>(null);

  // Redirect non-patients away, and already-onboarded patients back to their portal.
  useEffect(() => {
    if (isSessionPending || isLoading) return;
    if (currentUser && currentUser.role !== "patient") {
      router.replace("/");
      return;
    }
    if (currentUser?.onboardingCompletedAt) {
      router.replace("/patient");
    }
  }, [isSessionPending, isLoading, currentUser, router]);

  const ageGroup = getAgeGroup(data.birthDate);
  const skipScreenings = !!data.skipScreenings;
  const steps = buildSteps(ageGroup, skipScreenings);
  const currentIndex = Math.max(0, steps.indexOf(stepKey));
  const stepLabel = `Step ${currentIndex + 1} of ${steps.length}`;

  // Longer steps push the reader far down the page; without this, advancing
  // to the next step leaves them part-way down instead of at its top.
  const goToStep = (next: StepKey) => {
    setStepKey(next);
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  function mergeData(update: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  const saveProfileMutation = useMutation({
    mutationFn: (payload: PatientProfileType) => patient.updateMyPatientProfile(payload),
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: (payload: onboardingApi.SubmitOnboardingFormsPayload) =>
      onboardingApi.submitOnboardingForms(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
      toast.success("Onboarding complete! Welcome to Connected Psychiatric Care.");
      router.replace("/patient");
    },
    onError: (err: any) => {
      toast.error("Could not complete onboarding", { description: err?.message });
    },
  });

  const isPending = saveProfileMutation.isPending || completeOnboardingMutation.isPending;

  // ── Final submission ────────────────────────────────────────
  async function handleConsent(consentUpdate: Partial<OnboardingData>) {
    const final = { ...data, ...consentUpdate };

    try {
      await saveProfileMutation.mutateAsync({
        phone: final.phone,
        birthDate: final.birthDate,
        gender: final.gender as any,
        address: final.address,
        occupation: final.occupation,
        emergencyContactName: final.emergencyContactName,
        emergencyContactNumber: final.emergencyContactNumber,
        emergencyContactRelationship: final.emergencyContactRelationship,
        insuranceProvider: final.insuranceProvider,
        insurancePolicyNumber: final.insurancePolicyNumber,
        insuranceMemberId: final.insuranceMemberId,
        insuranceGroupNumber: final.insuranceGroupNumber,
        insuranceAuthNumber: final.insuranceAuthNumber,
        insuranceCopay: final.insuranceCopay,
        insuranceDeductible: final.insuranceDeductible,
        insurancePhone: final.insurancePhone,
        insurancePolicyHolder: final.insurancePolicyHolder,
        insurancePolicyHolderDob: final.insurancePolicyHolderDob,
        insuranceRelationship: final.insuranceRelationship as any,
        allergies: final.allergies,
        currentMedication: final.currentMedication,
        pastMedicalHistory: final.pastMedicalHistory,
        familyMedicalHistory: final.familyMedicalHistory,
        ageGroup,
      });
    } catch (err: any) {
      toast.error("Could not save your profile", { description: err?.message });
      return;
    }

    const forms: onboardingApi.FormResponsePayload[] = [];

    if (final.intakeFormData) {
      forms.push({
        formType: ageGroup === "adult" ? "adultPsychiatricIntake" : "adolescentPsychiatricIntake",
        responses: final.intakeFormData as Record<string, unknown>,
      });
    }
    if (final.phq9) {
      forms.push({
        formType: "phq9",
        responses: final.phq9.responses as Record<string, unknown>,
        totalScore: final.phq9.score,
        interpretation: final.phq9.interpretation,
      });
    }
    if (final.gad7) {
      forms.push({
        formType: "gad7",
        responses: final.gad7.responses as Record<string, unknown>,
        totalScore: final.gad7.score,
        interpretation: final.gad7.interpretation,
      });
    }
    if (final.asrs) {
      forms.push({
        formType: "asrsAdult",
        responses: final.asrs.responses as Record<string, unknown>,
        totalScore: final.asrs.score,
        interpretation: final.asrs.interpretation,
      });
    }
    if (final.vanderbiltParent) {
      forms.push({
        formType: "vanderbiltParent",
        responses: final.vanderbiltParent.responses as Record<string, unknown>,
        totalScore: final.vanderbiltParent.inattentionScore + final.vanderbiltParent.hyperactivityScore,
        interpretation: final.vanderbiltParent.interpretation,
      });
    }

    await completeOnboardingMutation.mutateAsync({
      forms,
      completedSteps: {
        personalInfo: true,
        insurance: !!(final.insuranceProvider || final.insurancePolicyNumber),
        intake: !!final.intakeFormData,
        screenings: !!(final.phq9 || final.gad7 || final.asrs || final.vanderbiltParent),
        consent: true,
      },
      // StepConsent's own Zod validator already required these three to be
      // true and signatureName to be non-empty before calling onNext, so
      // they are guaranteed set by the time handleConsent runs.
      consentData: {
        hipaaAcknowledged: final.hipaaAcknowledged as true,
        consentToTreat: final.consentToTreat as true,
        telehealthConsent: final.telehealthConsent as true,
        signatureName: final.signatureName ?? "",
        signedAt: final.signedAt ?? new Date().toISOString(),
      },
    });
  }

  if (isLoading || isSessionPending || !currentUser || currentUser.onboardingCompletedAt) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        subtitle="Before your first visit"
        title="A few details"
        titleAccent="for your care team."
        description="These steps help your provider prepare for your first appointment. Most patients finish in 15 to 20 minutes, and you can skip anything that is not essential right now."
      />

      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <FadeUp className="section-container max-w-4xl">
          <div className="rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow) sm:p-10">
            <div ref={topRef} className="scroll-mt-28" />
            <Stepper steps={steps} current={currentIndex} />

            {stepKey === "personalInfo" && (
              <StepPersonalInfo
                data={data}
                stepLabel={stepLabel}
                onNext={(update) => {
                  mergeData(update);
                  goToStep("insurance");
                }}
                onBack={() => {}}
              />
            )}

            {stepKey === "insurance" && (
              <StepInsurance
                data={data}
                stepLabel={stepLabel}
                onNext={(update) => {
                  mergeData(update);
                  goToStep("medicalHistory");
                }}
                onSkip={() => goToStep("medicalHistory")}
                onBack={() => goToStep("personalInfo")}
              />
            )}

            {stepKey === "medicalHistory" && (
              <StepMedicalHistory
                data={data}
                stepLabel={stepLabel}
                onNext={(update) => {
                  mergeData(update);
                  goToStep("intake");
                }}
                onBack={() => goToStep("insurance")}
              />
            )}

            {stepKey === "intake" && (
              <StepIntakeForm
                data={data}
                ageGroup={ageGroup}
                stepLabel={stepLabel}
                onNext={(update) => {
                  mergeData(update);
                  goToStep("screeningIntro");
                }}
                onBack={() => goToStep("medicalHistory")}
              />
            )}

            {stepKey === "screeningIntro" && (
              <StepScreeningIntro
                ageGroup={ageGroup}
                stepLabel={stepLabel}
                onStart={() => goToStep("phq9")}
                onSkip={() => {
                  mergeData({ skipScreenings: true });
                  goToStep("consent");
                }}
                onBack={() => goToStep("intake")}
              />
            )}

            {stepKey === "phq9" && (
              <PHQ9Form
                stepLabel={stepLabel}
                onComplete={(result) => {
                  mergeData({ phq9: result });
                  goToStep(ageGroup === "adult" ? "gad7" : "vanderbiltParent");
                }}
                onBack={() => goToStep("screeningIntro")}
              />
            )}

            {stepKey === "gad7" && (
              <GAD7Form
                stepLabel={stepLabel}
                onComplete={(result) => {
                  mergeData({ gad7: result });
                  goToStep("asrs");
                }}
                onBack={() => goToStep("phq9")}
              />
            )}

            {stepKey === "asrs" && (
              <ASRSForm
                stepLabel={stepLabel}
                onComplete={(result) => {
                  mergeData({ asrs: result });
                  goToStep("consent");
                }}
                onBack={() => goToStep("gad7")}
              />
            )}

            {stepKey === "vanderbiltParent" && (
              <VanderbiltParentForm
                stepLabel={stepLabel}
                onComplete={(result) => {
                  mergeData({ vanderbiltParent: result });
                  goToStep("consent");
                }}
                onBack={() => goToStep("phq9")}
              />
            )}

            {stepKey === "consent" && (
              <StepConsent
                data={data}
                stepLabel={stepLabel}
                onNext={handleConsent}
                onBack={() =>
                  goToStep(
                    skipScreenings ? "screeningIntro" : ageGroup === "adult" ? "asrs" : "vanderbiltParent",
                  )
                }
                isPending={isPending}
              />
            )}
          </div>
        </FadeUp>
      </section>
    </>
  );
}
