import type z from "zod";
import type { PatientProfile, ProgressReport } from "@workspace/db/browser";
import type {
  progressReportSchema,
  updateProgressReportSchema,
  progressReportQuerySchema,
} from "./schema";
import type {
  BaseQueryResponse,
  ProgressReportStatus,
  Sanitize,
} from "../lib/types";
import type { BaseUserResponse } from "../user/types";

export type ProgressReportType = z.input<typeof progressReportSchema>;
export type UpdateProgressReportType = z.input<
  typeof updateProgressReportSchema
>;
export type ProgressReportQueryType = z.input<typeof progressReportQuerySchema>;

export type ProgressReportPatientResponse = Sanitize<
  Pick<PatientProfile, "id">
> & {
  user: BaseUserResponse;
};

/** Structured clinical data stored in the report content JSON field. */
export interface ProgressReportContent {
  patient: {
    name: string;
    dob: string | null;
    diagnosis: string | null;
  };
  provider: {
    name: string;
    credentials: string[];
  } | null;
  treatmentPlan: {
    title: string;
  } | null;
  behaviorPrograms: Array<{
    name: string;
    type: string;
    masteryPercent: number;
    sessionsCount: number;
    lastSessionDate: string | null;
    masteryStatus: "notStarted" | "inProgress" | "mastered";
  }>;
  sessionStats: {
    total: number;
    totalMinutes: number;
    averageDurationMinutes: number;
    firstSession: string | null;
    lastSession: string | null;
  };
  dataPointSummary: {
    totalTrials: number;
    programsWithData: number;
  };
  generatedAt: string;
}

export type ProgressReportResponse = Sanitize<ProgressReport> & {
  status: ProgressReportStatus;
  content: ProgressReportContent;
  patient?: ProgressReportPatientResponse;
  generatedBy?: BaseUserResponse;
};

export interface ProgressReportQueryResponse extends BaseQueryResponse {
  progressReports: ProgressReportResponse[];
}
