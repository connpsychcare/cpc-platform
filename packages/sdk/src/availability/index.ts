import apiClient, { executeApi } from "../lib/api-client";
import type {
  AvailabilityScheduleType,
  AvailabilitySlotsQueryType,
  AvailabilityRuleResponse,
  BlockedTimeResponse,
} from "@workspace/contracts/availability";

export interface AvailabilityScheduleResponse {
  rules: AvailabilityRuleResponse[];
  blockedTimes: BlockedTimeResponse[];
}

export interface AvailabilitySlotResponse {
  startAt: string;
  endAt: string;
  /** Slot exists on the schedule but is already taken - render it disabled, not hidden. */
  isBooked: boolean;
}

export const getProviderAvailability = (providerId: string) =>
  executeApi<AvailabilityScheduleResponse>(() =>
    apiClient.get(`/providers/${providerId}/availability`),
  );

export const getProviderAvailableSlots = (
  providerId: string,
  params: AvailabilitySlotsQueryType,
) =>
  executeApi<AvailabilitySlotResponse[]>(() =>
    apiClient.get(`/providers/${providerId}/availability/slots`, { params }),
  );

export const replaceProviderAvailability = (
  providerId: string,
  data: AvailabilityScheduleType,
) =>
  executeApi<AvailabilityScheduleResponse>(() =>
    apiClient.put(`/providers/${providerId}/availability`, data),
  );
