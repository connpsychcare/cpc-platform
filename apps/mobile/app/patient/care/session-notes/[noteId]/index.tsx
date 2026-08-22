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
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionNote } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function SessionNoteDetailSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-44 rounded-full" />
        <Skeleton className="h-[28rem] w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientSessionNoteDetailRoute() {
  const { noteId } = useLocalSearchParams<{ noteId?: string | string[] }>();
  const resolvedNoteId = Array.isArray(noteId) ? noteId[0] : noteId;
  const { data: note, isLoading } = useSessionNote(resolvedNoteId);

  if (isLoading) {
    return <SessionNoteDetailSkeleton />;
  }

  if (!note) {
    return (
      <PatientScreen>
        <View className="section-wrapper pt-6">
          <Empty>
            <EmptyMedia variant="icon">
              <AppIcon name="ClipboardListIcon" size="md" variant="info" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Session note not found</EmptyTitle>
              <EmptyDescription>
                We could not find the session note you were looking for.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              href="/patient/care/session-notes"
              variant="outline"
              fullWidth
            >
              Back to session notes
            </Button>
          </Empty>
        </View>
      </PatientScreen>
    );
  }

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <Button href="/patient/care/session-notes" variant="ghost" size="sm">
          <AppIcon name="ArrowLeftIcon" size="sm" variant="primary" /> Back to
          session notes
        </Button>

        <SectionCard
          title={formatDate(note.sessionDate, { mode: "date" })}
          description="Read-only therapy summary from your care team."
          action={
            note.durationMinutes ? (
              <Badge variant="outline">{note.durationMinutes} min</Badge>
            ) : undefined
          }
          className="shadow-soft bg-info/10"
          contentClassName="gap-4"
        >
          <View className="gap-4">
            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                Therapist
              </Text>
              <Text className="font-body-semibold text-base text-foreground">
                {note.therapist?.displayName ?? "Care team"}
              </Text>
            </View>

            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                Session Time
              </Text>
              <Text className="font-body-semibold text-base text-foreground">
                {formatDate(note.sessionDate, { mode: "datetime" })}
              </Text>
            </View>

            {note.treatmentPlan ? (
              <View className="gap-1">
                <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                  Treatment Plan
                </Text>
                <Text className="font-body-semibold text-base text-foreground">
                  {note.treatmentPlan.title}
                </Text>
              </View>
            ) : null}

            {note.summary ? (
              <>
                <Separator />
                <View className="gap-1">
                  <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                    Summary
                  </Text>
                  <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                    {note.summary}
                  </Text>
                </View>
              </>
            ) : null}

            {note.clientBehavior ? (
              <>
                <Separator />
                <View className="gap-1">
                  <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                    Behavioral Observations
                  </Text>
                  <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                    {note.clientBehavior}
                  </Text>
                </View>
              </>
            ) : null}

            {note.nextSteps ? (
              <>
                <Separator />
                <View className="gap-1">
                  <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                    Next Steps
                  </Text>
                  <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                    {note.nextSteps}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
