"use client";

import { useState } from "react";
import { ASRS_QUESTIONS, FREQUENCY_0_4, asrsPositiveItems } from "@workspace/shared/constants";
import { ScreeningProgress, ScreeningQuestion, StepFooter, StepIntro } from "../shared";

const OPTIONS = FREQUENCY_0_4.map((label, value) => ({ label, value }));

export type ASRSResult = {
  responses: Record<string, number>;
  score: number;
  positiveItems: number;
  interpretation: string;
};

interface ASRSFormProps {
  stepLabel: string;
  onComplete: (result: ASRSResult) => void;
  onBack: () => void;
}

export function ASRSForm({ stepLabel, onComplete, onBack }: ASRSFormProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showError, setShowError] = useState(false);

  const answered = Object.keys(responses).length;
  const allAnswered = answered === ASRS_QUESTIONS.length;

  function handleSelect(idx: number, value: number) {
    setResponses((prev) => ({ ...prev, [`q${idx + 1}`]: value }));
    setShowError(false);
  }

  function handleSubmit() {
    if (!allAnswered) {
      setShowError(true);
      return;
    }

    const positiveItems = asrsPositiveItems(responses) ?? 0;
    const score = Object.values(responses).reduce((a, b) => a + b, 0);
    const isPositive = positiveItems >= 4;
    const interpretation = isPositive
      ? "Positive screen - symptoms consistent with ADHD (4+ items above threshold)"
      : "Negative screen - symptoms below ADHD threshold";

    onComplete({ responses, score, positiveItems, interpretation });
  }

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="ASRS v1.1 - adult ADHD screener."
        body="Rate yourself on how you have felt and conducted yourself over the past 6 months."
      />

      <div className="mt-8 space-y-5">
        {ASRS_QUESTIONS.map((question, idx) => (
          <ScreeningQuestion
            key={idx}
            index={idx + 1}
            question={question}
            options={OPTIONS}
            value={responses[`q${idx + 1}`]}
            onChange={(value) => handleSelect(idx, value)}
            invalid={showError && responses[`q${idx + 1}`] === undefined}
          />
        ))}
      </div>

      {showError && (
        <p className="mt-4 text-sm text-destructive">
          Please answer all {ASRS_QUESTIONS.length} questions before continuing.
        </p>
      )}

      <div className="mt-4">
        <ScreeningProgress answered={answered} total={ASRS_QUESTIONS.length} />
      </div>

      <StepFooter onBack={onBack} onContinue={handleSubmit} />
    </div>
  );
}
