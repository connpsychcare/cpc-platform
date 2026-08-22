"use client";

import Link from "next/link";
import React from "react";

import type { AppointmentResponse } from "@workspace/contracts/appointment";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import ConversationThread from "@workspace/ui/shared/ConversationThread";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

import AppointmentStatusPanel from "@/components/dashboard/AppointmentStatusPanel";
import { PatientBriefingPanel } from "@/components/dashboard/PatientBriefingPanel";
import {
  type RelatedEntityConfig,
  type SectionConfig,
  GenericDetailsPage,
} from "@workspace/ui/shared/GenericDetailsPage";
import { useAppointment } from "@/hooks/appointment";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import { formatDate, formatPricePrecise } from "@workspace/shared/utils";

const formatDateTime = (value?: string) =>
  formatDate(value, { mode: "datetime", fallback: "Not recorded" });

const formatLabel = (value?: string) =>
  value
    ? value
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase())
    : "Not set";

const renderBadge = (value?: string) => (
  <Badge variant={getStatusVariant(value ?? "")} className="capitalize">
    {formatLabel(value)}
  </Badge>
);

const adminSections: SectionConfig<AppointmentResponse>[] = [
  {
    title: "Booking Summary",
    description: () =>
      "Scheduling, channel, and lifecycle details for this appointment booking.",
    columns: 3,
    fields: [
      {
        label: "Status",
        accessor: "status",
        render: (value) => renderBadge(value),
      },
      {
        label: "Payment Status",
        accessor: "paymentStatus",
        render: (value) => renderBadge(value),
      },
      {
        label: "Channel",
        accessor: "channel",
        render: (value) => renderBadge(value),
      },
      {
        label: "Booking Source",
        accessor: "bookingSource",
        render: (value) => renderBadge(value),
      },
      {
        label: "Scheduled Start",
        accessor: "scheduledStartAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Scheduled End",
        accessor: "scheduledEndAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Timezone",
        accessor: "timezone",
      },
      {
        label: "Booked At",
        accessor: "bookedAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Reminder Sent",
        accessor: "reminderSentAt",
        render: (value) => formatDateTime(value),
      },
    ],
  },
  {
    title: "People and Location",
    description: () =>
      "Linked provider, patient, branch, and conversation status for this visit.",
    columns: 3,
    fields: [
      {
        label: "Patient",
        accessor: (data) => data.patient?.user?.displayName,
      },
      {
        label: "Patient Contact",
        accessor: (data) =>
          data.patient?.user?.email ??
          data.patient?.user?.phone ??
          "No contact",
      },
      {
        label: "Provider",
        accessor: (data) => data.provider?.user?.displayName,
      },
      {
        label: "Branch",
        accessor: (data) => data.branch?.name ?? "Branch",
      },
      {
        label: "Conversation Status",
        accessor: (data) => data.conversation?.status,
        render: (value) => renderBadge(value),
      },
      {
        label: "Last Message",
        accessor: (data) => formatDateTime(data.conversation?.lastMessageAt),
      },
    ],
  },
  {
    title: "Clinical Notes and Follow-up",
    columns: 2,
    fields: [
      {
        label: "Patient Notes",
        accessor: "patientNotes",
      },
      {
        label: "Provider Notes",
        accessor: "providerNotes",
      },
      {
        label: "Admin Notes",
        accessor: "adminNotes",
      },
      {
        label: "Cancellation Reason",
        accessor: "cancellationReason",
      },
    ],
  },
  {
    title: "Timeline",
    columns: 2,
    fields: [
      {
        label: "Confirmed At",
        accessor: "confirmedAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Cancelled At",
        accessor: "cancelledAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Completed At",
        accessor: "completedAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Paid At",
        accessor: "paidAt",
        render: (value) => formatDateTime(value),
      },
    ],
  },
];

