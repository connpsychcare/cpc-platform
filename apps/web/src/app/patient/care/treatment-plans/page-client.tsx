"use client";

import Link from "next/link";
import { ClipboardList, FileText, Stethoscope } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { formatDate } from "@workspace/shared/utils";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import { useTreatmentPlans } from "@/hooks/treatment-plan";
import type { TreatmentPlanResponse } from "@workspace/contracts/treatment-plan";
import ClinicalPatientSwitcher from "@/components/shared/ClinicalPatientSwitcher";

export default function PatientTreatmentPlansPage() {
  const { data, isLoading } = useTreatmentPlans({ limit: 50 });
  const plans = data?.treatmentPlans ?? [];

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">Treatment Plans</h1>
        <p className="text-sm text-muted-foreground">
          Your individualized psychiatric treatment plans prepared by your care team.
        </p>
      </div>

      <ClinicalPatientSwitcher section="treatment-plans" />

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
            <p className="text-xs text-muted-foreground">
              Your care team will create a plan once your assessment is complete.
            </p>
          </div>
        )}

        {plans.map((plan: TreatmentPlanResponse) => (
          <Link
            key={plan.id}
            href={`/patient/care/treatment-plans/${plan.id}`}
            className="block rounded-2xl border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{plan.title}</p>
                  <Badge variant={getStatusVariant(plan.status)} className="capitalize text-xs">
                    {plan.status}
                  </Badge>
                </div>
                {plan.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {plan.provider?.user?.displayName && (
                    <span className="inline-flex items-center gap-1">
                      <Stethoscope className="size-3" />
                      {plan.provider.user.displayName}
                    </span>
                  )}
                  {typeof plan._count?.programs === "number" && (
                    <span className="inline-flex items-center gap-1">
                      <ClipboardList className="size-3" />
                      {plan._count.programs}{" "}
                      {plan._count.programs === 1 ? "program" : "programs"}
                    </span>
                  )}
                  {plan.startDate && (
                    <span>Started {formatDate(plan.startDate, { mode: "date" })}</span>
                  )}
                  {plan.endDate && (
                    <span>Ends {formatDate(plan.endDate, { mode: "date" })}</span>
                  )}
                </div>
              </div>
              <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            </div>
          </Link>
        ))}
      </SectionCard>
    </div>
  );
}
