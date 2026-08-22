"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiSuccess } from "@workspace/sdk";
import type {
  AdminDashboardOverview,
  ProviderDashboardOverview,
  StaffDashboardOverview,
} from "@workspace/contracts/dashboard";
import {
  getAdminDashboard,
  getProviderDashboard,
  getStaffDashboard,
} from "@workspace/sdk/dashboard";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("5m");

const queryDefaults = {
  staleTime: 0,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  retry: false,
};

export function useAdminDashboard() {
  const { data, isLoading, isFetching, error } = useQuery<
    ApiSuccess<AdminDashboardOverview>,
    Error,
    AdminDashboardOverview
  >({
    queryKey: ["dashboard", "admin"],
    queryFn: getAdminDashboard,
    select: (res) => res.data,
    ...queryDefaults,
  });

  return { data, isLoading, isFetching, error };
}

export function useProviderDashboard() {
  const { data, isLoading, isFetching, error } = useQuery<
    ApiSuccess<ProviderDashboardOverview>,
    Error,
    ProviderDashboardOverview
  >({
    queryKey: ["dashboard", "staff"],
    queryFn: getProviderDashboard,
    select: (res) => res.data,
    ...queryDefaults,
  });

  return { data, isLoading, isFetching, error };
}

export function useStaffDashboard() {
  const { data, isLoading, isFetching, error } = useQuery<
    ApiSuccess<StaffDashboardOverview>,
    Error,
    StaffDashboardOverview
  >({
    queryKey: ["dashboard", "staff"],
    queryFn: getStaffDashboard,
    select: (res) => res.data,
    ...queryDefaults,
  });

  return { data, isLoading, isFetching, error };
}
