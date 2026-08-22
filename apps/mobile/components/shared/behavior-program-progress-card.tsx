import { Text, View } from "react-native";
import type { ProgramStatus } from "@workspace/contracts";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBehaviorProgramProgress } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

const STATUS_VARIANTS = {
  active: "success",
  mastered: "primary",
  onHold: "warning",
  discontinued: "destructive",
} as const satisfies Record<string, AppUIVariant>;

type BehaviorProgramProgressCardProps = {
  programId: string;
  programName: string;
  programStatus: ProgramStatus;
  masteryDefinition?: string | null;
  baselineData?: string | null;
};

function StatBlock({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View className="min-w-[30%] flex-1 gap-1 rounded-[20px] bg-muted/50 px-3 py-3">
      <Text className="font-secondary text-xs uppercase tracking-[1.2px] text-muted-foreground">
        {label}
      </Text>
      <Text className="font-body-semibold text-lg text-foreground">
        {value}
      </Text>
    </View>
  );
}

export function BehaviorProgramProgressCard({
  programId,
  programName,
  programStatus,
  masteryDefinition,
  baselineData,
}: BehaviorProgramProgressCardProps) {
  const { data: progress, isLoading } = useBehaviorProgramProgress(programId);

  if (isLoading) {
    return <Skeleton className="h-88 w-full rounded-[28px]" />;
  }

  const recentSessions = [...(progress?.sessions ?? [])].slice(-5).reverse();
  const hasPercentData = recentSessions.some(
    (session) => session.percent !== null,
  );
  const resolvedThreshold = progress?.masteryThreshold ?? 80;
  const resolvedPercent = progress?.overallPercent ?? 0;

  return (
    <SectionCard
      title={`${programName} Progress`}
      description="Current mastery progress based on recent recorded data."
      action={
        <Badge variant={STATUS_VARIANTS[programStatus] ?? "secondary"}>
          {programStatus}
        </Badge>
      }
      className="bg-primary/5"
      contentClassName="gap-4"
    >
      {progress?.nearingMastery ? (
        <View className="gap-1 rounded-[20px] border border-success/20 bg-success/10 px-4 py-3">
          <Text className="font-body-semibold text-sm text-success">
            Mastery criteria met
          </Text>
          <Text className="font-secondary text-sm leading-6 text-muted-foreground">
            The most recent sessions reached at least {resolvedThreshold}%
            correct. Your care team may soon mark this program as mastered.
          </Text>
        </View>
      ) : null}

      <View className="flex-row flex-wrap gap-3">
        <StatBlock label="Sessions" value={progress?.totalSessions ?? 0} />
        <StatBlock label="Trials" value={progress?.totalTrials ?? 0} />
        <StatBlock
          label={hasPercentData ? "Overall Correct" : "Avg Value"}
          value={hasPercentData ? `${resolvedPercent}%` : "Value-based"}
        />
      </View>

      {hasPercentData ? (
        <View className="gap-2">
          <View className="flex-row flex-wrap items-start justify-between gap-3">
            <Text className="font-secondary text-xs uppercase tracking-[1.2px] text-muted-foreground">
              Mastery progress
            </Text>
            <Text className="font-body-semibold text-sm text-foreground">
              {resolvedPercent}% of {resolvedThreshold}%
            </Text>
          </View>
          <View className="h-2.5 overflow-hidden rounded-full bg-muted">
            <View
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min((resolvedPercent / resolvedThreshold) * 100, 100)}%`,
              }}
            />
          </View>
        </View>
      ) : null}

      {masteryDefinition || baselineData ? (
        <>
          <Separator />
          <View className="gap-3">
            {masteryDefinition ? (
              <View className="gap-1">
                <Text className="font-secondary text-xs uppercase tracking-[1.2px] text-muted-foreground">
                  Mastery definition
                </Text>
                <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                  {masteryDefinition}
                </Text>
              </View>
            ) : null}
            {baselineData ? (
              <View className="gap-1">
                <Text className="font-secondary text-xs uppercase tracking-[1.2px] text-muted-foreground">
                  Baseline
                </Text>
                <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                  {baselineData}
                </Text>
              </View>
            ) : null}
          </View>
        </>
      ) : null}

      <Separator />

      {recentSessions.length ? (
        <View className="gap-3">
          <Text className="font-secondary text-xs uppercase tracking-[1.2px] text-muted-foreground">
            Recent sessions
          </Text>
          {recentSessions.map((session) => (
            <View
              key={session.sessionNoteId}
              className="gap-2 rounded-[20px] border border-border bg-background px-4 py-3"
            >
              <View className="flex-row flex-wrap items-start justify-between gap-3">
                <Text className="font-body-semibold text-sm text-foreground">
                  {formatDate(session.sessionDate, { mode: "date" })}
                </Text>
                {session.percent !== null ? (
                  <Badge
                    variant={
                      session.percent || 0 >= resolvedThreshold
                        ? "success"
                        : "secondary"
                    }
                  >
                    {session.percent}%
                  </Badge>
                ) : session.avgValue !== null ? (
                  <Badge variant="outline">Avg {session.avgValue}</Badge>
                ) : null}
              </View>

              {session.percent !== null ? (
                <>
                  <View className="h-2 overflow-hidden rounded-full bg-muted">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(session.percent || 0, 100)}%`,
                      }}
                    />
                  </View>
                  <Text className="font-secondary text-xs text-muted-foreground">
                    {session.correct}/{session.trials} correct trials
                  </Text>
                </>
              ) : session.avgValue !== null ? (
                <Text className="font-secondary text-xs text-muted-foreground">
                  Average recorded value: {session.avgValue}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : (
        <View className="gap-1 rounded-[20px] border border-dashed border-border px-4 py-4">
          <Text className="font-body-semibold text-sm text-foreground">
            No progress data yet
          </Text>
          <Text className="font-secondary text-sm leading-6 text-muted-foreground">
            Progress will appear here after data points are recorded during
            therapy sessions.
          </Text>
        </View>
      )}
    </SectionCard>
  );
}
