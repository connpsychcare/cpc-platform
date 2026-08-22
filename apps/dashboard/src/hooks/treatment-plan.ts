"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiException } from "@workspace/sdk";
import { parseDuration } from "@workspace/shared/utils";
import * as behaviorProgramSdk from "@workspace/sdk/behavior-program";
import * as treatmentPlanSdk from "@workspace/sdk/treatment-plan";
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
  useEntity: useTreatmentPlan,
  useEntities: useTreatmentPlans,
  useCreateEntity: useCreateTreatmentPlan,
  useUpdateEntity: useUpdateTreatmentPlan,
  useDeleteEntity: useDeleteTreatmentPlan,
} = createCrudHooks(
  {
    findOne: treatmentPlanSdk.getTreatmentPlan,
    findAll: treatmentPlanSdk.listTreatmentPlans,
    create: treatmentPlanSdk.createTreatmentPlan,
    update: treatmentPlanSdk.updateTreatmentPlan,
    delete: treatmentPlanSdk.deleteTreatmentPlan,
  },
  {
    single: "treatment-plan",
    list: "treatment-plans",
  },
);

export const {
  useEntity: useBehaviorProgram,
  useEntities: useBehaviorPrograms,
  useCreateEntity: useCreateBehaviorProgram,
  useUpdateEntity: useUpdateBehaviorProgram,
  useDeleteEntity: useDeleteBehaviorProgram,
} = createCrudHooks(
  {
    findOne: behaviorProgramSdk.getBehaviorProgram,
    findAll: behaviorProgramSdk.listBehaviorPrograms,
    create: behaviorProgramSdk.createBehaviorProgram,
    update: behaviorProgramSdk.updateBehaviorProgram,
    delete: behaviorProgramSdk.deleteBehaviorProgram,
  },
  {
    single: "behavior-program",
    list: "behavior-programs",
  },
);

export function useBehaviorProgramProgress(id?: string) {
  const q = useQuery({
    queryKey: ["behavior-program-progress", id],
    queryFn: () => behaviorProgramSdk.getBehaviorProgramProgress(id!),
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
