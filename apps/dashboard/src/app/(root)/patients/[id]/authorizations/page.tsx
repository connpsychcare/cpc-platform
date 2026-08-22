"use client";

import React from "react";
import Link from "next/link";
import { Plus, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { formatDate } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import PageIntro from "@workspace/ui/shared/PageIntro";
import {
  useInsuranceAuthorizations,
  useDeleteInsuranceAuthorization,
} from "@/hooks/insurance-authorization";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const statusVariant = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  if (status === "active") return "default";
  if (status === "exhausted") return "destructive";
  return "secondary";
};

const PatientAuthorizationsPage = ({
  params,
}: PageProps<"/patients/[id]/authorizations">) => {
  const { id } = React.use(params);
  const { data, isLoading, fetchError } = useInsuranceAuthorizations({
    patientId: id,
    limit: 50,
  });
  const { deleteAsync, isDeleting } = useDeleteInsuranceAuthorization();

  const handleDelete = async (authId: string, label: string) => {
    if (!confirm(`Delete authorization "${label}"?`)) return;
    try {
      await deleteAsync(authId);
      toast.success("Authorization deleted.");
    } catch (err: any) {
      toast.error("Failed to delete.", { description: err?.message });
    }
  };

  const authorizations = data?.authorizations ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageIntro
          title="Insurance Authorizations"
          description="Track authorized clinical service hours and monitor usage per authorization period."
        />
        <Button asChild className="shrink-0">
          <Link href={`/patients/${id}/authorizations/new`}>
            <Plus className="size-4 mr-1" />
            Add Authorization
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
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : authorizations.length === 0 ? (
        <SectionCard title="No Authorizations">
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
            <ShieldCheck className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">
              No insurance authorizations yet
            </p>
            <p className="text-xs text-muted-foreground">
              Add an authorization to start tracking approved clinical service hours.
            </p>
          </div>
        </SectionCard>
      ) : (
        <div className="space-y-3">
          {authorizations.map((auth) => {
            const approved = Number(auth.approvedHours);
            const used = Number(auth.usedHours);
            const remaining = Number(auth.remainingHours ?? approved - used);
            const pct =
              approved > 0 ? Math.min((used / approved) * 100, 100) : 0;

            return (
              <SectionCard key={auth.id} contentClassName="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm">
                        {auth.insurancePlan}
                      </p>
                      <Badge
                        variant={statusVariant(auth.status)}
                        className="capitalize text-xs"
                      >
                        {auth.status}
                      </Badge>
                      {auth.nearingLimit && auth.status === "active" && (
                        <Badge
                          variant="outline"
                          className="text-xs border-warning/40 text-warning gap-1"
                        >
                          <AlertTriangle className="size-3" />
                          Nearing limit
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Auth #{auth.authorizationNumber} &bull;{" "}
                      {formatDate(auth.startDate, { mode: "date" })} –{" "}
                      {formatDate(auth.endDate, { mode: "date" })}
                    </p>
                    {auth.treatmentPlan && (
                      <p className="text-xs text-muted-foreground">
                        Linked to:{" "}
                        <Link
                          href={`/patients/${id}/treatment-plans`}
                          className="text-primary hover:underline"
                        >
                          {auth.treatmentPlan.title}
                        </Link>
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/patients/${id}/authorizations/${auth.id}/edit`}
                      >
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() =>
                        handleDelete(auth.id, auth.authorizationNumber)
                      }
                      disabled={isDeleting}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {used.toFixed(2)} / {approved.toFixed(2)} hrs used
                    </span>
                    <span>{remaining.toFixed(2)} remaining</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 100
                          ? "bg-destructive"
                          : pct >= 80
                            ? "bg-warning"
                            : "bg-primary"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {auth.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      {auth.notes}
                    </p>
                  )}
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientAuthorizationsPage;
