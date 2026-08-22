"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { formatDate } from "@workspace/shared/utils";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import {
  useTreatmentPlan,
  useBehaviorPrograms,
  useBehaviorProgramProgress,
} from "@/hooks/treatment-plan";

import type { BehaviorProgramResponse } from "@workspace/contracts/behavior-program";

const PROGRAM_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  mastered: "Mastered",
  onHold: "On Hold",
  discontinued: "Discontinued",
};

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  skillAcquisition: "Skill Building",
  behaviorReduction: "Symptom Reduction",
};

function PatientBehaviorProgramCard({
  program,
}: {
  program: BehaviorProgramResponse;
}) {
  const { data: progress, isLoading } = useBehaviorProgramProgress(program.id);

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium">{program.name}</p>
        <Badge variant={getStatusVariant(program.status)} className="capitalize text-xs">
          {PROGRAM_STATUS_LABELS[program.status] ?? program.status}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {PROGRAM_TYPE_LABELS[program.type] ?? program.type}
        </Badge>
      </div>

      {program.description && (
        <p className="text-sm text-muted-foreground">{program.description}</p>
      )}

      {program.masteryDefinition && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Mastery: </span>
          {program.masteryDefinition}
        </p>
      )}

      {program.baselineData && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Baseline: </span>
          {program.baselineData}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2 w-full" />
        </div>
      ) : progress ? (
        <>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall progress</span>
              <span>{progress.overallPercent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(progress.overallPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <p>Sessions: {progress.totalSessions}</p>
            <p>Trials: {progress.totalTrials}</p>
            <p>Mastery threshold: {progress.masteryThreshold}%</p>
          </div>

          {progress.nearingMastery && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-foreground">
              This program is nearing mastery based on the recent sessions.
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default function PatientTreatmentPlanDetailPage({ planId }: { planId: string }) {
  const { data: plan, isLoading: planLoading } = useTreatmentPlan(planId);
  const { data: programData, isLoading: programsLoading } = useBehaviorPrograms({
    treatmentPlanId: planId,
    limit: 50,
  });

  const programs = programData?.programs ?? [];

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/patient/care/treatment-plans"
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Treatment Plans
        </Link>
        <span>/</span>
        <span>{plan?.title ?? "Plan"}</span>
      </div>

      {planLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : plan ? (
        <>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">{plan.title}</h1>
              <Badge variant={getStatusVariant(plan.status)} className="capitalize">
                {plan.status}
              </Badge>
            </div>
            {plan.description && (
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            )}
          </div>

          <SectionCard title="Plan Details" contentClassName="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Status</p>
              <Badge variant={getStatusVariant(plan.status)} className="capitalize">{plan.status}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Start Date</p>
              <p>{plan.startDate ? formatDate(plan.startDate, { mode: "date" }) : "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">End Date</p>
              <p>{plan.endDate ? formatDate(plan.endDate, { mode: "date" }) : "-"}</p>
            </div>
            {plan.goals && (
              <div className="md:col-span-3">
                <p className="text-muted-foreground text-xs mb-1">Goals</p>
                <p className="whitespace-pre-wrap">{plan.goals}</p>
              </div>
            )}
          </SectionCard>
        </>
      ) : null}

      <SectionCard title="Care Programs" contentClassName="space-y-3">
        {programsLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-2xl border p-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}

        {!programsLoading && !programs.length && (
          <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-center">
            <p className="text-sm font-medium">No programs on this plan yet</p>
          </div>
        )}

        {programs.map((prog: BehaviorProgramResponse) => (
          <PatientBehaviorProgramCard key={prog.id} program={prog} />
        ))}
      </SectionCard>
    </div>
  );
}
