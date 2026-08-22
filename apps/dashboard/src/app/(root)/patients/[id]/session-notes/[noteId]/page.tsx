"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart2, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatDate } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useSessionNote, useDeleteSessionNote } from "@/hooks/session-note";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const SessionNoteDetailPage = ({
  params,
}: PageProps<"/patients/[id]/session-notes/[noteId]">) => {
  const { id: patientId, noteId } = React.use(params);
  const router = useRouter();
  const { data: note, isLoading, fetchError } = useSessionNote(noteId);
  const { deleteAsync, isDeleting } = useDeleteSessionNote();

  const handleDelete = async () => {
    if (!confirm("Delete this session note? This cannot be undone.")) return;
    try {
      await deleteAsync(noteId);
      toast.success("Session note deleted.");
      router.push(`/patients/${patientId}/session-notes`);
    } catch (err: any) {
      toast.error("Failed to delete.", { description: err?.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/patients/${patientId}/session-notes`}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Session Notes
        </Link>
        <span>/</span>
        <span>
          {note ? formatDate(note.sessionDate, { mode: "date" }) : "Note"}
        </span>
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
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : note ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <PageIntro
              title={formatDate(note.sessionDate, { mode: "date" })}
              description={`Therapy session - ${note.durationMinutes ? `${note.durationMinutes} min` : "Duration not recorded"}`}
            />
            <div className="flex gap-2 shrink-0">
              <Button asChild variant="outline">
                <Link
                  href={`/patients/${patientId}/session-notes/${noteId}/data-points`}
                >
                  <BarChart2 className="size-4 mr-1" />
                  Data Points
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href={`/patients/${patientId}/session-notes/${noteId}/edit`}
                >
                  <SquarePen className="size-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          <SectionCard
            title="Session Details"
            contentClassName="grid gap-4 text-sm md:grid-cols-3"
          >
            <div>
              <p className="text-muted-foreground text-xs mb-1">Session Date</p>
              <p>{formatDate(note.sessionDate, { mode: "date" })}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Duration</p>
              <p>
                {note.durationMinutes ? `${note.durationMinutes} minutes` : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Therapist</p>
              <p>{note.therapist?.displayName ?? "-"}</p>
            </div>
            {note.treatmentPlan && (
              <div className="md:col-span-3">
                <p className="text-muted-foreground text-xs mb-1">
                  Treatment Plan
                </p>
                <Link
                  href={`/patients/${patientId}/treatment-plans/${note.treatmentPlanId}`}
                  className="text-primary hover:underline"
                >
                  {note.treatmentPlan.title}
                </Link>
              </div>
            )}
          </SectionCard>

          {note.summary && (
            <SectionCard title="Session Summary" contentClassName="text-sm">
              <p className="whitespace-pre-wrap">{note.summary}</p>
            </SectionCard>
          )}

          {note.clientBehavior && (
            <SectionCard title="Behavioral Observations" contentClassName="text-sm">
              <p className="whitespace-pre-wrap">{note.clientBehavior}</p>
            </SectionCard>
          )}

          {note.nextSteps && (
            <SectionCard title="Next Steps" contentClassName="text-sm">
              <p className="whitespace-pre-wrap">{note.nextSteps}</p>
            </SectionCard>
          )}
        </>
      ) : null}
    </div>
  );
};

export default SessionNoteDetailPage;