const careTeamSections: SectionConfig<AppointmentResponse>[] = [
  {
    title: "Visit Overview",
    description: () =>
      "The live booking state, timing window, and care channel for this appointment.",
    columns: 3,
    fields: [
      {
        label: "Status",
        accessor: "status",
        render: (value) => renderBadge(value),
      },
      {
        label: "Payment Status",
        accessor: "paymentStatus",
        render: (value) => renderBadge(value),
      },
      {
        label: "Channel",
        accessor: "channel",
        render: (value) => renderBadge(value),
      },
      {
        label: "Scheduled Start",
        accessor: "scheduledStartAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Scheduled End",
        accessor: "scheduledEndAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Timezone",
        accessor: "timezone",
      },
      {
        label: "Booked At",
        accessor: "bookedAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Confirmed At",
        accessor: "confirmedAt",
        render: (value) => formatDateTime(value),
      },
      {
        label: "Completed At",
        accessor: "completedAt",
        render: (value) => formatDateTime(value),
      },
    ],
  },
  {
    title: "Patient and Branch Context",
    description: () =>
      "The patient record, branch location, and conversation status connected to this visit.",
    columns: 3,
    fields: [
      {
        label: "Patient",
        accessor: (data) => data.patient?.user?.displayName,
      },
      {
        label: "Patient Contact",
        accessor: (data) =>
          data.patient?.user?.email ??
          data.patient?.user?.phone ??
          "No contact",
      },
      {
        label: "Branch",
        accessor: (data) => data.branch?.name ?? "Branch",
      },
      {
        label: "Conversation",
        accessor: (data) => data.conversation?.status,
        render: (value) => renderBadge(value),
      },
      {
        label: "Last Message",
        accessor: (data) => formatDateTime(data.conversation?.lastMessageAt),
      },
      {
        label: "Cancellation Reason",
        accessor: "cancellationReason",
      },
    ],
  },
  {
    title: "Clinical Notes",
    columns: 2,
    fields: [
      {
        label: "Patient Notes",
        accessor: "patientNotes",
      },
      {
        label: "Provider Notes",
        accessor: "providerNotes",
      },
      {
        label: "Admin Notes",
        accessor: "adminNotes",
      },
    ],
  },
];

const adminRelatedEntities: RelatedEntityConfig<AppointmentResponse>[] = [
  {
    title: "Payments",
    dataKey: "payments",
    columns: [
      {
        header: "Amount",
        accessor: (item) => formatPricePrecise(item.amount),
      },
      {
        header: "Provider",
        accessor: (item) => formatLabel(item.provider),
      },
      {
        header: "Method",
        accessor: (item) => formatLabel(item.methodType),
      },
      {
        header: "Status",
        accessor: (item) => formatLabel(item.status),
      },
      {
        header: "Created",
        accessor: (item) => formatDateTime(item.createdAt),
      },
    ],
    viewPath: (item) => `/admin/payments/${item.id}`,
  },
];

const renderAdminHeader = (data: AppointmentResponse) => (
  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {renderBadge(data.status)}
        {renderBadge(data.paymentStatus)}
        {renderBadge(data.channel)}
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {data.appointmentNumber}
        </h2>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(data.scheduledStartAt)}
          {data.branch?.name ? ` • ${data.branch.name}` : ""}
        </p>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:min-w-90">
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Patient
        </p>
        <p className="mt-2 text-sm font-medium">
          {data.patient?.user?.displayName}
        </p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Provider
        </p>
        <p className="mt-2 text-sm font-medium">
          {data.provider?.user?.displayName}
        </p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Conversation
        </p>
        <p className="mt-2 text-sm font-medium">
          {data.conversation
            ? formatLabel(data.conversation.status)
            : "Not started"}
        </p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Total Payments
        </p>
        <p className="mt-2 text-sm font-medium">
          {data.payments?.length ?? 0} recorded
        </p>
      </div>
    </div>
  </div>
);

const renderCareTeamHeader = (data: AppointmentResponse) => (
  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {renderBadge(data.status)}
        {renderBadge(data.channel)}
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {data.appointmentNumber}
        </h2>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(data.scheduledStartAt)}
          {data.branch?.name ? ` • ${data.branch.name}` : ""}
        </p>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:min-w-90">
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Patient
        </p>
        <p className="mt-2 text-sm font-medium">
          {data.patient?.user?.displayName}
        </p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Conversation
        </p>
        <p className="mt-2 text-sm font-medium">
          {data.conversation
            ? formatLabel(data.conversation.status)
            : "Not started"}
        </p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4 sm:col-span-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Patient Notes Snapshot
        </p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {data.patientNotes ??
            "No patient notes were added for this appointment."}
        </p>
      </div>
    </div>
  </div>
);

const Page = ({ params }: PageProps<"/appointments/[id]">) => {
  const { id } = React.use(params);
  const { currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  return (
    <GenericDetailsPage
      entityId={id}
      entityName="Appointment"
      description="Manage the appointment lifecycle, review patient notes, and continue the related thread without leaving the record."
      useQuery={useAppointment}
      sections={isAdmin ? adminSections : careTeamSections}
      relatedEntities={isAdmin ? adminRelatedEntities : undefined}
      renderHeader={isAdmin ? renderAdminHeader : renderCareTeamHeader}
      renderActions={(data) => (
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/messages/${data.id}`}>Open Thread</Link>
          </Button>
          <AppointmentStatusPanel appointment={data} variant="toolbar" />
        </div>
      )}
      canEdit={false}
    >
      {(data) => (
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <ConversationThread appointmentId={data.id} />
          </div>
          <PatientBriefingPanel
            appointment={data}
            className="xl:w-72 xl:shrink-0 xl:sticky xl:top-20"
          />
        </div>
      )}
    </GenericDetailsPage>
  );
};

export default Page;
