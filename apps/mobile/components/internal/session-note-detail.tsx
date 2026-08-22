import { Text, View } from "react-native";
import { router } from "expo-router";

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
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionNote } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function Skeleton_() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-44 rounded-full" />
        <Skeleton className="h-[28rem] w-full rounded-[28px]" />
      </View>
    </InternalScreen>
  );
}

export function InternalSessionNoteDetail({
  noteId,
  backHref,
}: {
  noteId?: string;
  backHref: string;
}) {
  const { data: note, isLoading } = useSessionNote(noteId);

  if (isLoading) return <Skeleton_ />;

  if (!note) {
    return (
      <InternalScreen>
        <View className="section-wrapper pt-6">
          <Empty>
            <EmptyMedia variant="icon">
              <AppIcon name="ClipboardListIcon" size="md" variant="info" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Session note not found</EmptyTitle>
              <EmptyDescription>Could not find this session note.</EmptyDescription>
            </EmptyHeader>
            <Button onPress={() => router.back()} variant="outline" fullWidth>
              Go back
            </Button>
          </Empty>
        </View>
      </InternalScreen>
    );
  }

  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <Button onPress={() => router.back()} variant="ghost" size="sm">
          <AppIcon name="ArrowLeftIcon" size="sm" variant="primary" /> Back
        </Button>

        <SectionCard
          title={formatDate(note.sessionDate, { mode: "date" })}
          description="Session note details"
          action={
            note.durationMinutes ? (
              <Badge variant="outline">{note.durationMinutes} min</Badge>
            ) : undefined
          }
          className="shadow-soft"
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
    </InternalScreen>
  );
}
