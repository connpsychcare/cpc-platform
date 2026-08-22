"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { formatDate } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useDataPoints, useDeleteDataPoint } from "@/hooks/data-point";
import { toast } from "sonner";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const RECORDING_TYPE_LABELS: Record<string, string> = {
  discreteTrial: "Discrete Trial",
  intervalRecording: "Interval Recording",
  frequencyRate: "Frequency / Rate",
  duration: "Duration",
};

const RESPONSE_LABELS: Record<string, string> = {
  correct: "Correct",
  incorrect: "Incorrect",
  prompted: "Prompted",
  noResponse: "No Response",
};

const DataPointsPage = ({
  params,
}: PageProps<"/patients/[id]/session-notes/[noteId]/data-points">) => {
  const { id: patientId, noteId } = React.use(params);
  const { data, isLoading, fetchError } = useDataPoints({
    sessionNoteId: noteId,
    limit: 50,
  } as any);
  const { deleteAsync, isDeleting } = useDeleteDataPoint();

  const handleDelete = async (dataPointId: string) => {
    if (!confirm("Delete this data point? This cannot be undone.")) return;
    try {
      await deleteAsync(dataPointId);
      toast.success("Data point deleted.");
    } catch (err: any) {
      toast.error("Failed to delete.", { description: err?.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/patients/${patientId}/session-notes/${noteId}`}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Session Note
        </Link>
        <span>/</span>
        <span>Data Points</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          title="Data Points"
          description="Trial-by-trial data collected during this therapy session."
        />
        <Button asChild className="shrink-0">
          <Link
            href={`/patients/${patientId}/session-notes/${noteId}/data-points/new`}
          >
            <Plus className="size-4 mr-1" />
            Record Data
          </Link>
        </Button>
      </div>

      {fetchError ? (

        <InfoNotice

          variant="error"

          message={

            fetchError.message ??

            "Could not load this record. Please refresh and try again."

          }

        />

      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : (data?.dataPoints ?? []).length === 0 ? (
        <SectionCard title="No Data Points">
          <p className="text-sm text-muted-foreground">
            No data has been recorded for this session yet.{" "}
            <Link
              href={`/patients/${patientId}/session-notes/${noteId}/data-points/new`}
              className="text-primary hover:underline"
            >
              Record the first data point.
            </Link>
          </p>
        </SectionCard>
      ) : (
        <div className="space-y-3">
          {(data?.dataPoints ?? []).map((point) => (
            <SectionCard
              key={point.id}
              contentClassName="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm">
                    {point.program?.name ?? "Unknown Program"}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {RECORDING_TYPE_LABELS[point.recordingType] ??
                      point.recordingType}
                  </Badge>
                  {point.response && (
                    <Badge
                      variant={
                        point.response === "correct"
                          ? "default"
                          : point.response === "incorrect"
                            ? "destructive"
                            : "outline"
                      }
                      className="text-xs capitalize"
                    >
                      {RESPONSE_LABELS[point.response] ?? point.response}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {point.value !== null && (
                    <span>
                      Value:{" "}
                      <span className="text-foreground font-medium">
                        {point.value}
                      </span>
                    </span>
                  )}
                  {point.trialNumber !== null && (
                    <span>Trial #{point.trialNumber}</span>
                  )}
                  <span>
                    Recorded:{" "}
                    {formatDate(point.recordedAt, { mode: "datetime" })}
                  </span>
                </div>
                {point.notes && (
                  <p className="text-xs text-muted-foreground">{point.notes}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/patients/${patientId}/session-notes/${noteId}/data-points/${point.id}/edit`}
                  >
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(point.id)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataPointsPage;
