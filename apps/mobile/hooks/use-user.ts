import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfileType } from "@workspace/contracts/user";
import { signOut } from "@workspace/sdk/auth";
import {
  deleteMyAccount,
  getCurrentUser,
  updateProfile,
} from "@workspace/sdk/user";
import { parseDuration } from "@workspace/shared/utils";

import { useAuth } from "@/hooks/use-auth";

const STALE_TIME = parseDuration("15m");

export default function useUser(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const { isSuccess, isLoading } = useAuth({ enabled });
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: enabled && isSuccess,
    select: (res) => res.data,
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["patient", "me"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserProfileType) => updateProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["patient", "me"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
    },
  });

  return {
    currentUser: userQuery.data,
    isLoading: enabled ? userQuery.isLoading || isLoading : false,
    isFetching: userQuery.isFetching,
    fetchError: userQuery.error,
    refetchUser: userQuery.refetch,
    logoutUser: signOutMutation.mutateAsync,
    isLogoutPending: signOutMutation.isPending,
    logoutError: signOutMutation.error,
    updateProfile: updateMutation.mutateAsync,
    isUpdatePending: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteAccount: deleteMutation.mutateAsync,
    isDeletePending: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}
