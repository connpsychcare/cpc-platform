"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  useBehaviorProgramProgress,
  useBehaviorProgram,
} from "@/hooks/treatment-plan";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";

const PROGRAM_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  mastered: "Mastered",
  onHold: "On Hold",
  discontinued: "Discontinued",
};

const ProgramProgressPage = ({ params }: PageProps<"/patients/[id]/treatment-plans/[planId]/programs/[programId]/progress">) => {
  const { id: patientId, planId, programId } = React.use(params);
  const { data: progress, isLoading, fetchError } = useBehaviorProgramProgress(programId);
  const {
    data: program,
    mutateAsync,
    isPending: updating,
  } = useBehaviorProgram(programId);

  const handleStatusUpdate = async (status: string) => {
    try {
      await mutateAsync({ ...program!, status: status as any });
      toast.success(`Program marked as ${status}.`);
    } catch (err: any) {
      toast.error("Failed to update status.", { description: err?.message });
    }
  };

  const chartData = (progress?.sessions ?? [])
    .filter((s) => s.percent !== null)
    .map((s) => ({
      date: formatDate(s.sessionDate, { mode: "date" }),
      percent: s.percent,
      correct: s.correct,
      trials: s.trials,
    }));

  const valueData = (progress?.sessions ?? [])
    .filter((s) => s.avgValue !== null)
    .map((s) => ({
      date: formatDate(s.sessionDate, { mode: "date" }),
      value: s.avgValue,
    }));

  const isValueBased = chartData.length === 0 && valueData.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/patients/${patientId}/treatment-plans/${planId}`}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Treatment Plan
        </Link>
        <span>/</span>
        <span>{progress?.programName ?? program?.name ?? "Program"}</span>
        <span>/</span>
        <span>Progress</span>
      </div>

      {fetchError ? (

        <InfoNotice

          variant="error"

          message={

            fetchError.message ??

            "Could not load this record. Please refresh and try again."

          }

        />

      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : progress ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {progress.programName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Goal tracking and mastery progress
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {progress.programStatus === "active" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updating}
                    onClick={() => handleStatusUpdate("mastered")}
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    Mark as Mastered
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updating}
                    onClick={() => handleStatusUpdate("discontinued")}
                  >
                    Discontinue
                  </Button>
                </>
              )}
            </div>
          </div>

          {progress.nearingMastery && (
            <div className="flex items-start gap-3 rounded-lg border border-success/25 bg-success/10 p-4 text-sm">
              <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-success">
                  Mastery criteria met
                </p>
                <p className="text-success mt-0.5">
                  The last 3 sessions all reached ≥{progress.masteryThreshold}%
                  correct. Consider marking this program as mastered.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SectionCard contentClassName="space-y-1">
              <p className="text-xs text-muted-foreground">Sessions</p>
              <p className="text-2xl font-semibold">{progress.totalSessions}</p>
            </SectionCard>
            <SectionCard contentClassName="space-y-1">
              <p className="text-xs text-muted-foreground">Total Trials</p>
              <p className="text-2xl font-semibold">{progress.totalTrials}</p>
            </SectionCard>
            <SectionCard contentClassName="space-y-1">
              <p className="text-xs text-muted-foreground">Overall % Correct</p>
              <p className="text-2xl font-semibold">
                {progress.overallPercent}%
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(progress.overallPercent, 100)}%`,
                  }}
                />
              </div>
            </SectionCard>
            <SectionCard contentClassName="space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge
                variant={getStatusVariant(progress.programStatus)}
                className="capitalize mt-1"
              >
                {PROGRAM_STATUS_LABELS[progress.programStatus] ??
                  progress.programStatus}
              </Badge>
            </SectionCard>
          </div>

          {(progress.masteryDefinition || progress.baselineData) && (
            <SectionCard
              title="Program Details"
              contentClassName="grid gap-4 sm:grid-cols-2 text-sm"
            >
              {progress.masteryDefinition && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Mastery Definition
                  </p>
                  <p>{progress.masteryDefinition}</p>
                </div>
              )}
              {progress.baselineData && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Baseline Data
                  </p>
                  <p>{progress.baselineData}</p>
                </div>
              )}
            </SectionCard>
          )}

          {chartData.length > 0 && (
            <SectionCard title="% Correct Over Time" contentClassName="pt-2">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "% Correct"]}
                    labelFormatter={(label) => `Session: ${label}`}
                  />
                  <ReferenceLine
                    y={progress.masteryThreshold}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="4 4"
                    label={{
                      value: `${progress.masteryThreshold}% Mastery`,
                      fontSize: 11,
                      position: "insideTopRight",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percent"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                    name="% Correct"
                  />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>
          )}

          {isValueBased && valueData.length > 0 && (
            <SectionCard
              title="Average Value Over Time"
              contentClassName="pt-2"
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={valueData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [value, "Avg Value"]}
                    labelFormatter={(label) => `Session: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                    name="Avg Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>
          )}

          {progress.totalSessions === 0 && (
            <SectionCard title="No Data Yet">
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
                <TrendingUp className="size-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">No data points recorded</p>
                <p className="text-xs text-muted-foreground">
                  Data points recorded during sessions will appear here as a
                  progress chart.
                </p>
              </div>
            </SectionCard>
          )}

          {progress.sessions.length > 0 && (
            <SectionCard title="Session Breakdown" contentClassName="space-y-2">
              {[...progress.sessions].reverse().map((s) => (
                <div
                  key={s.sessionNoteId}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <p className="font-medium">
                      {formatDate(s.sessionDate, { mode: "date" })}
                    </p>
                    {s.trials > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {s.correct}/{s.trials} correct
                      </p>
                    )}
                    {s.avgValue !== null && (
                      <p className="text-xs text-muted-foreground">
                        Avg: {s.avgValue}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {s.percent !== null && (
                      <>
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-primary"
                              style={{
                                width: `${Math.min(s.percent || 0, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span
                          className={
                            s.percent || 0 >= progress.masteryThreshold
                              ? "font-semibold text-success"
                              : "font-medium"
                          }
                        >
                          {s.percent}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </SectionCard>
          )}
        </>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
          <AlertTriangle className="size-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">Program not found</p>
        </div>
      )}
    </div>
  );
};

export default ProgramProgressPage;
