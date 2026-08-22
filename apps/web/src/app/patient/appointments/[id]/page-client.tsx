"use client";

import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Separator } from "@workspace/ui/components/separator";
import ConversationThread from "@workspace/ui/shared/ConversationThread";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { cn } from "@workspace/ui/lib/utils";

import { useAppointment } from "@/hooks/healthcare";
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

const paymentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Payment Pending",
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  succeeded: {
    label: "Paid",
    className: "border-success/25 bg-success/10 text-success",
  },
  failed: {
    label: "Payment Failed",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
  refunded: {
    label: "Refunded",
    className: "border-border bg-muted/40 text-muted-foreground",
  },
};

export default function AppointmentDetailPage({ id }: { id: string }) {
  const { data: appt, isLoading } = useAppointment(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!appt) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center">
        <CalendarDays className="size-8 text-muted-foreground" />
        <p className="font-medium">Appointment not found</p>
        <Button variant="outline" asChild>
          <Link href="/patient/appointments">Back to Appointments</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[appt.status] ?? statusConfig.booked;
  const paymentStatus = paymentStatusConfig[appt.paymentStatus ?? "pending"];
  const providerName = appt.provider?.user?.displayName;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/patient/appointments">
          <ArrowLeft className="size-4" />
          Back to Appointments
        </Link>
      </Button>

      <div className="space-y-6">
        <div className="space-y-6">
          <SectionCard title="Appointment Details" contentClassName="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  status.className,
                )}
              >
                {status.label}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  paymentStatus?.className,
                )}
              >
                {paymentStatus?.label}
              </span>
              <Badge variant="outline" className="text-xs capitalize">
                {appt.channel}
              </Badge>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Provider
                </p>
                <p className="font-medium">{providerName}</p>
                {appt.provider?.title ? (
                  <p className="text-sm text-muted-foreground">
                    {appt.provider.title}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Date & Time
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  {formatDate(appt.scheduledStartAt, { mode: "date" })}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  {formatDate(appt.scheduledStartAt, { mode: "time" })} -{" "}
                  {formatDate(appt.scheduledEndAt, { mode: "time" })}
                </p>
              </div>
            </div>

            {appt.patientNotes ? (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Your Notes
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {appt.patientNotes}
                  </p>
                </div>
              </>
            ) : null}

            {appt.providerNotes ? (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Provider Notes
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {appt.providerNotes}
                  </p>
                </div>
              </>
            ) : null}
          </SectionCard>
        </div>

        <ConversationThread
          appointmentId={id}
          title={<span className="flex items-center gap-2">Messages</span>}
          description="Chat with your therapist about this appointment."
          placeholder="Type a message..."
        />
      </div>
    </div>

  );
}
