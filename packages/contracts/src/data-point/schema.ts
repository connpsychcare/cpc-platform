import { z } from "zod";
import {
  baseQuerySchema,
  idSchema,
  isoDateSchema,
  numberSchema,
  optionalStringSchema,
  positiveIntSchema,
} from "../lib/schema";
import { DataRecordingTypeEnum, DataResponseEnum } from "../lib/enums";

export const dataPointSchema = z.object({
  sessionNoteId: idSchema,
  programId: idSchema,
  recordingType: DataRecordingTypeEnum,
  response: DataResponseEnum.optional(),
  value: numberSchema.optional(),
  trialNumber: positiveIntSchema.optional(),
  notes: optionalStringSchema,
  recordedAt: isoDateSchema.optional(),
});

export const dataPointQuerySchema = baseQuerySchema(
  z.enum(["recordedAt", "trialNumber", "value"]), // TODO move to lib/enums as others
  z.enum(["notes"]),
  "recordedAt",
).extend({
  sessionNoteId: idSchema.optional(),
  programId: idSchema.optional(),
  recordingType: DataRecordingTypeEnum.optional(),
  response: DataResponseEnum.optional(),
});
