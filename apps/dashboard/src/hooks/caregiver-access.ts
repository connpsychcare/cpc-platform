"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CaregiverAccessType,
  RevokeCaregiverAccessType,
  CaregiverAccessQueryType,
  CaregiverInvitationQueryType,
} from "@workspace/contracts/caregiver-access";
import type { ApiException } from "@workspace/sdk";
import { parseDuration } from "@workspace/shared/utils";
import * as caregiverSdk from "@workspace/sdk/caregiver-access";

const STALE_TIME = parseDuration("10m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useCaregiverAccesses(
  query?: Partial<CaregiverAccessQueryType>,
) {
  const q = useQuery({
    queryKey: ["caregiver-accesses", query],
    queryFn: () => caregiverSdk.listCaregiverAccesses(query),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });
  return {
    data: q.data,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    fetchError: q.error as ApiException | null,
  };
}

export function useCaregiverAccess(id?: string) {
  const q = useQuery({
    queryKey: ["caregiver-access", id],
    queryFn: () => caregiverSdk.getCaregiverAccess(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });
  return {
    data: q.data,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    fetchError: q.error as ApiException | null,
  };
}

export function useGrantCaregiverAccess() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CaregiverAccessType) =>
      caregiverSdk.grantCaregiverAccess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-accesses"] });
    },
  });
  return {
    grantAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useRevokeCaregiverAccess() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: RevokeCaregiverAccessType }) =>
      caregiverSdk.revokeCaregiverAccess(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-accesses"] });
    },
  });
  return {
    revokeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useDeleteCaregiverAccess() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => caregiverSdk.deleteCaregiverAccess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-accesses"] });
    },
  });
  return {
    deleteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useCaregiverInvitations(
  query?: Partial<CaregiverInvitationQueryType>,
) {
  const q = useQuery({
    queryKey: ["caregiver-invitations", query],
    queryFn: () => caregiverSdk.listCaregiverInvitations(query),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });
  return {
    data: q.data,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    fetchError: q.error as ApiException | null,
  };
}

export function useRevokeCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => caregiverSdk.revokeCaregiverInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
    },
  });
  return {
    revokeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
