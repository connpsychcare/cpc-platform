"use client";

import Link from "next/link";
import React from "react";

import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import ConversationThread from "@workspace/ui/shared/ConversationThread";
import SectionCard from "@workspace/ui/shared/SectionCard";

import PageIntro from "@workspace/ui/shared/PageIntro";
import { useAppointment } from "@/hooks/appointment";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

const rolePrefixByRole = {
  admin: "/admin",
  provider: "/provider",
  staff: "/staff",
} as const;

const copyByRole = {
  "/admin": {
    description:
      "Review the appointment context and monitor or participate in the patient conversation.",
  },
  "/provider": {
    description:
      "Review the appointment context and continue the patient conversation from one place.",
  },
  "/staff": {
    description:
      "Review the appointment context and continue the patient conversation from one place.",
  },
} as const;

const MessageThreadPage = ({
  params,
}: PageProps<"/messages/[appointmentId]">) => {
  const { currentUser } = useCurrentUser();
  const { appointmentId } = React.use(params);
  const { data: appointment } = useAppointment(appointmentId);
  const rolePrefix =
    currentUser?.role && currentUser.role in rolePrefixByRole
      ? rolePrefixByRole[currentUser.role as keyof typeof rolePrefixByRole]
      : "/admin";
  const copy = copyByRole[rolePrefix];

  return (
    <div className="space-y-6">
      <PageIntro title="Conversation thread" description={copy.description} />

      {appointment && (
        <SectionCard
          title="Appointment context"
          action={
            <Link
              href={`${rolePrefix}/appointments/${appointment.id}`}
              className="text-sm text-primary hover:underline"
            >
              Open appointment
            </Link>
          }
          className="shadow-sm"
          contentClassName="grid gap-4 text-sm md:grid-cols-3"
        >
          <div>
            <p className="text-muted-foreground">Patient</p>
            <p className="font-medium">
              {appointment.patient?.user?.displayName}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Scheduled</p>
            <p className="font-medium">
              {formatDate(appointment.scheduledStartAt)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge
              variant={getStatusVariant(appointment.status)}
              className="mt-1 capitalize"
            >
              {appointment.status}
            </Badge>
          </div>
        </SectionCard>
      )}

      <ConversationThread appointmentId={appointmentId} />
    </div>
  );
};

export default MessageThreadPage;
