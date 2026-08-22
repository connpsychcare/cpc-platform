"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, UserMinus } from "lucide-react";
import { toast } from "sonner";

import { formatDate } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useStaffCaseload, useUnassignPatient } from "@/hooks/staff-assignment";
import { useConfirm } from "@workspace/ui/hooks/use-confirm";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const AdminStaffCaseloadPage = ({
  params,
}: PageProps<"/admin/staff/[id]/caseload">) => {
  const { id: staffId } = React.use(params);
  const { confirm } = useConfirm();
  const { data, isLoading, fetchError } = useStaffCaseload(staffId);
  const { unassignAsync, isPending: isUnassigning } = useUnassignPatient();

  const handleUnassign = async (assignmentId: string, patientName: string) => {
    const ok = await confirm({
      title: `Unassign ${patientName}?`,
      description:
        "This patient will no longer be assigned to this staff member.",
    });

    if (!ok) return;

    try {
      await unassignAsync({ id: assignmentId });
      toast.success(`${patientName} unassigned.`);
    } catch (err: any) {
      toast.error("Failed to unassign.", { description: err?.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/admin/staff/${staffId}`}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Staff Profile
        </Link>
        <span>/</span>
        <span>Caseload</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          title="Caseload"
          description={`${data?.total ?? 0} active patient${(data?.total ?? 0) !== 1 ? "s" : ""} assigned to this staff member.`}
        />
        <Button asChild className="shrink-0">
          <Link href={`/admin/staff/${staffId}/caseload/assign`}>
            <Plus className="size-4 mr-1" />
            Assign Patient
          </Link>
        </Button>
      </div>

      {fetchError ? (
        <InfoNotice
          variant="error"
          message={
            fetchError.message ??
            "Could not load these records. Please refresh and try again."
          }
        />
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : (data?.assignments ?? []).length === 0 ? (
        <SectionCard title="No Patients Assigned">
          <p className="text-sm text-muted-foreground">
            This staff member has no active patient assignments.{" "}
            <Link
              href={`/admin/staff/${staffId}/caseload/assign`}
              className="text-primary hover:underline"
            >
              Assign a patient.
            </Link>
          </p>
        </SectionCard>
      ) : (
        <div className="space-y-3">
          {(data?.assignments ?? []).map((a) => (
            <SectionCard
              key={a.id}
              contentClassName="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/patients/${a.patientId}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {a.patient?.user.displayName}
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {a.patient?.user.email ?? "No email"} &bull; Assigned{" "}
                  {formatDate(a.assignedAt, { mode: "date" })}
                  {a.assignedBy && ` by ${a.assignedBy.displayName}`}
                </p>
                {a.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    {a.notes}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => handleUnassign(a.id, a.patient.user.displayName)}
                disabled={isUnassigning}
              >
                <UserMinus className="size-3.5 mr-1" />
                Unassign
              </Button>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStaffCaseloadPage;
