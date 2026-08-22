"use client";

import { useQuery } from "@tanstack/react-query";
import type { ClinicalFormQueryType } from "@workspace/contracts/clinical-form";
import type { ApiException } from "@workspace/sdk";
import * as clinicalFormSdk from "@workspace/sdk/clinical-form";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("10m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useClinicalForms(params?: ClinicalFormQueryType) {
  const query = useQuery({
    queryKey: ["clinical-forms", params],
    queryFn: () => clinicalFormSdk.listClinicalForms(params),
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

export function useClinicalForm(id?: string) {
  const query = useQuery({
    queryKey: ["clinical-form", id],
    queryFn: () => clinicalFormSdk.getClinicalForm(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}
