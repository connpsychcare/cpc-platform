import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as business from "@workspace/sdk/business";
import * as provider from "@workspace/sdk/provider";
import { parseDuration } from "@workspace/shared/utils";
import type { ApiException } from "@workspace/sdk";
import type { BranchQueryType } from "@workspace/contracts/business";
import type { ProviderQueryType } from "@workspace/contracts/provider";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
} as const;



export function useProviders(params?: ProviderQueryType) {
  const query = useQuery({
    queryKey: ["providers", params],
    queryFn: () => provider.listProviders(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useBranches(params?: BranchQueryType) {
  const query = useQuery({
    queryKey: ["branches", params],
    queryFn: () => business.listBranches(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

