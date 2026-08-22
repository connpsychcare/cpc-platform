"use client";

import { useState } from "react";
import { FREQUENCY_0_3, GAD7_QUESTIONS } from "@workspace/shared/constants";
import { ScreeningProgress, ScreeningQuestion, StepFooter, StepIntro } from "../shared";

const OPTIONS = FREQUENCY_0_3.map((label, value) => ({ label, value }));

function getInterpretation(score: number): string {
  if (score <= 4) return "Minimal anxiety";
  if (score <= 9) return "Mild anxiety";
  if (score <= 14) return "Moderate anxiety";
  return "Severe anxiety";
}

export type GAD7Result = {
  responses: Record<string, number>;
  score: number;
  interpretation: string;
};

interface GAD7FormProps {
  stepLabel: string;
  onComplete: (result: GAD7Result) => void;
  onBack: () => void;
}

export function GAD7Form({ stepLabel, onComplete, onBack }: GAD7FormProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showError, setShowError] = useState(false);

  const answered = Object.keys(responses).length;
  const allAnswered = answered === GAD7_QUESTIONS.length;
  const score = Object.values(responses).reduce((a, b) => a + b, 0);

  function handleSelect(questionIdx: number, value: number) {
    setResponses((prev) => ({ ...prev, [`q${questionIdx + 1}`]: value }));
    setShowError(false);
  }

  function handleSubmit() {
    if (!allAnswered) {
      setShowError(true);
      return;
    }
    onComplete({ responses, score, interpretation: getInterpretation(score) });
  }

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="GAD-7 anxiety screener."
        body="Over the past 2 weeks, how often have you been bothered by the following problems?"
      />

      <div className="mt-8 space-y-5">
        {GAD7_QUESTIONS.map((question, idx) => (
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
          Please answer all {GAD7_QUESTIONS.length} questions before continuing.
        </p>
      )}

      <div className="mt-4">
        <ScreeningProgress answered={answered} total={GAD7_QUESTIONS.length} />
      </div>

      <StepFooter onBack={onBack} onContinue={handleSubmit} />
    </div>
  );
}
