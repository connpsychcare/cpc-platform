"use client";

import {
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Activity,
} from "lucide-react";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { PatientProfileResponse } from "@workspace/contracts/patient";

import {
  clinicalFormSeverity,
  clinicalFormShortLabels,
  screeningFormTypes,
  type ClinicalFormTypeKey,
  type ClinicalSeverity,
} from "@workspace/shared/constants";

import { useClinicalForms } from "@/hooks/clinical-forms";
import { useTreatmentPlans } from "@/hooks/treatment-plan";

// Labels and bands come from the shared clinical-form module so this panel
// cannot drift from the screening-results and detail surfaces.
const SCREENING_LABELS = clinicalFormShortLabels;
const SCREENING_TYPES: string[] = screeningFormTypes;

const levelVariant: Record<
  ClinicalSeverity,
  "secondary" | "default" | "warning" | "destructive"
> = {
  none: "secondary",
  mild: "default",
  moderate: "warning",
  severe: "destructive",
};

interface PatientBriefingPanelProps {
  patientId: string;
  patient?: PatientProfileResponse | null;
}

const PatientBriefingPanel = ({
  patientId,
  patient,
}: PatientBriefingPanelProps) => {
  const { data: formsData, isLoading: formsLoading } = useClinicalForms({
    patientId,
    limit: 20,
    sortOrder: "desc",
  });
  const { data: plansData, isLoading: plansLoading } = useTreatmentPlans({
    patientId,
    limit: 1,
  });

  const onboardingCompletedAt = (patient?.user as any)
    ?.onboardingCompletedAt as string | null | undefined;

  const forms = formsData?.forms ?? [];
  const latestByType: Record<string, (typeof forms)[0]> = {};
  for (const form of forms) {
    if (
      SCREENING_TYPES.includes(form.formType) &&
      !latestByType[form.formType]
    ) {
      latestByType[form.formType] = form;
    }
  }

  const activePlan = plansData?.treatmentPlans?.[0] ?? null;

  return (
    <Card className="border-l-4 border-l-primary bg-card/50">
      <CardContent className="p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Patient Briefing
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Onboarding
            </p>
            {onboardingCompletedAt ? (
              <div className="flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Completed {formatDate(onboardingCompletedAt)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-warning">
                <AlertCircle className="size-4 shrink-0" />
                <span>Not completed</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Activity className="size-3.5" />
              <p className="text-xs font-medium">Recent Screenings</p>
            </div>
            {formsLoading ? (
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28" />
              </div>
            ) : Object.keys(latestByType).length === 0 ? (
              <p className="text-sm text-muted-foreground">No screenings yet</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {SCREENING_TYPES.map((type) => {
                  const form = latestByType[type];
                  if (!form) return null;
                  const score = form.totalScore;
                  const level = clinicalFormSeverity(
                    type,
                    score,
                    form.responses,
                  );
                  return (
                    <Badge
                      key={type}
                      variant={levelVariant[level]}
                      className="text-xs"
                    >
                      {SCREENING_LABELS[type as ClinicalFormTypeKey] ?? type}:{" "}
                      {score ?? "-"}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ClipboardList className="size-3.5" />
              <p className="text-xs font-medium">Treatment Plan</p>
            </div>
            {plansLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : activePlan ? (
              <p className="text-sm font-medium text-foreground">
                {activePlan.title}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No active plan</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientBriefingPanel;
