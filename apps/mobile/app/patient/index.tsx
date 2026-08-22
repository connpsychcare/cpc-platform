import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientCard } from "@/components/shared/gradient-card";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPricePrecise } from "@workspace/shared/utils";
import {
  getAppointmentStatusMeta,
} from "@/lib/patient-status";
import {
  useMyCaregiverPatients,
  usePatientDashboard,
} from "@/hooks/use-healthcare";

const quickLinks = [
  {
    href: "/patient/care/treatment-plans",
    title: "Treatment Plans",
    description: "Open your current treatment plans and care programs.",
    icon: "ClipboardListIcon" as const,
  },
  {
    href: "/patient/care/session-notes",
    title: "Session Notes",
    description: "Review read-only therapy session summaries.",
    icon: "ClipboardListIcon" as const,
  },
  {
    href: "/patient/appointments",
    title: "Appointments",
    description: "Review upcoming visits and book your next session.",
    icon: "IconCalendarTime" as const,
  },
  {
    href: "/patient/messages",
    title: "Messages",
    description: "Stay connected with your care team.",
    icon: "IconMessageCircle" as const,
  },
];

function PatientOverviewSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <View className="gap-2">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
        </View>

        <View className="gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </View>

        <Skeleton className="h-80 w-full rounded-2xl" />
      </View>
    </PatientScreen>
  );
}

export default function PatientOverviewRoute() {
  const { data: overview, isLoading } = usePatientDashboard();
  const { data: caregiverData, isLoading: isCaregiverLoading } =
    useMyCaregiverPatients();

  if (isLoading) {
    return <PatientOverviewSkeleton />;
  }

  const linkedPatients =
    caregiverData?.caregiverAccesses?.filter(
      (access) => access.isActive && access.patient,
    ) ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            {overview?.profile.displayName
              ? `Welcome back, ${overview.profile.displayName}`
              : "Patient Overview"}
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Keep track of appointments, clinical records, notifications,
            and messages from one place.
          </Text>
        </View>

        <View className="gap-4">
          <StatCard
            label="Upcoming Visits"
            value={overview?.upcomingVisits.active ?? 0}
            icon="IconCalendarTime"
            iconVariant="primary"
          />
          <StatCard
            label="Unread Notifications"
            value={overview?.inbox.unreadNotifications ?? 0}
            icon="BellIcon"
            iconVariant="warning"
          />
          <StatCard
            label="Open Conversations"
            value={overview?.inbox.openConversations ?? 0}
            icon="IconMessageCircle"
            iconVariant="info"
          />
        </View>

        <SectionCard
          title="Upcoming appointments"
          description="Your next scheduled visits."
          action={
            <Button href="/patient/appointments" variant="secondary" size="sm">
              View all
            </Button>
          }
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {overview?.upcomingAppointments?.length ? (
            overview.upcomingAppointments.map((appointment) => {
              const status = getAppointmentStatusMeta(appointment.status);

              return (
                <GradientCard key={appointment.id} variant={status.variant}>
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <Text className="font-secondary text-xs text-muted-foreground">
                        {appointment.branchName ?? "Branch pending"}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <AppIcon name="IconCalendarTime" size="sm" variant={status.variant as AppUIVariant} />
                      <View className="flex-1">
                        <Text className="font-body-semibold text-base text-foreground">
                          {appointment.providerName}
                        </Text>
                        <Text className="mt-0.5 font-secondary text-sm text-muted-foreground">
                          {formatDate(appointment.scheduledStartAt, {
                            mode: "datetime",
                          })}
                        </Text>
                      </View>
                    </View>
                    <Button
                      href={`/patient/appointments/${appointment.id}`}
                      variant="secondary"
                      fullWidth
                    >
                      View details
                    </Button>
                  </View>
                </GradientCard>
              );
            })
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconCalendarTime" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No upcoming appointments</EmptyTitle>
                <EmptyDescription>
                  You do not have any scheduled appointments right now.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>

        <SectionCard
          title="Quick actions"
          description="Jump into the parts of your care journey you use most."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {quickLinks.map((item) => (
            <GradientCard key={item.href} variant="primary">
              <View className="flex-row items-start gap-4">
                <AppIcon
                  name={item.icon}
                  mode="wrap"
                  size="md"
                  variant="primary"
                />
                <View className="flex-1 gap-1">
                  <Text className="font-body-semibold text-base text-foreground">
                    {item.title}
                  </Text>
                  <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </Text>
                </View>
              </View>
              <Button
                href={item.href}
                size="sm"
                variant="outline"
                className="mt-4 ml-auto max-w-max!"
              >
                Open {item.title}
              </Button>
            </GradientCard>
          ))}
        </SectionCard>

        <SectionCard
          title="Linked patient access"
          description="Read-only clinical views you can open as an approved caregiver."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {isCaregiverLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-2xl" />
            ))
          ) : linkedPatients.length ? (
            linkedPatients.map((access) => {
              const patientName =
                access.patient?.user.displayName;

              return (
                <GradientCard key={access.id} variant="info">
                  <View className="gap-4">
                    <View className="flex-row items-start gap-4">
                      <AppIcon
                        name="UsersIcon"
                        mode="wrap"
                        size="md"
                        variant="info"
                      />
                      <View className="flex-1 gap-1">
                        <Text className="font-body-semibold text-base text-foreground">
                          {patientName}
                        </Text>
                        <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                          View treatment plans and session notes with read-only
                          caregiver access.
                        </Text>
                      </View>
                    </View>
                    <View className="gap-2 sm:flex-row">
                      <Button
                        href={`/patient/care/linked/${access.patientId}/treatment-plans`}
                        variant="secondary"
                        size="sm"
                        fullWidth
                      >
                        Treatment Plans
                      </Button>
                      <Button
                        href={`/patient/care/linked/${access.patientId}/session-notes`}
                        variant="outline"
                        size="sm"
                        fullWidth
                      >
                        Session Notes
                      </Button>
                    </View>
                  </View>
                </GradientCard>
              );
            })
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="UsersIcon" size="md" variant="info" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No linked patients</EmptyTitle>
                <EmptyDescription>
                  Caregiver-approved patient records will appear here when your
                  access is granted.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>


        <SectionCard
          title="Recent notifications"
          description="Important account and appointment updates."
          action={
            <Button href="/patient/notifications" variant="secondary" size="sm">
              Open notifications
            </Button>
          }
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {overview?.recentNotifications?.length ? (
            overview.recentNotifications.map((notification) => (
              <GradientCard
                key={notification.id}
                variant={notification.readAt ? "success" : "primary"}
              >
                <View className="gap-3">
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-row items-center gap-2">
                      <AppIcon
                        name="BellIcon"
                        size="sm"
                        variant={notification.readAt ? "success" : "primary"}
                      />
                      <Badge variant={notification.readAt ? "success" : "primary"}>
                        {notification.readAt ? "Read" : "Unread"}
                      </Badge>
                    </View>
                    <Text className="font-secondary text-xs text-muted-foreground">
                      {formatDate(notification.createdAt, { mode: "datetime" })}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-body-semibold text-base text-foreground">
                      {notification.title}
                    </Text>
                    <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
                      {notification.message}
                    </Text>
                  </View>
                </View>
              </GradientCard>
            ))
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="BellIcon" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No notifications yet</EmptyTitle>
                <EmptyDescription>
                  New reminders and updates will show up here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
