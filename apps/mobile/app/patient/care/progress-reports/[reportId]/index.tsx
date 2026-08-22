import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import type { ProgressReportContent } from "@workspace/contracts/progress-report";

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
import { useProgressReport } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function DetailSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-8 w-64 rounded-full" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
        <Skeleton className="h-48 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

const MASTERY_LABEL: Record<string, string> = {
  mastered: "Mastered",
  inProgress: "In Progress",
  notStarted: "Not Started",
};

const MASTERY_VARIANT: Record<string, AppUIVariant | "outline"> = {
  mastered: "success",
  inProgress: "secondary",
  notStarted: "outline",
};

export default function ProgressReportDetailRoute() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const { data: report, isLoading } = useProgressReport(reportId);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!report) {
    return (
      <PatientScreen>
        <View className="section-wrapper flex-1 items-center justify-center gap-4 py-16">
          <AppIcon name="IconChartBar" size="lg" variant="info" />
          <Text className="font-body-semibold text-base text-foreground">Report not found</Text>
          <Button href="/patient/care/progress-reports" variant="outline" size="sm">
            Back to Reports
          </Button>
        </View>
      </PatientScreen>
    );
  }

  const content = report.content as ProgressReportContent | undefined;
  const stats = content?.sessionStats;
  const programs = content?.behaviorPrograms ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        {/* Header */}
        <View className="gap-2">
          <Button
            href="/patient/care/progress-reports"
            variant="ghost"
            size="sm"
            className="-ml-2 self-start"
          >
            ← Progress Reports
          </Button>
          <Text className="font-primary text-3xl text-foreground">{report.title}</Text>
          <Text className="font-secondary text-sm text-muted-foreground">
            {formatDate(report.periodStart, { mode: "date" })}
            {" - "}
            {formatDate(report.periodEnd, { mode: "date" })}
          </Text>
          <Badge variant="success" className="self-start capitalize">
            {report.status}
          </Badge>
        </View>

        {/* Session Statistics */}
        {stats && (
          <SectionCard
            title="Session Statistics"
            className="shadow-soft"
            contentClassName="gap-3"
          >
            <View className="flex-row flex-wrap gap-4">
              {stats.total !== undefined && (
                <View className="min-w-[100px] gap-0.5">
                  <Text className="font-secondary text-xs text-muted-foreground">Total Sessions</Text>
                  <Text className="font-body-semibold text-sm text-foreground">{stats.total}</Text>
                </View>
              )}
              {stats.totalMinutes !== undefined && (
                <View className="min-w-[100px] gap-0.5">
                  <Text className="font-secondary text-xs text-muted-foreground">Total Minutes</Text>
                  <Text className="font-body-semibold text-sm text-foreground">{stats.totalMinutes}</Text>
                </View>
              )}
              {stats.averageDurationMinutes !== undefined && (
                <View className="min-w-[100px] gap-0.5">
                  <Text className="font-secondary text-xs text-muted-foreground">Avg Duration</Text>
                  <Text className="font-body-semibold text-sm text-foreground">
                    {Math.round(stats.averageDurationMinutes)} min
                  </Text>
                </View>
              )}
              {stats.firstSession && (
                <View className="min-w-[100px] gap-0.5">
                  <Text className="font-secondary text-xs text-muted-foreground">First Session</Text>
                  <Text className="font-body-semibold text-sm text-foreground">
                    {formatDate(stats.firstSession, { mode: "date" })}
                  </Text>
                </View>
              )}
              {stats.lastSession && (
                <View className="min-w-[100px] gap-0.5">
                  <Text className="font-secondary text-xs text-muted-foreground">Last Session</Text>
                  <Text className="font-body-semibold text-sm text-foreground">
                    {formatDate(stats.lastSession, { mode: "date" })}
                  </Text>
                </View>
              )}
            </View>
          </SectionCard>
        )}

        {/* Program Progress */}
        <SectionCard
          title="Program Progress"
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {programs.length ? (
            programs.map((prog, i) => (
              <GradientCard key={i} variant="info">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 gap-0.5">
                    <Text className="font-body-semibold text-sm text-foreground">
                      {prog.name}
                    </Text>
                    <Text className="font-secondary text-xs text-muted-foreground">
                      {prog.sessionsCount} session{prog.sessionsCount !== 1 ? "s" : ""}
                      {prog.lastSessionDate
                        ? ` · Last: ${formatDate(prog.lastSessionDate, { mode: "date" })}`
                        : ""}
                    </Text>
                  </View>
                  <View className="items-end gap-1.5 shrink-0">
                    <Text className="font-body-semibold text-sm text-foreground">
                      {prog.masteryPercent}%
                    </Text>
                    <Badge variant={MASTERY_VARIANT[prog.masteryStatus] ?? "outline"}>
                      {MASTERY_LABEL[prog.masteryStatus] ?? prog.masteryStatus}
                    </Badge>
                  </View>
                </View>
              </GradientCard>
            ))
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconChartBar" size="md" variant="secondary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No program data</EmptyTitle>
                <EmptyDescription>
                  No program data was recorded in this period.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
