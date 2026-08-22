"use client";

import {
  clinicalFormLabels,
  clinicalFormMaxScore,
  clinicalFormSeverity,
  describeClinicalForm,
  type ClinicalFormTypeKey,
  type ClinicalSeverity,
} from "@workspace/shared/constants";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import SectionCard from "@workspace/ui/shared/SectionCard";

export const SEVERITY_CLASS: Record<ClinicalSeverity, string> = {
  none: "bg-success/15 text-success border-success/25",
  mild: "bg-info/15 text-info border-info/25",
  moderate: "bg-warning/15 text-warning border-warning/25",
  severe: "bg-destructive/15 text-destructive border-destructive/25",
};

export const SEVERITY_LABEL: Record<ClinicalSeverity, string> = {
  none: "Minimal",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

/**
 * Coloured severity chip for a scored instrument.
 *
 * `responses` matters for ASRS, which screens on item thresholds rather than on
 * the stored total, so pass it wherever it is available.
 */
export function SeverityBadge({
  formType,
  totalScore,
  responses,
  className,
}: {
  formType: string;
  totalScore?: number | null;
  responses?: unknown;
  className?: string;
}) {
  if (typeof totalScore !== "number") {
    return <span className="text-sm text-muted-foreground">Not scored</span>;
  }

  const severity = clinicalFormSeverity(formType, totalScore, responses);
  const max = clinicalFormMaxScore(formType);

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", SEVERITY_CLASS[severity], className)}
    >
      {totalScore}
      {max ? ` / ${max}` : ""} &bull; {SEVERITY_LABEL[severity]}
    </Badge>
  );
}

interface ClinicalFormAnswersProps {
  formType: string;
  responses: unknown;
}

/**
 * The submitted answers, question by question.
 *
 * Falls back to the raw payload only when the form type is unrecognised, so a
 * newly added instrument is still readable before it gets a question bank.
 */
export default function ClinicalFormAnswers({
  formType,
  responses,
}: ClinicalFormAnswersProps) {
  const sections = describeClinicalForm(formType, responses);

  if (!sections.length) {
    return (
      <SectionCard
        title="Responses"
        description={`No question labels are defined for "${formType}" yet.`}
      >
        <pre className="max-h-96 overflow-auto rounded-xl bg-muted/60 p-4 text-xs">
          {JSON.stringify(responses, null, 2)}
        </pre>
      </SectionCard>
    );
  }

  const label = clinicalFormLabels[formType as ClinicalFormTypeKey] ?? formType;

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <SectionCard
          key={section.title ?? i}
          title={section.title ?? `${label} Responses`}
          description={
            section.subtotal !== undefined
              ? `Subtotal ${section.subtotal}`
              : undefined
          }
          contentClassName="p-0"
        >
          <ul className="divide-y">
            {section.rows.map((row, rowIndex) => (
              <li
                key={row.question}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <p className="min-w-0 text-sm">
                  <span className="mr-2 text-muted-foreground tabular-nums">
                    {rowIndex + 1}.
                  </span>
                  {row.question}
                </p>
                <p className="shrink-0 text-sm font-medium sm:max-w-[45%] sm:text-right">
                  {row.answer}
                  {row.score !== undefined && (
                    <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                      ({row.score})
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>
      ))}
    </div>
  );
}
