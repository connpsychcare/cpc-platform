"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

export function StepIntro({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{step}</p>
      <h2 className="mt-3 font-primary text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {body && (
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          {body}
        </p>
      )}
    </div>
  );
}

export function StepFooter({
  onBack,
  onContinue,
  backLabel = "Back",
  continueLabel = "Continue",
  continueDisabled,
  isPending,
  secondaryAction,
}: {
  onBack?: () => void;
  onContinue: () => void;
  backLabel?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  isPending?: boolean;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {onBack ? (
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={onBack}
          disabled={isPending}
        >
          <ArrowLeft className="size-4" /> {backLabel}
        </Button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-2">
        {secondaryAction}
        <Button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled || isPending}
        >
          {isPending ? "Saving..." : continueLabel}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

/**
 * One scored question in a screening instrument (PHQ-9, GAD-7, ASRS,
 * Vanderbilt): a button grid rather than a native input, so it renders
 * directly instead of going through FormField/TanStack Form.
 */
export function ScreeningQuestion({
  index,
  question,
  options,
  value,
  onChange,
  invalid,
}: {
  index: number;
  question: string;
  options: { label: string; value: number }[];
  value: number | undefined;
  onChange: (value: number) => void;
  invalid?: boolean;
}) {
  return (
    <div className={cn("-mx-3 space-y-2 rounded-xl px-3 py-2", invalid && "bg-destructive/5")}>
      <p className="text-sm font-medium text-foreground">
        {index}. {question}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              value === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ScreeningProgress({ answered, total }: { answered: number; total: number }) {
  return (
    <p className="text-xs text-muted-foreground">
      {answered} of {total} answered
    </p>
  );
}
