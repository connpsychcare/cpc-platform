"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfileType } from "@workspace/contracts/user";
import { signOut } from "@workspace/sdk/auth";
import {
  deleteMyAccount,
  getCurrentUser,
  updateProfile,
} from "@workspace/sdk/user";
import { parseDuration } from "@workspace/shared/utils";
import { useAuth } from "./use-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SLATE_TIME = parseDuration("15m");

export const useCurrentUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isSuccess, isLoading } = useAuth();

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isSuccess,
    select: (res) => res.data,
    staleTime: SLATE_TIME,
    gcTime: SLATE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const signoutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
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

  const logout = async () => {
    try {
      await signoutMutation.mutateAsync();
      toast.success("Signed out successfully.");
    } catch {
      toast.error("Sign out failed.");
    }
    router.replace("/auth/sign-in");
  };

  return {
    currentUser: userQuery.data,
    isLoading: userQuery.isLoading || isLoading,
    isFetching: userQuery.isFetching,
    fetchError: userQuery.error,
    refetchUser: userQuery.refetch,

    logoutUser: logout,
    isLogoutPending: signoutMutation.isPending,

    updateProfile: updateMutation.mutateAsync,
    isUpdatePending: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteAccount: deleteMutation.mutateAsync,
    isDeletePending: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
