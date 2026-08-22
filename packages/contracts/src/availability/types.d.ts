import type z from "zod";
import type {
  ProviderAvailability,
  ProviderBlockedTime,
} from "@workspace/db/browser";
import type {
  availabilityRuleSchema,
  availabilityScheduleSchema,
  availabilitySlotsQuerySchema,
  blockedTimeSchema,
} from "./schema";
import type { Sanitize } from "../lib/types";

export type AvailabilityRuleType = z.input<typeof availabilityRuleSchema>;
export type BlockedTimeType = z.input<typeof blockedTimeSchema>;

export type AvailabilityScheduleType = z.input<
  typeof availabilityScheduleSchema
>;
export type AvailabilitySlotsQueryType = z.input<
  typeof availabilitySlotsQuerySchema
>;
export type AvailabilityRuleResponse = Sanitize<ProviderAvailability>;
export type BlockedTimeResponse = Sanitize<ProviderBlockedTime>;
