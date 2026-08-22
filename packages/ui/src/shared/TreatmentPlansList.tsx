"use client";

import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Skeleton } from "../components/skeleton";
import SectionCard from "./SectionCard";
import { InfoNotice } from "./InfoNotice";
import { getStatusVariant } from "../lib/utils";
import type { TreatmentPlanResponse } from "@workspace/contracts/treatment-plan";

interface TreatmentPlansListProps {
  plans: TreatmentPlanResponse[];
  isLoading: boolean;
  /** The list query's error, so a failed fetch does not read as "no plans yet". */
  error?: { message?: string } | null;
  /** e.g. "/admin/patients/[id]/treatment-plans" */
  basePath: string;
  /** Whether the current user can create/edit plans */
  canEdit?: boolean;
}

const TreatmentPlansList = ({
  plans,
  isLoading,
  error,
  basePath,
  canEdit = true,
}: TreatmentPlansListProps) => {
  return (
    <SectionCard
      title="Treatment Plans"
      action={
        canEdit ? (
          <Button asChild size="sm">
            <Link href={`${basePath}/new`}>
              <Plus className="size-4 mr-1" />
              New Plan
            </Link>
          </Button>
        ) : undefined
      }
      contentClassName="space-y-3"
    >
      {error && (
        <InfoNotice
          variant="error"
          message={
            error.message ??
            "Could not load treatment plans. Please refresh and try again."
          }
        />
      )}

      {!error &&
        isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border p-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}

      {!error && !isLoading && !plans.length && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
          <ClipboardList className="size-8 text-muted-foreground" />
          <div>
            <p className="font-medium">No treatment plans yet</p>
            {canEdit && (
              <p className="text-sm text-muted-foreground">
                Create the first plan for this patient.
              </p>
            )}
          </div>
        </div>
      )}

      {!error &&
        plans.map((plan) => (
          <Link key={plan.id} href={`${basePath}/${plan.id}`} className="block">
            <div className="rounded-xl border p-4 transition-colors hover:bg-secondary/50">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{plan.title}</p>
                    <Badge
                      variant={getStatusVariant(plan.status)}
                      className="capitalize text-xs"
                    >
                      {plan.status}
                    </Badge>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {plan.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {plan.startDate && (
                      <span>
                        Start: {formatDate(plan.startDate, { mode: "date" })}
                      </span>
                    )}
                    {plan.endDate && (
                      <span>
                        End: {formatDate(plan.endDate, { mode: "date" })}
                      </span>
                    )}
                    {plan.createdBy && (
                      <span>By: {plan.createdBy.displayName}</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  Open Plan
                </Button>
              </div>
            </div>
          </Link>
        ))}
    </SectionCard>
  );
};

export default TreatmentPlansList;
