"use client";

import { useState } from "react";
import type { AppointmentResponse } from "@workspace/contracts/appointment";
import { cn } from "@workspace/ui/lib/utils";
import { formatDate } from "@workspace/shared/utils";
import {
  clinicalFormSeverity,
  type ClinicalSeverity,
} from "@workspace/shared/constants";

import { useClinicalForms } from "@/hooks/clinical-forms";
import { useTreatmentPlans } from "@/hooks/treatment-plan";

// ── Score helpers ─────────────────────────────────────────────

// Bands come from the shared clinical-form module so this panel cannot drift
// from the screening-results and patient-overview surfaces.
type ScoreLevel = ClinicalSeverity;

/**
 * PHQ-9 alone distinguishes moderately severe from severe. The shared bands
 * collapse both to "severe" for colouring, so the extra label is applied here
 * rather than widening the shared severity scale for one instrument.
 */
function phq9Label(score: number) {
  if (score <= 4) return "Minimal";
  if (score <= 9) return "Mild";
  if (score <= 14) return "Moderate";
  if (score <= 19) return "Mod-Severe";
  return "Severe";
}

const SEVERITY_LABELS: Record<ScoreLevel, string> = {
  none: "Minimal",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

const LEVEL_COLORS: Record<ScoreLevel, string> = {
  none: "text-success bg-success/10 border-success/25",
  mild: "text-warning bg-warning/10 border-warning/25",
  moderate: "text-warning bg-warning/10 border-warning/25",
  severe: "text-destructive bg-destructive/10 border-destructive/25",
};

// ── Sub-components ────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-2">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function ScorePill({
  label,
  score,
  level,
  display,
  date,
}: {
  label: string;
  score: number;
  level: ScoreLevel;
  display: string;
  date?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 space-y-0.5",
        LEVEL_COLORS[level],
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold">{label}</span>
        <span className="text-sm font-bold tabular-nums">{score}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] opacity-80">{display}</span>
        {date && (
          <span className="text-[10px] opacity-60">
            {formatDate(date, { mode: "date" })}
          </span>
        )}
      </div>
    </div>
  );
}

