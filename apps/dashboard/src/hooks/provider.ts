"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ProviderProfileResponse,
  ProviderProfileType,
  ProviderQueryType,
} from "@workspace/contracts/provider";
import type { ApiException } from "@workspace/sdk";
import * as provider from "@workspace/sdk/provider";
import { parseDuration } from "@workspace/shared/utils";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

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

export function useProvider(id?: string) {
  const { currentUser } = useCurrentUser();
  const isSelfProfile = currentUser?.role === "staff" && !id;
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["provider", isSelfProfile ? "me" : id],
    queryFn: () =>
      isSelfProfile ? provider.getMyProviderProfile() : provider.getProvider(id!),
    select: (res) => res.data as ProviderProfileResponse,
    enabled: isSelfProfile || Boolean(id),
    ...queryDefaults,
  });

  const mutation = useMutation({
    mutationFn: (data: ProviderProfileType) =>
      query.data?.id
        ? provider.updateProvider(query.data.id, data)
        : provider.createProvider(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      queryClient.invalidateQueries({
        queryKey: ["provider", isSelfProfile ? "me" : id],
      });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}
