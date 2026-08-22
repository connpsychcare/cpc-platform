"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  StaffAssignmentType,
  StaffAssignmentQueryType,
} from "@workspace/contracts/staff-assignment";
import type { ApiException } from "@workspace/sdk";
import { parseDuration } from "@workspace/shared/utils";
import * as staffAssignmentSdk from "@workspace/sdk/staff-assignment";

const STALE_TIME = parseDuration("10m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useStaffAssignments(query?: Partial<StaffAssignmentQueryType>) {
  const q = useQuery({
    queryKey: ["staff-assignments", query],
    queryFn: () => staffAssignmentSdk.listStaffAssignments(query),
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

export function useStaffCaseload(staffId?: string) {
  const q = useQuery({
    queryKey: ["staff-caseload", staffId],
    queryFn: () =>
      staffAssignmentSdk.listStaffAssignments({
        staffId,
        isActive: true,
        limit: 100,
      } as any),
    select: (res) => res.data,
    enabled: Boolean(staffId),
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

export function useAssignPatients() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: StaffAssignmentType) =>
      staffAssignmentSdk.assignPatients(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["staff-caseload"] });
    },
  });
  return {
    assignAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useUnassignPatient() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      staffAssignmentSdk.unassignPatient(id, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["staff-caseload"] });
    },
  });
  return {
    unassignAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useDeleteStaffAssignment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => staffAssignmentSdk.deleteStaffAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["staff-caseload"] });
    },
  });
  return { deleteAsync: mutation.mutateAsync, isPending: mutation.isPending };
}
