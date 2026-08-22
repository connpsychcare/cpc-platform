"use client";

import { CalendarDays, CalendarPlus, Clock, Phone } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import StatCard from "@workspace/ui/shared/StatCard";
import { cn } from "@workspace/ui/lib/utils";
import { useAppointments } from "@/hooks/healthcare";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import Link from "next/link";
import { formatDate } from "@workspace/shared/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  booked: {
    label: "Booked",
    className: "border-info/25 bg-info/10 text-info",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-success/25 bg-success/10 text-success",
  },
  completed: {
    label: "Completed",
    className: "border-border bg-muted/40 text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
  noShow: {
    label: "No Show",
    className: "border-warning/30 bg-warning/10 text-warning",
  },
};

export default function AppointmentsPage() {
  const { data, isLoading } = useAppointments({});
  const { currentUser } = useCurrentUser();

  const appointments = data?.appointments ?? [];
  const upcoming = appointments.filter((a) =>
    ["booked", "confirmed"].includes(a.status),
  );
  const completed = appointments.filter((a) => a.status === "completed");
  const cancelled = appointments.filter((a) =>
    ["cancelled", "noShow"].includes(a.status),
  );

  return (
    <div className="container mx-auto space-y-6 p-6">
      {!currentUser?.phone && (
        <div className="flex items-center justify-between gap-4 panel-warning px-4 py-3 text-sm">
          <span className="flex items-center gap-2">
            <Phone className="size-4 shrink-0" />
            A phone number is required to book appointments.
          </span>
          <Button href="/complete-profile" variant="outline" size="sm" className="shrink-0">
            Complete Profile
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Upcoming"
          value={upcoming.length}
          className="border-primary/20 bg-linear-to-br from-primary/10 to-card"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          className="border-success/25 bg-linear-to-br from-success/15 to-card"
        />
        <StatCard
          label="Cancelled"
          value={cancelled.length}
          className="border-destructive/25 bg-linear-to-br from-destructive/15 to-card"
        />
      </div>

      {/* List */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            My Appointments
          </span>
        }
        description="View all your scheduled, completed, and past appointments."
        action={
          <Button href="/booking#book">
            <CalendarPlus className="size-4" />
            Book Appointment
          </Button>
        }
        contentClassName="space-y-3"
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-2xl border p-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}

        {!isLoading && !appointments.length && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center">
            <CalendarDays className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No appointments yet</p>
              <p className="text-sm text-muted-foreground">
                Book your first appointment to get started.
              </p>
            </div>
            <Button variant="outline" href="/booking#book">
              Book Now
            </Button>
          </div>
        )}

        {appointments.map((appt) => {
          const status = statusConfig[appt.status] ?? statusConfig.booked;
          return (
            <Link
              key={appt.id}
              href={`/patient/appointments/${appt.id}`}
              className="block"
            >
              <div className="rounded-2xl border p-4 transition-colors hover:bg-secondary/50">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                      <Badge variant="outline" className="capitalize text-xs">
                        {appt.channel}
                      </Badge>
                    </div>
                    <p className="font-medium">
                      {(appt as any).provider?.user?.displayName}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        {formatDate(appt.scheduledStartAt, {
                          mode: "date",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {formatDate(appt.scheduledStartAt, { mode: "time" })}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </SectionCard>
    </div>
  );
}
