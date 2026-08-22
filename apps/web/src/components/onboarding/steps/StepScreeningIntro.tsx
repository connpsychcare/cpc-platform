"use client";

import { ClipboardList } from "lucide-react";
import { StepFooter, StepIntro } from "../shared";

interface StepScreeningIntroProps {
  ageGroup: "adult" | "adolescent";
  stepLabel: string;
  onStart: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function StepScreeningIntro({
  ageGroup,
  stepLabel,
  onStart,
  onSkip,
  onBack,
}: StepScreeningIntroProps) {
  const instruments =
    ageGroup === "adult"
      ? "PHQ-9, GAD-7, and ASRS-v1.1"
      : "a PHQ-9 and a Vanderbilt Assessment";

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="A few brief screening questionnaires."
        body={`Your provider uses ${instruments} to get a clearer picture before your first visit. Each takes about 3 to 5 minutes. If you start one, we ask that you finish it - partial answers cannot be scored - but you are welcome to complete these at your first visit instead.`}
      />

      <div className="mt-8 flex items-start gap-4 rounded-2xl bg-secondary/60 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <ClipboardList className="size-5" />
        </span>
        <div>
          <p className="font-primary font-extrabold text-foreground">
            Standardized, provider-trusted questionnaires
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            These are the same screening tools used across psychiatric care nationally. Your answers
            stay confidential and go directly to your care team.
          </p>
        </div>
      </div>

      <StepFooter
        onBack={onBack}
        onContinue={onStart}
        continueLabel="Start screenings"
        secondaryAction={
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            I&apos;ll complete this before my first visit
          </button>
        }
      />
    </div>
  );
}
