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
import { useAppointments } from "@/hooks/use-healthcare";
import useUser from "@/hooks/use-user";
import { formatDate } from "@workspace/shared/utils";
import {
  formatStatusLabel,
  getAppointmentStatusMeta,
} from "@/lib/patient-status";

function AppointmentListSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <View className="gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </View>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </View>
    </PatientScreen>
  );
}

export default function PatientAppointmentsRoute() {
  const { data, isLoading } = useAppointments({});
  const { currentUser } = useUser();

  if (isLoading) {
    return <AppointmentListSkeleton />;
  }

  const appointments = data?.appointments ?? [];
  const upcoming = appointments.filter((item) =>
    ["booked", "confirmed"].includes(item.status),
  );
  const completed = appointments.filter((item) => item.status === "completed");
  const cancelled = appointments.filter((item) =>
    ["cancelled", "noShow"].includes(item.status),
  );

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        {!currentUser?.phone && (
          <View className="flex-row items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/40">
            <Text className="flex-1 font-secondary text-sm text-amber-800 dark:text-amber-300">
              A phone number is required to book appointments.
            </Text>
            <Button href="/patient/complete-profile" variant="outline" size="sm">
              Complete Profile
            </Button>
          </View>
        )}

        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            My Appointments
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            View your scheduled, completed, and past appointments.
          </Text>
        </View>

        <View className="gap-4">
          <StatCard
            label="Upcoming"
            value={upcoming.length}
            icon="IconCalendarTime"
            iconVariant="info"
          />
          <StatCard
            label="Completed"
            value={completed.length}
            icon="CheckCircleIcon"
            iconVariant="success"
          />
          <StatCard
            label="Cancelled"
            value={cancelled.length}
            icon="XCircleIcon"
            iconVariant="destructive"
          />
        </View>

        <SectionCard
          title="Appointments"
          description="Review your visit schedule and open details for any appointment."
          action={
            <Button href="/patient/appointments/book" variant="secondary" size="sm">
              Book appointment
            </Button>
          }
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {appointments.length ? (
            appointments.map((appointment) => {
              const status = getAppointmentStatusMeta(appointment.status);
              const providerName =
                appointment.provider?.user?.displayName;

              return (
                <GradientCard key={appointment.id} variant={status.variant}>
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <Badge variant="secondary">
                        {formatStatusLabel(appointment.channel)}
                      </Badge>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <AppIcon
                        name="IconCalendarTime"
                        size="sm"
                        variant={status.variant as AppUIVariant}
                      />
                      <View className="flex-1">
                        <Text className="font-body-semibold text-base text-foreground">
                          {providerName}
                        </Text>
                        <Text className="mt-0.5 font-secondary text-sm text-muted-foreground">
                          {formatDate(appointment.scheduledStartAt, {
                            mode: "date",
                          })}
                          {" · "}
                          {formatDate(appointment.scheduledStartAt, {
                            mode: "time",
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
                <EmptyTitle>No appointments yet</EmptyTitle>
                <EmptyDescription>
                  Book your first appointment to get started.
                </EmptyDescription>
              </EmptyHeader>
              <Button href="/patient/appointments/book" variant="outline" fullWidth>
                Book an appointment
              </Button>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