function AlertFlag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      <span className="shrink-0 font-semibold">⚠</span>
      <span>{children}</span>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-1.5 px-4 py-3">
      {[80, 60, 70].map((w) => (
        <div
          key={w}
          className="h-3 animate-pulse rounded bg-muted"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface PatientBriefingPanelProps {
  appointment: AppointmentResponse;
  className?: string;
}

export function PatientBriefingPanel({
  appointment,
  className,
}: PatientBriefingPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const patient = appointment.patient;
  const user = patient?.user;

  const patientId = patient?.id;

  // ── Fetch clinical forms (latest 20, descending) ──────────
  const { data: formsData, isLoading: formsLoading } = useClinicalForms(
    patientId ? { patientId, limit: 20, sortOrder: "desc" } : {},
  );

  // ── Fetch active treatment plan ───────────────────────────
  const { data: plansData } = useTreatmentPlans(
    patientId ? { patientId } : undefined,
  );

  if (!patient || !user) return null;

  // ── Derive age from DOB ───────────────────────────────────
  const dob = patient.birthDate ? new Date(patient.birthDate) : null;
  const age = dob
    ? Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  // ── Map latest clinical form of each type ─────────────────
  const forms = formsData?.forms ?? [];

  const latestPhq9 = forms.find((f) => f.formType === "phq9");
  const latestGad7 = forms.find((f) => f.formType === "gad7");
  const latestAsrs = forms.find((f) => f.formType === "asrsAdult");
  const latestVanderbiltParent = forms.find(
    (f) => f.formType === "vanderbiltParent",
  );

  const hasScreenings =
    latestPhq9 || latestGad7 || latestAsrs || latestVanderbiltParent;

  // ── Active treatment plan ─────────────────────────────────
  const activePlan =
    plansData?.treatmentPlans?.find(
      (p: any) => p.status === "active" || p.status === "inProgress",
    ) ?? plansData?.treatmentPlans?.[0];

  // ── Red flag detection ────────────────────────────────────
  const flags: string[] = [];
  if (
    latestPhq9?.totalScore != null &&
    clinicalFormSeverity("phq9", latestPhq9.totalScore) === "severe"
  ) {
    flags.push(
      `PHQ-9 score ${latestPhq9.totalScore} - severe depression range`,
    );
  }
  if (
    latestGad7?.totalScore != null &&
    clinicalFormSeverity("gad7", latestGad7.totalScore) === "severe"
  ) {
    flags.push(`GAD-7 score ${latestGad7.totalScore} - severe anxiety range`);
  }

  const hasInsurance = patient.insuranceProvider;
  const hasAllergies =
    patient.allergies &&
    patient.allergies !== "None" &&
    patient.allergies !== "None known";
  const hasMeds =
    patient.currentMedication && patient.currentMedication !== "None";

  const onboardingDone = Boolean((user as any).onboardingCompletedAt);

  return (
    <aside
      className={cn(
        "rounded-xl border border-border bg-sidebar text-sidebar-foreground",
        "flex flex-col divide-y divide-border/50 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/60">
            Pre-Appointment Brief
          </p>
          <p className="text-sm font-semibold text-sidebar-foreground mt-0.5">
            {user.displayName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-md px-2 py-1 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          aria-label={expanded ? "Collapse panel" : "Expand panel"}
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {expanded && (
        <div className="divide-y divide-border/50">
          {/* Clinical Flags */}
          {flags.length > 0 && (
            <div className="px-4 py-3 space-y-2">
              <SectionTitle>Clinical Flags</SectionTitle>
              {flags.map((flag, i) => (
                <AlertFlag key={i}>{flag}</AlertFlag>
              ))}
            </div>
          )}

          {/* Onboarding Status */}
          <div className="px-4 py-3 space-y-1.5">
            <SectionTitle>Patient</SectionTitle>
            <InfoRow
              label="DOB"
              value={
                dob
                  ? `${formatDate(patient.birthDate, { mode: "date" })} (${age}y)`
                  : undefined
              }
            />
            <InfoRow label="Gender" value={patient.gender ?? undefined} />
            <InfoRow label="Phone" value={user.phone ?? undefined} />
            <InfoRow label="Email" value={user.email ?? undefined} />
            <InfoRow label="Address" value={patient.address ?? undefined} />
            <InfoRow
              label="Emergency"
              value={
                patient.emergencyContactName
                  ? `${patient.emergencyContactName} - ${patient.emergencyContactNumber ?? "no phone"}`
                  : undefined
              }
            />
            <div className="flex justify-between gap-2 text-xs pt-0.5">
              <span className="text-muted-foreground shrink-0">Onboarding</span>
              <span
                className={cn(
                  "font-medium",
                  onboardingDone ? "text-success" : "text-warning",
                )}
              >
                {onboardingDone ? "Complete" : "Pending"}
              </span>
            </div>
          </div>

          {/* Insurance */}
          <div className="px-4 py-3 space-y-1.5">
            <SectionTitle>Insurance</SectionTitle>
            {hasInsurance ? (
              <>
                <InfoRow
                  label="Provider"
                  value={patient.insuranceProvider ?? undefined}
                />
                <InfoRow
                  label="Member ID"
                  value={
                    patient.insuranceMemberId ??
                    patient.insurancePolicyNumber ??
                    undefined
                  }
                />
                <InfoRow
                  label="Group #"
                  value={patient.insuranceGroupNumber ?? undefined}
                />
                <InfoRow
                  label="Auth #"
                  value={patient.insuranceAuthNumber ?? undefined}
                />
                <InfoRow
                  label="Copay / Ded."
                  value={
                    patient.insuranceCopay != null
                      ? `$${patient.insuranceCopay} / $${patient.insuranceDeductible ?? "?"}`
                      : undefined
                  }
                />
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No insurance on file
              </p>
            )}
          </div>

          {/* Medical Snapshot */}
          <div className="px-4 py-3 space-y-2">
            <SectionTitle>Medical Snapshot</SectionTitle>
            {hasAllergies ? (
              <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase text-warning">
                  Allergies
                </p>
                <p className="text-xs text-foreground mt-0.5">
                  {patient.allergies}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No known allergies
              </p>
            )}
            {hasMeds && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Current Medications
                </p>
                <p className="text-xs text-foreground whitespace-pre-line">
                  {patient.currentMedication}
                </p>
              </div>
            )}
            {patient.pastMedicalHistory && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Past Medical History
                </p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {patient.pastMedicalHistory}
                </p>
              </div>
            )}
          </div>

          {/* Active Treatment Plan */}
          <div className="px-4 py-3 space-y-1.5">
            <SectionTitle>Treatment Plan</SectionTitle>
            {activePlan ? (
              <>
                <p className="text-xs font-medium text-foreground line-clamp-1">
                  {activePlan.title ?? "Active Plan"}
                </p>
                {activePlan.goals && (
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {activePlan.goals}
                  </p>
                )}
                {activePlan.startDate && (
                  <InfoRow
                    label="Started"
                    value={formatDate(activePlan.startDate, { mode: "date" })}
                  />
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No active treatment plan
              </p>
            )}
          </div>

          {/* Screening Scores */}
          <div className="px-4 py-3 space-y-2">
            <SectionTitle>Screening Scores</SectionTitle>
            {formsLoading ? (
              <LoadingRows />
            ) : hasScreenings ? (
              <div className="space-y-2">
                {latestPhq9?.totalScore != null && (
                  <ScorePill
                    label="PHQ-9"
                    score={latestPhq9.totalScore}
                    level={clinicalFormSeverity("phq9", latestPhq9.totalScore)}
                    display={phq9Label(latestPhq9.totalScore)}
                    date={latestPhq9.completedAt}
                  />
                )}
                {latestGad7?.totalScore != null && (
                  <ScorePill
                    label="GAD-7"
                    score={latestGad7.totalScore}
                    level={clinicalFormSeverity("gad7", latestGad7.totalScore)}
                    display={
                      SEVERITY_LABELS[
                        clinicalFormSeverity("gad7", latestGad7.totalScore)
                      ]
                    }
                    date={latestGad7.completedAt}
                  />
                )}
                {latestAsrs && (
                  <div
                    className={cn(
                      "rounded-lg border px-3 py-2 space-y-0.5",
                      latestAsrs.interpretation
                        ?.toLowerCase()
                        .includes("positive")
                        ? "text-warning bg-warning/10 border-warning/25"
                        : "text-success bg-success/10 border-success/25",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold">ASRS</span>
                      {latestAsrs.totalScore != null && (
                        <span className="text-sm font-bold">
                          {latestAsrs.totalScore}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] opacity-80 capitalize">
                      {latestAsrs.interpretation ?? "-"}
                    </p>
                  </div>
                )}
                {latestVanderbiltParent && (
                  <div className="rounded-lg border border-info/25 bg-info/10 px-3 py-2 space-y-0.5">
                    <span className="text-[11px] font-semibold text-info">
                      Vanderbilt (Parent)
                    </span>
                    {latestVanderbiltParent.totalScore != null && (
                      <p className="text-[10px] text-info opacity-80">
                        Total: {latestVanderbiltParent.totalScore}
                      </p>
                    )}
                    {latestVanderbiltParent.interpretation && (
                      <p className="text-[10px] text-info opacity-70 line-clamp-2">
                        {latestVanderbiltParent.interpretation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No screenings on file
              </p>
            )}
          </div>

          {/* Visit context */}
          <div className="px-4 py-3 space-y-1.5">
            <SectionTitle>This Visit</SectionTitle>
            <InfoRow
              label="Channel"
              value={
                appointment.channel === "virtual"
                  ? "Telehealth (video)"
                  : "In-Person"
              }
            />
            <InfoRow
              label="Start"
              value={formatDate(appointment.scheduledStartAt, {
                mode: "datetime",
              })}
            />
            {appointment.patientNotes && (
              <div className="mt-2 space-y-0.5">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Patient Notes
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment.patientNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
