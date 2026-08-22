"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useMyCaregiverPatients } from "@/hooks/caregiver-access";

interface ClinicalPatientSwitcherProps {
  /** "treatment-plans" or "session-notes"; keeps the reader on the same tab when switching. */
  section: "treatment-plans" | "session-notes";
  /** The linked patient being viewed, or undefined on the caregiver's own records. */
  activePatientId?: string;
}

/**
 * Lets a caregiver move between their own clinical records and each dependant's
 * without going back to the overview. Renders nothing when there is no linked
 * patient, so the ordinary single-patient case is unaffected.
 */
export default function ClinicalPatientSwitcher({
  section,
  activePatientId,
}: ClinicalPatientSwitcherProps) {
  const { data } = useMyCaregiverPatients();
  const linked = (data?.caregiverAccesses ?? []).filter(
    (access) => access.isActive && access.patient,
  );

  if (!linked.length) return null;

  const pill = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
    );

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-4 py-3">
      <span className="mr-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="size-3.5" />
        Viewing
      </span>

      <Link href={`/patient/care/${section}`} className={pill(!activePatientId)}>
        My records
      </Link>

      {linked.map((access) => (
        <Link
          key={access.id}
          href={`/patient/care/linked/${access.patientId}/${section}`}
          className={pill(activePatientId === access.patientId)}
        >
          {access.patient?.user?.displayName}
        </Link>
      ))}
    </div>
  );
}
