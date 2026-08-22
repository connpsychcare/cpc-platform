"use client";

import ListPage from "@workspace/ui/shared/ListPage";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import { useAppointments } from "@/hooks/appointment";
import type {
  AppointmentQueryType,
  AppointmentResponse,
} from "@workspace/contracts/appointment";
import { formatDate } from "@workspace/shared/utils";
import UserAvatar from "@workspace/ui/shared/UserAvatar";
import { Badge } from "@workspace/ui/components/badge";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

const adminColumns: ColumnConfig<AppointmentResponse, AppointmentQueryType>[] =
  [
    {
      header: "Appointment",
      accessor: (appointment) => appointment.appointmentNumber,
      sortKey: "createdAt",
    },
    {
      header: "Provider",
      accessor: (appointment) => (
        <div className="flex items-center gap-4 min-w-50">
          <UserAvatar user={appointment.provider.user} />
          <p className="font-semibold">{appointment.provider.user.displayName}</p>
        </div>
      ),
      wrapperCn: "space-y-4",
    },
    {
      header: "Patient",
      accessor: (appointment) => (
        <div className="flex items-center gap-4 min-w-50">
          <UserAvatar user={appointment.patient.user} />
          <p className="font-semibold">
            {appointment.patient.user.displayName}
          </p>
        </div>
      ),
      wrapperCn: "space-y-4",
    },
    {
      header: "Scheduled",
      accessor: (appointment) => formatDate(appointment.scheduledStartAt),
      sortKey: "scheduledStartAt",
    },
    {
      header: "Status",
      accessor: (appointment) => (
        <Badge variant={getStatusVariant(appointment.status)}>
          {appointment.status}
        </Badge>
      ),
      sortKey: "status",
    },
  ];

const careTeamColumns: ColumnConfig<
  AppointmentResponse,
  AppointmentQueryType
>[] = [
  {
    header: "Patient",
    accessor: (appointment) => (
      <div className="flex items-center gap-4 min-w-50">
        <UserAvatar user={appointment.patient.user} />
        <p className="font-semibold">{appointment.patient.user.displayName}</p>
      </div>
    ),
    wrapperCn: "space-y-4",
  },
  {
    header: "Channel",
    accessor: (appointment) => (
      <Badge variant="info">{appointment.channel}</Badge>
    ),
  },
  {
    header: "Scheduled",
    accessor: (appointment) => formatDate(appointment.scheduledStartAt),
    sortKey: "scheduledStartAt",
  },
  {
    header: "Status",
    accessor: (appointment) => (
      <Badge variant={getStatusVariant(appointment.status)}>
        {appointment.status}
      </Badge>
    ),
    sortKey: "status",
  },
];

export default function AppointmentsPage() {
  const { currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  return (
    <ListPage<AppointmentResponse, AppointmentQueryType, "appointments">
      dataKey="appointments"
      canAdd
      canEdit={false}
      columns={isAdmin ? adminColumns : careTeamColumns}
      defaultSortBy="scheduledStartAt"
      defaultSearchBy={isAdmin ? "appointmentNumber" : "patientName"}
      searchByOptions={
        isAdmin
          ? [
              { label: "Appointment", value: "appointmentNumber" },
              { label: "Provider", value: "providerName" },
              { label: "Patient", value: "patientName" },
              { label: "Status", value: "status" },
            ]
          : [
              { label: "Patient", value: "patientName" },
              { label: "Status", value: "status" },
              { label: "Provider", value: "providerName" },
              { label: "Appointment #", value: "appointmentNumber" },
            ]
      }
      useListHook={useAppointments}
      filterConfig={
        isAdmin
          ? [
              {
                key: "status",
                label: "Status",
                options: [
                  "booked",
                  "confirmed",
                  "cancelled",
                  "completed",
                  "noShow",
                ],
              },
              {
                key: "channel",
                label: "Channel",
                options: [
                  { value: "inPerson", label: "In Person" },
                  { value: "virtual", label: "Virtual" },
                ],
              },
              {
                key: "bookingSource",
                label: "Source",
                options: [
                  { value: "app", label: "App" },
                  { value: "admin", label: "Admin" },
                ],
              },
              {
                key: "paymentStatus",
                label: "Payment",
                options: ["pending", "succeeded", "failed", "refunded"],
              },
            ]
          : [
              {
                key: "status",
                label: "Status",
                options: [
                  "booked",
                  "confirmed",
                  "completed",
                  "cancelled",
                  "noShow",
                ],
              },
              {
                key: "channel",
                label: "Channel",
                options: [
                  { value: "inPerson", label: "In Person" },
                  { value: "virtual", label: "Virtual" },
                ],
              },
              {
                key: "paymentStatus",
                label: "Payment",
                options: ["pending", "succeeded", "failed", "refunded"],
              },
            ]
      }
    />
  );
}
