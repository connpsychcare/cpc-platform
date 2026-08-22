"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { formatDate } from "@workspace/shared/utils";
import { useSessionNote } from "@/hooks/session-note";

export default function PatientSessionNoteDetailPage({ noteId }: { noteId: string }) {
  const { data: note, isLoading } = useSessionNote(noteId);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/patient/care/session-notes"
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Session Notes
        </Link>
        <span>/</span>
        <span>{note ? formatDate(note.sessionDate, { mode: "date" }) : "Session"}</span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : note ? (
        <>
          <div className="space-y-1">
            <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">
              Session - {formatDate(note.sessionDate, { mode: "date" })}
            </h1>
            <p className="text-sm text-muted-foreground">
              {note.durationMinutes ? `${note.durationMinutes} minutes` : "Duration not recorded"}
              {note.therapist?.displayName ? ` · ${note.therapist.displayName}` : ""}
              {note.treatmentPlan ? ` · ${note.treatmentPlan.title}` : ""}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            {note.summary && (
              <SectionCard title="Session Summary">
                <p className="text-sm whitespace-pre-wrap">{note.summary}</p>
              </SectionCard>
            )}

            {note.clientBehavior && (
              <SectionCard title="Behavioral Observations">
                <p className="text-sm whitespace-pre-wrap">{note.clientBehavior}</p>
              </SectionCard>
            )}

            {note.nextSteps && (
              <SectionCard title="Next Steps">
                <p className="text-sm whitespace-pre-wrap">{note.nextSteps}</p>
              </SectionCard>
            )}

            {!note.summary && !note.clientBehavior && !note.nextSteps && (
              <SectionCard title="Note">
                <p className="text-sm text-muted-foreground">No details recorded for this session.</p>
              </SectionCard>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Session note not found.</p>
      )}
    </div>
  );
}
