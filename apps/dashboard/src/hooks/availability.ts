"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AvailabilityRuleResponse,
  AvailabilityScheduleType,
  BlockedTimeResponse,
} from "@workspace/contracts/availability";
import type { ApiException } from "@workspace/sdk";
import type { AvailabilitySlotResponse } from "@workspace/sdk/availability";
import * as availability from "@workspace/sdk/availability";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useProviderAvailability(providerId?: string) {
  const query = useQuery({
    queryKey: ["providerAvailability", providerId],
    queryFn: () => availability.getProviderAvailability(providerId!),
    select: (res) => res.data,
    enabled: Boolean(providerId),
    ...queryDefaults,
  });

  return {
    data: query.data as
      | { rules: AvailabilityRuleResponse[]; blockedTimes: BlockedTimeResponse[] }
      | undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useProviderSlots(
  providerProfileId?: string,
  from?: string,
  to?: string,
) {
  const query = useQuery({
    queryKey: ["providerSlots", providerProfileId, from, to],
    queryFn: () =>
      availability.getProviderAvailableSlots(providerProfileId!, {
        from: from!,
        to: to!,
      }),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    enabled: Boolean(providerProfileId && from && to),
    ...queryDefaults,
  });

  return {
    data: query.data as AvailabilitySlotResponse[] | undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useReplaceProviderAvailability(providerId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AvailabilityScheduleType) =>
      availability.replaceProviderAvailability(providerId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providerAvailability", providerId],
      });
    },
  });

  return {
    replaceAvailability: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
