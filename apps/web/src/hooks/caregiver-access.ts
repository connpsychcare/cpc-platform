"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseDuration } from "@workspace/shared/utils";
import type {
  SendCaregiverInvitationType,
  CaregiverInvitationQueryType,
} from "@workspace/contracts/caregiver-access";
import {
  getMyCaregiverAccesses,
  getMyProfileCaregivers,
  getMyInvitations,
  sendCaregiverInvitation,
  listCaregiverInvitations,
  getCaregiverInvitationByToken,
  acceptCaregiverInvitation,
  rejectCaregiverInvitation,
  revokeCaregiverInvitation,
  revokeCaregiverAccess,
} from "@workspace/sdk/caregiver-access";
import type { ApiException } from "@workspace/sdk";

const STALE_TIME = parseDuration("10m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

/** As a caregiver: patients I can access */
export function useMyCaregiverPatients() {
  const query = useQuery({
    queryKey: ["caregiver-access", "mine"],
    queryFn: getMyCaregiverAccesses,
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

/** As a patient: caregivers who can access my care record */
export function useMyProfileCaregivers() {
  const q = useQuery({
    queryKey: ["caregiver-access", "my-profile"],
    queryFn: getMyProfileCaregivers,
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

/** As a patient: invitations I've sent for my own profile */
export function useMyPatientInvitations() {
  const q = useQuery({
    queryKey: ["caregiver-invitations", "my-patient"],
    queryFn: getMyInvitations,
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

export function useMyCaregiverInvitations(query?: CaregiverInvitationQueryType) {
  const q = useQuery({
    queryKey: ["caregiver-invitations", "mine", query],
    queryFn: () => listCaregiverInvitations(query),
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

export function useCaregiverInvitationByToken(token?: string) {
  const q = useQuery({
    queryKey: ["caregiver-invitation-token", token],
    queryFn: () => getCaregiverInvitationByToken(token!),
    select: (res) => res.data,
    enabled: Boolean(token),
    ...queryDefaults,
  });
  return {
    data: q.data,
    isLoading: q.isLoading,
    fetchError: q.error as ApiException | null,
  };
}

export function useSendCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: SendCaregiverInvitationType) =>
      sendCaregiverInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-access", "my-profile"] });
    },
  });
  return {
    sendAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useAcceptCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (token: string) => acceptCaregiverInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-access"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
    },
  });
  return {
    acceptAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useRejectCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (token: string) => rejectCaregiverInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
    },
  });
  return {
    rejectAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useRevokeCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => revokeCaregiverInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-access", "my-profile"] });
    },
  });
  return {
    revokeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useRevokeCaregiverAccess() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => revokeCaregiverAccess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-access"] });
    },
  });
  return {
    revokeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
