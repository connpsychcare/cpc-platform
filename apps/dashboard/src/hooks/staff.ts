"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StaffProfileResponse } from "@workspace/contracts/staff";
import type { GrantStaffPermissionsType } from "@workspace/contracts/staff-permission";
import type { ApiException } from "@workspace/sdk";
import * as staff from "@workspace/sdk/staff";
import * as staffPermission from "@workspace/sdk/staff-permission";
import { parseDuration } from "@workspace/shared/utils";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export const {
  useEntity: useStaffMember,
  useEntities: useStaffList,
  useCreateEntity: useCreateStaffMember,
  useUpdateEntity: useUpdateStaffMember,
} = createCrudHooks(
  {
    findOne: staff.getStaff,
    findAll: staff.listStaff,
    create: staff.createStaff,
    update: staff.updateStaff,
  },
  {
    single: "staff",
    list: "staff",
  },
);

export function useStaffPermissions(staffId?: string) {
  const query = useQuery({
    queryKey: ["staff-permissions", staffId],
    queryFn: () => staffPermission.getStaffPermissions(staffId!),
    select: (res) => res.data,
    enabled: Boolean(staffId),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useSyncStaffPermissions(staffId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: GrantStaffPermissionsType) =>
      staffPermission.syncStaffPermissions(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-permissions", staffId] });
      queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
    },
  });

  return {
    syncAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useMyStaffProfile() {
  const query = useQuery({
    queryKey: ["staff", "me"],
    queryFn: staff.getMyStaffProfile,
    select: (res) => res.data as StaffProfileResponse,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}
