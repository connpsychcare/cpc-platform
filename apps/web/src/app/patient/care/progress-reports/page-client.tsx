"use client";

import Link from "next/link";
import { BarChart2, Download } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import {
  useProgressReports,
  useDownloadProgressReportPdf,
} from "@/hooks/healthcare";

export default function PatientProgressReportsPage() {
  const { data, isLoading } = useProgressReports({ limit: 50 });
  const { downloadAsync, isDownloading } = useDownloadProgressReportPdf();

  const reports = (data?.progressReports ?? []).filter((r) => r.status === "published");

  const handleDownload = async (id: string) => {
    try {
      await downloadAsync(id);
    } catch (err: any) {
      toast.error("PDF download failed.", { description: err?.message });
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">Progress Reports</h1>
        <p className="text-sm text-muted-foreground">
          Clinical summaries prepared by your care team covering session activity and program progress.
        </p>
      </div>

      <SectionCard title="Published Reports" contentClassName="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-2xl border p-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
          ))}

        {!isLoading && reports.length === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-center">
            <BarChart2 className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No progress reports yet</p>
            <p className="text-xs text-muted-foreground">
              Your care team will publish reports after reviewing your session data.
            </p>
          </div>
        )}

        {reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/patient/care/progress-reports/${report.id}`}
                  className="font-medium hover:underline"
                >
                  {report.title}
                </Link>
                <Badge variant="default" className="text-xs">Published</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(report.periodStart, { mode: "date" })} -{" "}
                {formatDate(report.periodEnd, { mode: "date" })}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/patient/care/progress-reports/${report.id}`}>
                  View
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(report.id)}
                disabled={isDownloading}
              >
                <Download className="size-3.5 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
