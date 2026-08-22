"use client";

import Link from "next/link";
import { ClipboardList, FileText, Users } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import SectionCard from "@workspace/ui/shared/SectionCard";
import {
  caregiverRelationshipLabels,
  isPlaceholderEmail,
} from "@workspace/shared/constants";
import type { CaregiverAccessResponse } from "@workspace/contracts/caregiver-access";

interface LinkedPatientsCardProps {
  /** Active caregiver-access rows for the signed-in user. */
  accesses: CaregiverAccessResponse[];
}

/**
 * The dependants and patients this user can open read-only, shown on both the
 * portal overview and the caregivers page. Shared rather than duplicated so a
 * dependant created on one page appears identically on the other.
 *
 * Renders nothing when there is no linked patient, so callers can drop it in
 * unconditionally.
 */
export default function LinkedPatientsCard({
  accesses,
}: LinkedPatientsCardProps) {
  if (!accesses.length) return null;

  return (
    <SectionCard
      title="Linked Patients"
      description="You have read-only access to clinical records for the following patients."
      contentClassName="space-y-3"
    >
      {accesses.map((access) => {
        const email = access.patient?.user?.email;

        return (
          <div
            key={access.id}
            className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {access.patient?.user?.displayName}
                </p>
                {/* A dependant's address is a generated placeholder for an
                    account that cannot sign in, so show the relationship
                    instead. It is the useful fact, and the placeholder is long
                    enough to push the actions out of the card. */}
                {isPlaceholderEmail(email) ? (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {caregiverRelationshipLabels[access.relationship] ??
                      access.relationship}
                  </Badge>
                ) : (
                  <p className="truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/patient/care/linked/${access.patientId}/treatment-plans`}
                >
                  <ClipboardList className="size-3.5" />
                  Treatment Plans
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/patient/care/linked/${access.patientId}/session-notes`}
                >
                  <FileText className="size-3.5" />
                  Session Notes
                </Link>
              </Button>
            </div>
          </div>
        );
      })}
    </SectionCard>
  );
}
