"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import { getOnboardingStatus } from "@workspace/sdk/onboarding";
import { formatDate } from "@workspace/shared/utils";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

const STEP_KEYS = [
  { key: "personalInfo", label: "Personal Information" },
  { key: "insurance", label: "Insurance Details" },
  { key: "intakeForm", label: "Psychiatric Intake Form" },
  { key: "screeningForms", label: "Screening Questionnaires" },
  { key: "consent", label: "Consent & Signature" },
] as const;

export default function OnboardingPage() {
  const { currentUser } = useCurrentUser();

  const { data: status, isLoading } = useQuery({
    queryKey: ["onboarding-status"],
    queryFn: () => getOnboardingStatus(),
    select: (res) => res.data,
    enabled: Boolean(currentUser),
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="section mx-auto max-w-2xl py-20 flex justify-center">
        <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const completedAt = status?.completedAt ?? currentUser?.onboardingCompletedAt;
  const steps = status?.steps;

  return (
    <section className="section mx-auto max-w-2xl space-y-8 pb-20">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          My Onboarding
        </span>
        <h1 className="mt-1 font-primary text-2xl font-extrabold tracking-tight text-foreground">Intake & Onboarding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your initial intake forms and clinical questionnaires submitted when joining Connected
          Psychiatric Care.
        </p>
      </div>

      {completedAt ? (
        <>
          <div className="flex items-start gap-4 rounded-2xl border border-success/25 bg-success/10 px-5 py-4 dark:border-success/25/40 dark:bg-success/10/20">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success dark:text-success" />
            <div>
              <p className="text-sm font-medium text-success dark:text-success">
                Onboarding complete
              </p>
              <p className="mt-0.5 text-xs text-success dark:text-success">
                Completed on {formatDate(completedAt)}
              </p>
            </div>
          </div>

          {steps && (
            <div className="rounded-2xl border bg-card shadow-sm divide-y">
              {STEP_KEYS.map(({ key, label }) => {
                const done = steps[key];
                return (
                  <div key={key} className="flex items-center gap-3 px-5 py-4">
                    {done ? (
                      <CheckCircle2 className="size-5 shrink-0 text-primary" />
                    ) : (
                      <Clock className="size-5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span
                      className={cn(
                        "ml-auto text-xs font-medium",
                        done ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {done ? "Submitted" : "Skipped"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button variant="outline" asChild className="justify-between">
              <a href="/patient/care/assessments">
                View My Screening Results <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="ghost" asChild className="justify-between">
              <Link href="/patient/care/treatment-plans">
                View My Treatment Plans <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border bg-card shadow-sm p-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t completed your intake yet.
          </p>
          <Button asChild>
            <a href="/complete-profile">Complete Your Intake</a>
          </Button>
        </div>
      )}
    </section>
  );
}
