import { useLocalSearchParams } from "expo-router";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyCaregiverPatients,
  useSessionNotes,
} from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function LinkedSessionNotesSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-52 rounded-full" />
        <Skeleton className="h-24 w-full rounded-[28px]" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function LinkedPatientSessionNotesRoute() {
  const { patientId } = useLocalSearchParams<{ patientId?: string | string[] }>();
  const resolvedPatientId = Array.isArray(patientId) ? patientId[0] : patientId;
  const { data: caregiverData, isLoading: isCaregiverLoading } =
    useMyCaregiverPatients();
  const { data, isLoading } = useSessionNotes({
    patientId: resolvedPatientId,
    limit: 50,
  });

  if (isLoading || isCaregiverLoading) {
    return <LinkedSessionNotesSkeleton />;
  }

  const linkedPatient = caregiverData?.caregiverAccesses?.find(
    (access) => access.patientId === resolvedPatientId && access.isActive,
  );
  const patientName = linkedPatient?.patient?.user.displayName;
  const notes = data?.sessionNotes ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <Button href="/patient" variant="ghost" size="sm">
          <AppIcon name="ArrowLeftIcon" size="sm" variant="primary" /> Back to
          overview
        </Button>

        <SectionCard
          title="Read-only caregiver access"
          description={`You are viewing session notes for ${patientName}.`}
          className="shadow-soft bg-info/10"
          contentClassName="gap-2"
        >
          <Text className="font-secondary text-sm leading-6 text-muted-foreground">
            Notes shown here are shared clinical records and cannot be edited
            from the mobile app.
          </Text>
          <Button
            href={`/patient/care/linked/${resolvedPatientId}/treatment-plans`}
            variant="secondary"
            fullWidth
          >
            Open treatment plans for {patientName}
          </Button>
        </SectionCard>

        <SectionCard
          title={`${patientName} session notes`}
          description="Therapy summaries shared with you through caregiver access."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {notes.length ? (
            notes.map((note) => (
              <GradientCard key={note.id} variant="info">
                <View className="gap-3">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 gap-1">
                      <Text className="font-body-semibold text-base text-foreground">
                        {formatDate(note.sessionDate, { mode: "date" })}
                      </Text>
                      <Text className="font-secondary text-sm text-muted-foreground">
                        Therapist: {note.therapist?.displayName ?? "Care team"}
                      </Text>
                    </View>
                    {note.durationMinutes ? (
                      <Badge variant="outline">
                        {note.durationMinutes} min
                      </Badge>
                    ) : null}
                  </View>

                  {note.treatmentPlan ? (
                    <Text className="font-secondary text-xs text-muted-foreground">
                      Plan: {note.treatmentPlan.title}
                    </Text>
                  ) : null}

                  {note.summary ? (
                    <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                      {note.summary}
                    </Text>
                  ) : null}
                </View>
              </GradientCard>
            ))
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="UsersIcon" size="md" variant="info" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No session notes shared yet</EmptyTitle>
                <EmptyDescription>
                  Session notes for {patientName} will appear here after they
                  are documented and shared through caregiver access.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
