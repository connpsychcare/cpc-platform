import type z from "zod";
import type { DataPoint } from "@workspace/db/browser";
import type { dataPointSchema, dataPointQuerySchema } from "./schema";
import type {
  BaseQueryResponse,
  DataRecordingType,
  DataResponseType,
  Sanitize,
} from "../lib/types";
import type { BehaviorProgramResponse } from "../behavior-program/types";
import type { SessionNoteResponse } from "../session-note/types";

export type DataPointType = z.input<typeof dataPointSchema>;
export type DataPointQueryType = z.input<typeof dataPointQuerySchema>;

export type DataPointProgramResponse = Pick<
  BehaviorProgramResponse,
  "id" | "name" | "type"
>;

export type DataPointSessionNoteResponse = Pick<
  SessionNoteResponse,
  "id" | "sessionDate"
>;

export type DataPointResponse = Sanitize<DataPoint> & {
  program?: DataPointProgramResponse;
  sessionNote?: DataPointSessionNoteResponse;
};

export interface DataPointQueryResponse extends BaseQueryResponse {
  dataPoints: DataPointResponse[];
}
