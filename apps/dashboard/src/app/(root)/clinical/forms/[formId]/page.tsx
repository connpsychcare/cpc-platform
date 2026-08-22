"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, School, UserRound } from "lucide-react";
import {
  clinicalFormLabels,
  type ClinicalFormTypeKey,
} from "@workspace/shared/constants";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import PageIntro from "@workspace/ui/shared/PageIntro";
import QueryState from "@workspace/ui/shared/QueryState";
import SectionCard from "@workspace/ui/shared/SectionCard";

import ClinicalFormAnswers, {
  SeverityBadge,
} from "@/components/clinical/ClinicalFormAnswers";
import { useClinicalForm } from "@/hooks/clinical-forms";

const ClinicalFormDetailPage = ({
  params,
}: PageProps<"/clinical/forms/[formId]">) => {
  const { formId } = React.use(params);
  const { data: form, isLoading, fetchError } = useClinicalForm(formId);

  const teacher = form?.teacherAssessmentToken;
  const label = form
    ? (clinicalFormLabels[form.formType as ClinicalFormTypeKey] ??
      form.formType)
    : "Clinical Form";

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/clinical/screening-results">
          <ArrowLeft className="size-4" />
          Back to assessments
        </Link>
      </Button>

      <QueryState
        isLoading={isLoading}
        error={fetchError}
        isEmpty={!form}
        skeletonRows={5}
        empty={
          <SectionCard title="Not found">
            <p className="text-sm text-muted-foreground">
              This form response no longer exists.
            </p>
          </SectionCard>
        }
      >
        {form && (
          <>
            <PageIntro
              eyebrow="Clinical Form"
              title={label}
              description={`Submitted ${formatDate(form.completedAt, {
                mode: "datetime",
              })}`}
            />

            <SectionCard title="Summary" contentClassName="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Patient</p>
                <Link
                  href={`/patients/${form.patientId}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                >
                  <UserRound className="size-3.5" />
                  {form.patient?.user.displayName}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {form.patient?.user.email}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Result</p>
                <SeverityBadge
                  formType={form.formType}
                  totalScore={form.totalScore}
                  responses={form.responses}
                />
                {form.interpretation && (
                  <p className="text-xs text-muted-foreground">
                    {form.interpretation}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Source</p>
                <Badge variant={form.isOnboarding ? "outline" : "secondary"}>
                  {form.isOnboarding ? "Onboarding" : "In care"}
                </Badge>
              </div>

              {(teacher || form.administeredBy) && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {teacher ? "Completed by teacher" : "Administered by"}
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {teacher && <School className="size-3.5" />}
                    {teacher
                      ? (teacher.teacherName ?? teacher.teacherEmail)
                      : form.administeredBy?.displayName}
                  </p>
                  {teacher?.schoolName && (
                    <p className="text-xs text-muted-foreground">
                      {teacher.schoolName}
                    </p>
                  )}
                </div>
              )}
            </SectionCard>

            <ClinicalFormAnswers
              formType={form.formType}
              responses={form.responses}
            />
          </>
        )}
      </QueryState>
    </div>
  );
};

export default ClinicalFormDetailPage;
