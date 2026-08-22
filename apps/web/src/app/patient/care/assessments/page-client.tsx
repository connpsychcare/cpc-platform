"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { listClinicalForms } from "@workspace/sdk/clinical-form";
import {
  clinicalFormLabels,
  clinicalFormMaxScore,
  clinicalFormSeverity,
  type ClinicalFormTypeKey,
  type ClinicalSeverity,
} from "@workspace/shared/constants";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

const SEVERITY_VARIANT: Record<
  ClinicalSeverity,
  "success" | "warning" | "destructive"
> = {
  none: "success",
  mild: "warning",
  moderate: "warning",
  severe: "destructive",
};

export default function AssessmentsPage() {
  const { currentUser } = useCurrentUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-clinical-forms"],
    queryFn: () => listClinicalForms({ limit: 50, sortOrder: "desc" }),
    select: (res) => res.data,
    enabled: Boolean(currentUser),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const forms = data?.forms ?? [];

  return (
    <section className="section space-y-6 pb-20">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          My Care
        </span>
        <h1 className="mt-1 font-primary text-2xl font-extrabold tracking-tight text-foreground">
          Assessments &amp; Forms
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your completed screening questionnaires and intake forms.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border bg-muted/30"
            />
          ))}
        </div>
      ) : error ? (
        <div className="panel-destructive rounded-2xl px-5 py-4 text-sm">
          We could not load your assessments just now. Please refresh and try
          again.
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <ClipboardList className="size-10 text-muted-foreground/50" />
          <div>
            <p className="font-medium text-foreground">No assessments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your questionnaires and intake forms will appear here after your
              onboarding.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => {
            const max = clinicalFormMaxScore(form.formType);
            const severity = clinicalFormSeverity(
              form.formType,
              form.totalScore,
              form.responses,
            );

            return (
              <div
                key={form.id}
                className="flex items-start justify-between gap-4 rounded-2xl border bg-card px-5 py-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    {clinicalFormLabels[form.formType as ClinicalFormTypeKey] ??
                      form.formType}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Completed {formatDate(form.completedAt)}
                    {form.isOnboarding ? " · Part of initial intake" : ""}
                  </p>
                  {form.totalScore != null && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Score:{" "}
                      <span className="font-medium text-foreground">
                        {form.totalScore}
                        {max ? ` / ${max}` : ""}
                      </span>
                    </p>
                  )}
                </div>

                {form.interpretation && (
                  <Badge
                    variant={SEVERITY_VARIANT[severity]}
                    appearance="soft"
                    className="shrink-0 capitalize"
                  >
                    {form.interpretation}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
