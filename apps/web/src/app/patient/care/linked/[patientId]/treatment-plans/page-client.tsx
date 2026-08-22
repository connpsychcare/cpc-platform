"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, FileText, Info } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { formatDate } from "@workspace/shared/utils";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import { useTreatmentPlans } from "@/hooks/treatment-plan";
import { useMyCaregiverPatients } from "@/hooks/caregiver-access";

import type { TreatmentPlanResponse } from "@workspace/contracts/treatment-plan";
import ClinicalPatientSwitcher from "@/components/shared/ClinicalPatientSwitcher";

export default function LinkedPatientTreatmentPlansPage({ patientId }: { patientId: string }) {
  const { data: caregiverData } = useMyCaregiverPatients();
  const { data, isLoading } = useTreatmentPlans({ patientId, limit: 50 });

  const plans = data?.treatmentPlans ?? [];
  const linkedPatient = caregiverData?.caregiverAccesses?.find(
    (a) => a.patientId === patientId && a.isActive,
  );
  const patientName = linkedPatient?.patient?.user.displayName;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/patient" className="flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Overview
        </Link>
        <span>/</span>
        <span>{patientName}</span>
        <span>/</span>
        <span>Treatment Plans</span>
      </div>

      {/* Read-only access banner */}
      <div className="flex items-start gap-2.5 panel-info p-3 text-sm">
        <Info className="size-4 mt-0.5 shrink-0" />
        <span>
          Viewing clinical records for <strong>{patientName}</strong> - read-only access.
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">Treatment Plans</h1>
        <p className="text-sm text-muted-foreground">
          Psychiatric treatment plans for {patientName}.
        </p>
      </div>

      <ClinicalPatientSwitcher section="treatment-plans" activePatientId={patientId} />

      <SectionCard title="All Plans" contentClassName="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-2xl border p-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}

        {!isLoading && !plans.length && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-center">
            <ClipboardList className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No treatment plans yet</p>
          </div>
        )}

        {plans.map((plan: TreatmentPlanResponse) => (
          <div key={plan.id} className="rounded-2xl border p-4 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{plan.title}</p>
              <Badge variant={getStatusVariant(plan.status)} className="capitalize text-xs">
                {plan.status}
              </Badge>
            </div>
            {plan.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {plan.startDate && (
                <span>Started {formatDate(plan.startDate, { mode: "date" })}</span>
              )}
              {plan.endDate && (
                <span>Ends {formatDate(plan.endDate, { mode: "date" })}</span>
              )}
            </div>
          </div>
        ))}
      </SectionCard>

      <Link
        href={`/patient/care/linked/${patientId}/session-notes`}
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <FileText className="size-3.5" />
        View session notes for {patientName}
      </Link>
    </div>
  );
}
