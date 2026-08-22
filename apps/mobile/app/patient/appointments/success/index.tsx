import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PatientScreen } from "@/components/shared/patient-screen";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointment } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function AppointmentSuccessSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper pt-6">
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientAppointmentSuccessRoute() {
  const { appointmentId } = useLocalSearchParams<{
    appointmentId?: string | string[];
  }>();
  const resolvedAppointmentId = Array.isArray(appointmentId)
    ? appointmentId[0]
    : appointmentId;
  const { data: appointment, isLoading } = useAppointment(resolvedAppointmentId);

  if (isLoading) {
    return <AppointmentSuccessSkeleton />;
  }

  return (
    <PatientScreen>
      <View className="section-wrapper pt-6">
        <Card className="bg-card shadow-soft">
          <CardContent className="items-center gap-4 py-10">
            <View className="flex-center size-20 rounded-full bg-success/10">
              <AppIcon name="CheckIcon" size="lg" variant="success" />
            </View>

            <View className="gap-2">
              <Text className="text-center font-primary text-3xl text-foreground">
                Appointment booked
              </Text>
              <Text className="text-center font-secondary text-sm leading-7 text-muted-foreground">
                Your appointment has been submitted successfully. You will receive a confirmation once the team reviews it.
              </Text>
            </View>

            {appointment ? (
              <View className="w-full rounded-[24px] border border-border bg-surface-elevated px-4 py-5">
                <Text className="text-center font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                  Appointment Summary
                </Text>
                <Separator className="my-4" />
                <View className="gap-3">
                  <View>
                    <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                      Provider
                    </Text>
                    <Text className="font-body-semibold text-base text-foreground">
                      {appointment.provider?.user?.displayName}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                      Type
                    </Text>
                    <Text className="font-body-semibold text-base text-foreground">
                      {appointment.channel}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                      Date
                    </Text>
                    <Text className="font-body-semibold text-base text-foreground">
                      {formatDate(appointment.scheduledStartAt, { mode: "date" })}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                      Time
                    </Text>
                    <Text className="font-body-semibold text-base text-foreground">
                      {formatDate(appointment.scheduledStartAt, { mode: "time" })}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            <View className="w-full gap-3 pt-2">
              {resolvedAppointmentId ? (
                <Button
                  href={`/patient/appointments/${resolvedAppointmentId}`}
                  fullWidth
                >
                  View Appointment
                </Button>
              ) : null}
              <Button href="/patient/appointments" variant="outline" fullWidth>
                All Appointments
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </PatientScreen>
  );
}
