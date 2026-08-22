"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, BarChart2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { formatDate } from "@workspace/shared/utils";
import { useProgressReport, useDownloadProgressReportPdf } from "@/hooks/healthcare";
import type { ProgressReportContent } from "@workspace/contracts/progress-report";

const statLabel = (label: string, value: string | number) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default function PatientProgressReportDetailPage({
  reportId,
}: {
  reportId: string;
}) {
  const { data: report, isLoading } = useProgressReport(reportId);
  const { downloadAsync, isDownloading } = useDownloadProgressReportPdf();

  const handleDownload = async () => {
    try {
      await downloadAsync(reportId);
    } catch (err: any) {
      toast.error("PDF download failed.", { description: err?.message });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-40 gap-2 text-center">
          <BarChart2 className="size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">Report not found</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/patient/care/progress-reports">
              <ArrowLeft className="size-3.5 mr-1" />
              Back to Reports
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const content = report.content as ProgressReportContent | undefined;
  const stats = content?.sessionStats;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/patient/care/progress-reports">
            <ArrowLeft className="size-3.5 mr-1" />
            Progress Reports
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">{report.title}</h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(report.periodStart, { mode: "date" })} -{" "}
              {formatDate(report.periodEnd, { mode: "date" })}
            </p>
            <Badge variant="default" className="capitalize mt-1">{report.status}</Badge>
          </div>

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
            className="shrink-0"
          >
            <Download className="size-4 mr-1.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Session Statistics */}
      {stats && (
        <SectionCard title="Session Statistics">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.total !== undefined && statLabel("Total Sessions", stats.total)}
            {stats.totalMinutes !== undefined && statLabel("Total Minutes", stats.totalMinutes)}
            {stats.averageDurationMinutes !== undefined &&
              statLabel("Avg Duration", `${Math.round(stats.averageDurationMinutes)} min`)}
            {stats.firstSession &&
              statLabel("First Session", formatDate(stats.firstSession, { mode: "date" }))}
            {stats.lastSession &&
              statLabel("Last Session", formatDate(stats.lastSession, { mode: "date" }))}
          </div>
        </SectionCard>
      )}

      {/* Behavior Programs */}
      {content?.behaviorPrograms && content.behaviorPrograms.length > 0 ? (
        <SectionCard title="Program Progress">
          <div className="space-y-3">
            {content.behaviorPrograms.map((prog, i) => {
              const masteryLabel = {
                mastered: "Mastered",
                inProgress: "In Progress",
                notStarted: "Not Started",
              }[prog.masteryStatus] ?? prog.masteryStatus;

              const masteryVariant: "default" | "secondary" | "outline" =
                prog.masteryStatus === "mastered"
                  ? "default"
                  : prog.masteryStatus === "inProgress"
                    ? "secondary"
                    : "outline";

              return (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{prog.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {prog.sessionsCount} session{prog.sessionsCount !== 1 ? "s" : ""}
                      {prog.lastSessionDate &&
                        ` · Last: ${formatDate(prog.lastSessionDate, { mode: "date" })}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold">{prog.masteryPercent}%</span>
                    <Badge variant={masteryVariant} className="text-xs">
                      {masteryLabel}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Program Progress">
          <p className="text-sm text-muted-foreground">
            No program data was recorded in this period.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
