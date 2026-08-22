"use client";

import { useQuery } from "@tanstack/react-query";
import { parseDuration } from "@workspace/shared/utils";
import * as treatmentPlanSdk from "@workspace/sdk/treatment-plan";
import * as behaviorProgramSdk from "@workspace/sdk/behavior-program";
import type { TreatmentPlanQueryType } from "@workspace/contracts/treatment-plan";
import type { BehaviorProgramQueryType } from "@workspace/contracts/behavior-program";

const STALE_TIME = parseDuration("10m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useTreatmentPlans(params?: TreatmentPlanQueryType) {
  const query = useQuery({
    queryKey: ["treatment-plans", params],
    queryFn: () => treatmentPlanSdk.listTreatmentPlans(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function useTreatmentPlan(id?: string) {
  const query = useQuery({
    queryKey: ["treatment-plan", id],
    queryFn: () => treatmentPlanSdk.getTreatmentPlan(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function useBehaviorPrograms(params?: BehaviorProgramQueryType) {
  const query = useQuery({
    queryKey: ["behavior-programs", params],
    queryFn: () => behaviorProgramSdk.listBehaviorPrograms(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    enabled: Boolean(params?.treatmentPlanId),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function useBehaviorProgramProgress(id?: string) {
  const query = useQuery({
    queryKey: ["behavior-program-progress", id],
    queryFn: () => behaviorProgramSdk.getBehaviorProgramProgress(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
