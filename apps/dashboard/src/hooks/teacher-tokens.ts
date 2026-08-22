import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parseDuration } from "@workspace/shared/utils";
import {
  listTeacherTokens,
  sendTeacherAssessmentToken,
  type SendTeacherTokenPayload,
} from "@workspace/sdk/onboarding";
import type { ApiException } from "@workspace/sdk";

const STALE_TIME = parseDuration("5m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useTeacherTokens(patientId?: string) {
  const query = useQuery({
    queryKey: ["teacher-tokens", patientId],
    queryFn: () => listTeacherTokens(patientId!),
    select: (res) => res.data,
    enabled: Boolean(patientId),
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

export function useSendTeacherToken(patientId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: SendTeacherTokenPayload) =>
      sendTeacherAssessmentToken(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-tokens", patientId] });
    },
  });
  return {
    sendAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
