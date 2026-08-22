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
import { useSessionNotes } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function SessionNotesSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-44 rounded-full" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientSessionNotesRoute() {
  const { data, isLoading } = useSessionNotes({ limit: 50 });

  if (isLoading) {
    return <SessionNotesSkeleton />;
  }

  const notes = data?.sessionNotes ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Session Notes
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Review read-only summaries from your therapy sessions.
          </Text>
        </View>

        <SectionCard
          title="All sessions"
          description="Clinical notes documented by your care team."
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

                  <Button
                    href={`/patient/care/session-notes/${note.id}`}
                    variant="secondary"
                    fullWidth
                  >
                    Open session note
                  </Button>
                </View>
              </GradientCard>
            ))
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="ClipboardListIcon" size="md" variant="info" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No session notes yet</EmptyTitle>
                <EmptyDescription>
                  Session summaries will appear here after your therapy visits.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
