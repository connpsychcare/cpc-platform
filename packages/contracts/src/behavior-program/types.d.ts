import type z from "zod";
import type { BehaviorProgram } from "@workspace/db/browser";
import type {
  behaviorProgramSchema,
  behaviorProgramQuerySchema,
} from "./schema";
import type {
  BaseQueryResponse,
  ProgramStatus,
  ProgramType,
  Sanitize,
} from "../lib/types";

export type BehaviorProgramType = z.input<typeof behaviorProgramSchema>;
export type BehaviorProgramQueryType = z.input<
  typeof behaviorProgramQuerySchema
>;

export type BehaviorProgramResponse = Sanitize<BehaviorProgram>;

export interface BehaviorProgramQueryResponse extends BaseQueryResponse {
  programs: BehaviorProgramResponse[];
}

export interface ProgramSessionProgress {
  sessionNoteId: string;
  sessionDate: string;
  /** Total trials in this session (response-based recording types) */
  trials: number;
  /** Correct responses in this session */
  correct: number;
  /** Percent correct (0–100); omitted when recording type is value-based */
  percent?: number;
  /** Average numeric value (for frequencyRate/duration types); omitted when response-based */
  avgValue?: number;
}

export interface BehaviorProgramProgressResponse {
  programId: string;
  programName: string;
  programType: ProgramType;
  programStatus: ProgramStatus;
  masteryDefinition?: string;
  baselineData?: string;
  /** Sessions analyzed (excluding sessions with no data points) */
  totalSessions: number;
  /** Total response-based trials across all sessions */
  totalTrials: number;
  /** Total correct responses across all sessions */
  correctTrials: number;
  /** Overall percent correct (0–100) */
  overallPercent: number;
  /** Default mastery threshold used for mastery check (80%) */
  masteryThreshold: number;
  /** True when the last 3 sessions all meet or exceed the mastery threshold */
  nearingMastery: boolean;
  /** Time-series data per session, sorted ascending by sessionDate */
  sessions: ProgramSessionProgress[];
}
