"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  SquarePen,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useOverlay } from "@workspace/ui/hooks/use-overlay";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import PageIntro from "@workspace/ui/shared/PageIntro";
import BehaviorProgramForm from "@/components/forms/BehaviorProgramForm";
import {
  useTreatmentPlan,
  useUpdateTreatmentPlan,
  useDeleteTreatmentPlan,
  useBehaviorPrograms,
  useDeleteBehaviorProgram,
} from "@/hooks/treatment-plan";
import type { BehaviorProgramResponse } from "@workspace/contracts/behavior-program";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  skillAcquisition: "Skill Building",
  behaviorReduction: "Symptom Reduction",
};

const PROGRAM_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  mastered: "Mastered",
  onHold: "On Hold",
  discontinued: "Discontinued",
};

const TreatmentPlanDetailPage = ({
  params,
}: PageProps<"/patients/[id]/treatment-plans/[planId]">) => {
  const { id: patientId, planId } = React.use(params);
  const router = useRouter();
  const { closeOverlay, openOverlay } = useOverlay();
  const {
    data: plan,
    isLoading: planLoading,
    fetchError: planError,
  } = useTreatmentPlan(planId);
  const {
    data: programData,
    isLoading: programsLoading,
    fetchError: programsError,
  } = useBehaviorPrograms({
    treatmentPlanId: planId,
    limit: 50,
  });
  const { updateAsync: updatePlan } = useUpdateTreatmentPlan(planId);
  const { deleteAsync: deletePlan, isDeleting } = useDeleteTreatmentPlan();
  const { deleteAsync: deleteProgram } = useDeleteBehaviorProgram();

  const programs = programData?.programs ?? [];

  const handleDeletePlan = async () => {
    if (!confirm("Delete this treatment plan? This cannot be undone.")) return;
    try {
      await deletePlan(planId);
      toast.success("Treatment plan deleted.");
      router.push(`/patients/${patientId}/treatment-plans`);
    } catch (err: any) {
      toast.error("Failed to delete.", { description: err?.message });
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm("Remove this program?")) return;
    try {
      await deleteProgram(programId);
      toast.success("Program removed.");
    } catch (err: any) {
      toast.error("Failed to remove program.", { description: err?.message });
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await updatePlan({ status: status as any });
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const openProgramOverlay = (editing?: BehaviorProgramResponse) => {
    openOverlay({
      mode: "sheet",
      header: {
        title: editing ? "Update Program" : "Add Program",
        className: "text-3xl",
      },
      content: (
        <BehaviorProgramForm
          treatmentPlanId={planId}
          editing={editing}
          onDone={() => closeOverlay()}
          onCancel={() => closeOverlay()}
        />
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/patients/${patientId}/treatment-plans`}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Treatment Plans
        </Link>
        <span>/</span>
        <span>{plan?.title ?? "Plan"}</span>
      </div>

      {planError ? (
        <InfoNotice
          variant="error"
          message={
            planError.message ??
            "Could not load this treatment plan. Please refresh and try again."
          }
        />
      ) : planLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : plan ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <PageIntro
              title={plan.title}
              description={plan.description ?? "Psychiatric treatment plan"}
            />
            <div className="flex gap-2 shrink-0">
              <Button asChild variant="outline">
                <Link
                  href={`/patients/${patientId}/treatment-plans/${planId}/edit`}
                >
                  <SquarePen className="size-4 mr-1" />
                  Edit Plan
                </Link>
              </Button>
              <Select value={plan.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDeletePlan}
                disabled={isDeleting}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          <SectionCard
            title="Plan Details"
            contentClassName="grid gap-4 text-sm md:grid-cols-3"
          >
            <div>
              <p className="text-muted-foreground text-xs mb-1">Status</p>
              <Badge
                variant={getStatusVariant(plan.status)}
                className="capitalize"
              >
                {plan.status}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Start Date</p>
              <p>
                {plan.startDate
                  ? formatDate(plan.startDate, { mode: "date" })
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">End Date</p>
              <p>
                {plan.endDate
                  ? formatDate(plan.endDate, { mode: "date" })
                  : "-"}
              </p>
            </div>
            {plan.goals && (
              <div className="md:col-span-3">
                <p className="text-muted-foreground text-xs mb-1">Goals</p>
                <p className="whitespace-pre-wrap">{plan.goals}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-xs mb-1">Created By</p>
              <p>{plan.createdBy?.displayName ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Created</p>
              <p>{formatDate(plan.createdAt, { mode: "date" })}</p>
            </div>
          </SectionCard>
        </>
      ) : null}

      <SectionCard
        title="Care Programs"
        action={
          <Button size="sm" onClick={() => openProgramOverlay()}>
            <Plus className="size-4 mr-1" />
            Add Program
          </Button>
        }
        contentClassName="space-y-3"
      >
        {programsError && (
          <InfoNotice
            variant="error"
            message={
              programsError.message ??
              "Could not load care programs. Please refresh and try again."
            }
          />
        )}

        {!programsError &&
          programsLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl border p-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}

        {!programsError && !programsLoading && !programs.length && (
          <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
            <p className="text-sm font-medium">No programs yet</p>
            <p className="text-xs text-muted-foreground">
              Add the first care program to this plan.
            </p>
          </div>
        )}

        {programs.map((prog) => (
          <div
            key={prog.id}
            className="rounded-xl border p-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{prog.name}</p>
                <Badge
                  variant={getStatusVariant(prog.status)}
                  className="capitalize text-xs"
                >
                  {PROGRAM_STATUS_LABELS[prog.status] ?? prog.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {PROGRAM_TYPE_LABELS[prog.type] ?? prog.type}
                </Badge>
              </div>
              {prog.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prog.description}
                </p>
              )}
              {prog.masteryDefinition && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Mastery: </span>
                  {prog.masteryDefinition}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
              >
                <Link
                  href={`/patients/${patientId}/treatment-plans/${planId}/programs/${prog.id}/progress`}
                >
                  <TrendingUp className="size-3.5 mr-1" />
                  Progress
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => openProgramOverlay(prog)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="size-8"
                onClick={() => handleDeleteProgram(prog.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
};

export default TreatmentPlanDetailPage;
