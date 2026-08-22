"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import type { UserRole } from "@workspace/contracts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import PatientClinicalTabs from "@workspace/ui/shared/PatientClinicalTabs";

import { usePatient } from "@/hooks/patient";
import { useRolePrefix } from "@/hooks/use-role-prefix";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const roleFromPrefix: Record<"/admin" | "/staff", UserRole> = {
  "/admin": "admin",
  "/staff": "staff",
};

interface PatientDetailLayoutShellProps {
  children: ReactNode;
  patientId: string;
}

const PatientDetailLayoutShell = ({
  children,
  patientId,
}: PatientDetailLayoutShellProps) => {
  const pathname = usePathname();
  const rolePrefix = useRolePrefix();
  const role = roleFromPrefix[rolePrefix];
  const { data, isLoading, fetchError } = usePatient(patientId);

  const initials = `${data?.user?.firstName?.[0] ?? "P"}${data?.user?.lastName?.[0] ?? "T"}`;
  const isEditPage = pathname.endsWith("/edit");

  return (
    <section className="space-y-6">
      <div className="mb-8 flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <Button
              variant="ghost"
              href="/patients"
              className="w-fit px-3 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
            <div className="space-y-1.5">
              <h1 className="text-3xl font-semibold tracking-tight">
                Patient Details
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Switch between profile and psychiatric clinical sections while
                keeping the patient context pinned at the top.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2 xl:justify-end">
            <Button asChild variant="outline">
              <Link href={`/appointments/new?patientId=${patientId}`}>
                Book Appointment
              </Link>
            </Button>
            {!isEditPage && (
              <Button asChild>
                <Link href={`/patients/${patientId}/edit`}>Edit Profile</Link>
              </Button>
            )}
          </div>
        </div>

        <Card className="overflow-hidden bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-sm">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex items-start gap-4">
                  <Skeleton className="size-20 rounded-full" />
                  <div className="space-y-3">
                    <Skeleton className="h-7 w-52" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="size-20 border border-border/60">
                    <AvatarImage
                      src={data?.user?.avatar?.url ?? undefined}
                      alt={data?.user?.displayName}
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-3">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {data?.user?.displayName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {data?.user?.email ??
                          data?.user?.phone ??
                          "Contact details pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* A failed patient fetch leaves the header blank rather than empty-looking,
            so say so instead of rendering a nameless card. */}
        {fetchError && (
          <InfoNotice
            variant="error"
            message={
              fetchError.message ??
              "Could not load this patient. Please refresh and try again."
            }
          />
        )}

        <PatientClinicalTabs patientId={patientId} role={role} />
      </div>

      {children}
    </section>
  );
};

export default PatientDetailLayoutShell;
