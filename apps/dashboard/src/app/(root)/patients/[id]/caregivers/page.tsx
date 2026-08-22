"use client";

import React from "react";
import Link from "next/link";
import { Plus, Users, ShieldOff } from "lucide-react";

import { formatDate } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import SectionCard from "@workspace/ui/shared/SectionCard";
import PageIntro from "@workspace/ui/shared/PageIntro";
import QueryState from "@workspace/ui/shared/QueryState";
import {
  useCaregiverAccesses,
  useRevokeCaregiverAccess,
  useDeleteCaregiverAccess,
} from "@/hooks/caregiver-access";
import { toast } from "sonner";

const PatientCaregiversPage = ({ params }: PageProps<"/patients/[id]/caregivers">) => {
  const { id } = React.use(params);
  const { data, isLoading, fetchError } = useCaregiverAccesses({
    patientId: id,
    limit: 50,
  });
  const { revokeAsync, isPending: revoking } = useRevokeCaregiverAccess();
  const { deleteAsync, isPending: deleting } = useDeleteCaregiverAccess();

  const caregiverAccesses = data?.caregiverAccesses ?? [];

  const handleRevoke = async (accessId: string) => {
    try {
      await revokeAsync({ id: accessId });
      toast.success("Caregiver access revoked.");
    } catch {
      toast.error("Failed to revoke access.");
    }
  };

  const handleDelete = async (accessId: string) => {
    try {
      await deleteAsync(accessId);
      toast.success("Caregiver access record deleted.");
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          title="Caregiver Access"
          description="Manage which users have read-only access to this patient's clinical records."
        />
        <Button asChild className="shrink-0">
          <Link href={`/patients/${id}/caregivers/new`}>
            <Plus className="size-4 mr-1" />
            Grant Access
          </Link>
        </Button>
      </div>

      <QueryState
        isLoading={isLoading}
        error={fetchError}
        isEmpty={caregiverAccesses.length === 0}
        empty={
          <SectionCard title="No Caregivers">
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
              <Users className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">No caregiver access granted</p>
              <p className="text-xs text-muted-foreground">
                Grant access to a patient-role user to allow read-only view of
                this patient's clinical data.
              </p>
            </div>
          </SectionCard>
        }
      >
        <div className="space-y-3">
          {caregiverAccesses.map((access) => (
            <SectionCard key={access.id} contentClassName="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-sm">
                      {access.caregiver?.displayName ?? "Unknown user"}
                    </p>
                    <Badge
                      variant={access.isActive ? "default" : "secondary"}
                      className="capitalize text-xs"
                    >
                      {access.isActive ? "Active" : "Revoked"}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs">
                      {access.relationship}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {access.caregiver?.email ?? "No email"} &bull; Granted{" "}
                    {formatDate(access.grantedAt, { mode: "datetime" })}
                    {access.revokedAt && (
                      <>
                        {" "}
                        &bull; Revoked{" "}
                        {formatDate(access.revokedAt, { mode: "datetime" })}
                      </>
                    )}
                  </p>
                  {access.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      {access.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  {access.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={revoking}
                      onClick={() => handleRevoke(access.id)}
                    >
                      <ShieldOff className="size-3.5 mr-1" />
                      Revoke
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleting}
                    onClick={() => handleDelete(access.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </QueryState>
    </div>
  );
};

export default PatientCaregiversPage;
