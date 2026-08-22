import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as auth from "@workspace/sdk/auth";
import type { ApiException } from "@workspace/sdk";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("5m");

export function useSession() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["sessions"],
    queryFn: auth.listSessions,
    select: (res) => res.data,
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => auth.revokeSession(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: auth.revokeAllSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return {
    sessions: query.data,
    isLoading: query.isLoading,
    fetchError: query.error as ApiException | null,
    revokeSession: revokeMutation.mutateAsync,
    isRevokePending: revokeMutation.isPending,
    revokeAllSessions: revokeAllMutation.mutateAsync,
    isRevokeAllPending: revokeAllMutation.isPending,
  };
}
