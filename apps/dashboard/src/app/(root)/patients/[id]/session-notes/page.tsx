"use client";

import React from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

import { formatDate } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useSessionNotes } from "@/hooks/session-note";
import type { SessionNoteResponse } from "@workspace/contracts/session-note";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const PatientSessionNotesPage = ({ params }: PageProps<"/patients/[id]/session-notes">) => {
  const { id } = React.use(params);
  const { data, isLoading, fetchError } = useSessionNotes({ patientId: id, limit: 50 });
  const notes = data?.sessionNotes ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          title="Session Notes"
          description="Structured therapy session records for this patient."
        />
        <Button asChild className="shrink-0">
          <Link href={`/patients/${id}/session-notes/new`}>
            <Plus className="size-4 mr-1" />
            Add Note
          </Link>
        </Button>
      </div>

      <SectionCard title="All Sessions" contentClassName="space-y-3">
        {fetchError && (
          <InfoNotice
            variant="error"
            message={
              fetchError.message ??
              "Could not load these records. Please refresh and try again."
            }
          />
        )}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl border p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}

        {!isLoading && !fetchError && !notes.length && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
            <FileText className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No session notes yet</p>
            <p className="text-xs text-muted-foreground">
              Log the first therapy session for this patient.
            </p>
          </div>
        )}

        {notes.map((note: SessionNoteResponse) => (
          <Link
            key={note.id}
            href={`/patients/${id}/session-notes/${note.id}`}
            className="block rounded-xl border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">
                    {formatDate(note.sessionDate, { mode: "date" })}
                  </p>
                  {note.durationMinutes && (
                    <span className="text-xs text-muted-foreground">
                      {note.durationMinutes} min
                    </span>
                  )}
                  {note.treatmentPlan && (
                    <span className="text-xs text-muted-foreground border rounded px-1.5 py-0.5">
                      {note.treatmentPlan.title}
                    </span>
                  )}
                </div>
                {note.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {note.summary}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Therapist: {note.therapist?.displayName ?? "-"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </SectionCard>
    </div>
  );
};

export default PatientSessionNotesPage;
