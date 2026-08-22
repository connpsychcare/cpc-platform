"use client";

import { useState } from "react";
import {
  VANDERBILT_FREQUENCY,
  VANDERBILT_HYPERACTIVITY,
  VANDERBILT_INATTENTION,
  VANDERBILT_PERFORMANCE,
  VANDERBILT_PERFORMANCE_ITEMS,
} from "@workspace/shared/constants";
import { ScreeningProgress, ScreeningQuestion, StepFooter, StepIntro } from "../shared";

const FREQ_OPTIONS = VANDERBILT_FREQUENCY.map((label, value) => ({ label, value }));
const PERF_OPTIONS = VANDERBILT_PERFORMANCE.map((label, i) => ({ label, value: i + 1 }));

export type VanderbiltParentResult = {
  responses: Record<string, number>;
  inattentionScore: number;
  hyperactivityScore: number;
  interpretation: string;
};

interface VanderbiltParentFormProps {
  stepLabel: string;
  onComplete: (result: VanderbiltParentResult) => void;
  onBack: () => void;
}

export function VanderbiltParentForm({ stepLabel, onComplete, onBack }: VanderbiltParentFormProps) {
  const [freq, setFreq] = useState<Record<string, number>>({});
  const [perf, setPerf] = useState<Record<string, number>>({});
  const [showError, setShowError] = useState(false);

  const totalItems =
    VANDERBILT_INATTENTION.length + VANDERBILT_HYPERACTIVITY.length + VANDERBILT_PERFORMANCE_ITEMS.length;
  const answered = Object.keys(freq).length + Object.keys(perf).length;
  const allAnswered = answered === totalItems;

  function handleSubmit() {
    if (!allAnswered) {
      setShowError(true);
      return;
    }

    const inattentionScore = VANDERBILT_INATTENTION.reduce(
      (sum, _, i) => sum + (freq[`ia${i}`] ?? 0),
      0,
    );
    const hyperactivityScore = VANDERBILT_HYPERACTIVITY.reduce(
      (sum, _, i) => sum + (freq[`hy${i}`] ?? 0),
      0,
    );

    const inattentionPositive = VANDERBILT_INATTENTION.filter((_, i) => (freq[`ia${i}`] ?? 0) >= 2).length;
    const hyperactivityPositive = VANDERBILT_HYPERACTIVITY.filter(
      (_, i) => (freq[`hy${i}`] ?? 0) >= 2,
    ).length;

    const parts: string[] = [];
    if (inattentionPositive >= 6) parts.push("predominantly inattentive presentation");
    if (hyperactivityPositive >= 6) parts.push("predominantly hyperactive-impulsive presentation");
    const interpretation = parts.length
      ? `Consistent with ADHD - ${parts.join(" and ")}`
      : "Below threshold for ADHD - fewer than 6 symptoms in either domain";

    onComplete({
      responses: { ...freq, ...perf },
      inattentionScore,
      hyperactivityScore,
      interpretation,
    });
  }

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="Vanderbilt assessment - parent form."
        body="Each rating should be considered in the context of what is appropriate for your child's age. Rate the frequency of each behavior over the past 6 months."
      />

      <div className="mt-8 space-y-8">
        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Part 1 - Inattention symptoms
          </h4>
          {VANDERBILT_INATTENTION.map((q, i) => (
            <ScreeningQuestion
              key={i}
              index={i + 1}
              question={q}
              options={FREQ_OPTIONS}
              value={freq[`ia${i}`]}
              onChange={(value) => {
                setFreq((p) => ({ ...p, [`ia${i}`]: value }));
                setShowError(false);
              }}
              invalid={showError && freq[`ia${i}`] === undefined}
            />
          ))}
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Part 2 - Hyperactivity / impulsivity symptoms
          </h4>
          {VANDERBILT_HYPERACTIVITY.map((q, i) => (
            <ScreeningQuestion
              key={i}
              index={i + 1}
              question={q}
              options={FREQ_OPTIONS}
              value={freq[`hy${i}`]}
              onChange={(value) => {
                setFreq((p) => ({ ...p, [`hy${i}`]: value }));
                setShowError(false);
              }}
              invalid={showError && freq[`hy${i}`] === undefined}
            />
          ))}
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Part 3 - Academic &amp; social performance
          </h4>
          <p className="text-xs text-muted-foreground">
            Rate your child&apos;s performance in the following areas over the past 6 months.
          </p>
          {VANDERBILT_PERFORMANCE_ITEMS.map((area, i) => (
            <ScreeningQuestion
              key={i}
              index={i + 1}
              question={area}
              options={PERF_OPTIONS}
              value={perf[`pf${i}`]}
              onChange={(value) => {
                setPerf((p) => ({ ...p, [`pf${i}`]: value }));
                setShowError(false);
              }}
              invalid={showError && perf[`pf${i}`] === undefined}
            />
          ))}
        </section>
      </div>

      {showError && (
        <p className="mt-4 text-sm text-destructive">Please complete all sections before continuing.</p>
      )}

      <div className="mt-4">
        <ScreeningProgress answered={answered} total={totalItems} />
      </div>

      <StepFooter onBack={onBack} onContinue={handleSubmit} />
    </div>
  );
}
