import { Text, View } from "react-native";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/shared/gradient-card";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgressReports } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function ProgressReportsSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-64 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientProgressReportsRoute() {
  const { data, isLoading } = useProgressReports({ limit: 50 });

  if (isLoading) {
    return <ProgressReportsSkeleton />;
  }

  const reports = (data?.progressReports ?? []).filter((r) => r.status === "published");

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Progress Reports
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Clinical summaries prepared by your care team covering session activity and program progress.
          </Text>
        </View>

        <SectionCard
          title="Published Reports"
          description="Reports shared by your care team."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {reports.length ? (
            reports.map((report) => (
              <GradientCard key={report.id} variant="info">
                <View className="gap-3">
                  <View className="gap-1">
                    <View className="flex-row flex-wrap items-center gap-2">
                      <Text className="font-body-semibold text-base text-foreground">
                        {report.title}
                      </Text>
                      <Badge variant="success">Published</Badge>
                    </View>
                    <Text className="font-secondary text-xs text-muted-foreground">
                      {formatDate(report.periodStart, { mode: "date" })}
                      {" - "}
                      {formatDate(report.periodEnd, { mode: "date" })}
                    </Text>
                    {report.generatedBy && (
                      <Text className="font-secondary text-xs text-muted-foreground">
                        Prepared by {report.generatedBy.displayName}
                      </Text>
                    )}
                  </View>
                  <Button
                    href={`/patient/care/progress-reports/${report.id}`}
                    variant="secondary"
                    size="sm"
                    className="ml-auto max-w-max!"
                  >
                    View Report
                  </Button>
                </View>
              </GradientCard>
            ))
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconChartBar" size="md" variant="info" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No reports yet</EmptyTitle>
                <EmptyDescription>
                  Your care team will publish reports after reviewing your session data.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button href="/patient/appointments" variant="outline" size="sm">
                  View Appointments
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
