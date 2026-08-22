"use client";

import React from "react";
import Link from "next/link";
import { ClipboardCheck, FileText } from "lucide-react";
import {
  clinicalFormLabels,
  intakeFormTypes,
  screeningFormTypes,
  type ClinicalFormTypeKey,
} from "@workspace/shared/constants";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import PageIntro from "@workspace/ui/shared/PageIntro";
import QueryState from "@workspace/ui/shared/QueryState";
import SectionCard from "@workspace/ui/shared/SectionCard";

import { SeverityBadge } from "@/components/clinical/ClinicalFormAnswers";
import { useClinicalForms } from "@/hooks/clinical-forms";

const SCREENING: string[] = screeningFormTypes;
const INTAKE: string[] = intakeFormTypes;

const PatientAssessmentsPage = ({
  params,
}: PageProps<"/patients/[id]/assessments">) => {
  const { id } = React.use(params);
  const { data, isLoading, fetchError } = useClinicalForms({
    patientId: id,
    limit: 100,
  });

  const forms = data?.forms ?? [];

  // Grouped so a reader sees scored screenings and narrative intakes apart,
  // rather than one mixed list ordered only by date.
  const screenings = forms.filter((form) => SCREENING.includes(form.formType));
  const intakes = forms.filter((form) => INTAKE.includes(form.formType));
  const teacher = forms.filter(
    (form) => form.formType === "vanderbiltTeacher",
  );

  const label = (formType: string) =>
    clinicalFormLabels[formType as ClinicalFormTypeKey] ?? formType;

  const row = (form: (typeof forms)[number], scored: boolean) => (
    <div
      key={form.id}
      className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 space-y-1">
        <p className="truncate text-sm font-medium">{label(form.formType)}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(form.completedAt, { mode: "datetime" })}
          {form.isOnboarding ? " · Onboarding" : ""}
        </p>
        {form.interpretation && (
          <p className="text-xs text-muted-foreground italic">
            {form.interpretation}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        {scored ? (
          <SeverityBadge
            formType={form.formType}
            totalScore={form.totalScore}
            responses={form.responses}
          />
        ) : (
          <Badge variant="outline">Questionnaire</Badge>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href={`/clinical/forms/${form.id}`}>
            <FileText className="size-3.5" />
            View responses
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageIntro
        title="Assessments & Intake"
        description="Every screening questionnaire and intake form this patient has submitted."
      />

      <QueryState
        isLoading={isLoading}
        error={fetchError}
        isEmpty={forms.length === 0}
        empty={
          <SectionCard title="No Assessments">
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
              <ClipboardCheck className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">No forms submitted yet</p>
              <p className="text-xs text-muted-foreground">
                Screening and intake forms appear here once the patient
                completes onboarding.
              </p>
            </div>
          </SectionCard>
        }
      >
        <div className="space-y-6">
          {screenings.length > 0 && (
            <SectionCard
              title="Screening Results"
              description="Scored instruments with severity bands."
              contentClassName="space-y-3"
            >
              {screenings.map((form) => row(form, true))}
            </SectionCard>
          )}

          {intakes.length > 0 && (
            <SectionCard
              title="Intake Forms"
              description="Narrative psychiatric history submitted by the patient."
              contentClassName="space-y-3"
            >
              {intakes.map((form) => row(form, false))}
            </SectionCard>
          )}

          {teacher.length > 0 && (
            <SectionCard
              title="Teacher Assessments"
              description="Vanderbilt scales returned by the patient's teachers."
              contentClassName="space-y-3"
            >
              {teacher.map((form) => row(form, true))}
            </SectionCard>
          )}
        </div>
      </QueryState>
    </div>
  );
};

export default PatientAssessmentsPage;
