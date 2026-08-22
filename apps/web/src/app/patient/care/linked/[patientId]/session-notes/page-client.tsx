"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Info } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { formatDate } from "@workspace/shared/utils";
import { useSessionNotes } from "@/hooks/session-note";
import { useMyCaregiverPatients } from "@/hooks/caregiver-access";

import type { SessionNoteResponse } from "@workspace/contracts/session-note";
import ClinicalPatientSwitcher from "@/components/shared/ClinicalPatientSwitcher";

export default function LinkedPatientSessionNotesPage({ patientId }: { patientId: string }) {
  const { data: caregiverData } = useMyCaregiverPatients();
  const { data, isLoading } = useSessionNotes({ patientId, limit: 50 });

  const notes = data?.sessionNotes ?? [];
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
        <span>Session Notes</span>
      </div>

      {/* Read-only access banner */}
      <div className="flex items-start gap-2.5 panel-info p-3 text-sm">
        <Info className="size-4 mt-0.5 shrink-0" />
        <span>
          Viewing clinical records for <strong>{patientName}</strong> - read-only access.
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">Session Notes</h1>
        <p className="text-sm text-muted-foreground">
          Therapy session records for {patientName}.
        </p>
      </div>

      <ClinicalPatientSwitcher section="session-notes" activePatientId={patientId} />

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
          </div>
        )}

        {notes.map((note: SessionNoteResponse) => (
          <div key={note.id} className="rounded-2xl border p-4 space-y-1">
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
        ))}
      </SectionCard>
    </div>
  );
}
