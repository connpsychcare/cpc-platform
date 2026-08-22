"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { formatDate } from "@workspace/shared/utils";
import { useSessionNotes } from "@/hooks/session-note";
import type { SessionNoteResponse } from "@workspace/contracts/session-note";
import ClinicalPatientSwitcher from "@/components/shared/ClinicalPatientSwitcher";

export default function PatientSessionNotesPage() {
  const { data, isLoading } = useSessionNotes({ limit: 50 });
  const notes = data?.sessionNotes ?? [];

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">Session Notes</h1>
        <p className="text-sm text-muted-foreground">
          Therapy session records from your treatment team.
        </p>
      </div>

      <ClinicalPatientSwitcher section="session-notes" />

      <SectionCard title="All Sessions" contentClassName="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-2xl border p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}

        {!isLoading && !notes.length && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-center">
            <FileText className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No session notes yet</p>
            <p className="text-xs text-muted-foreground">
              Session records will appear here after your therapy sessions.
            </p>
          </div>
        )}

        {notes.map((note: SessionNoteResponse) => (
          <Link
            key={note.id}
            href={`/patient/care/session-notes/${note.id}`}
            className="block rounded-2xl border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1">
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
                <p className="text-sm text-muted-foreground line-clamp-2">{note.summary}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Therapist: {note.therapist?.displayName ?? "-"}
              </p>
            </div>
          </Link>
        ))}
      </SectionCard>
    </div>
  );
}
