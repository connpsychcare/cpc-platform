"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SignInType } from "@workspace/contracts/auth";
import { ApiException, clearAuthExpired, getAuthExpiredDetail, onAuthExpired, type ApiError } from "@workspace/sdk";
import * as auth from "@workspace/sdk/auth";
import { parseDuration } from "@workspace/shared/utils";

const SLATE_TIME = parseDuration("14m");

export const useAuth = () => {
  const [terminalAuth, setTerminalAuth] = useState(() => getAuthExpiredDetail());

  useEffect(() => onAuthExpired(setTerminalAuth), []);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: auth.validateSession,
    enabled: !terminalAuth,
    retry: false,
    staleTime: SLATE_TIME,
    gcTime: Infinity,
    refetchInterval: SLATE_TIME,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });

  return {
    isLoading: terminalAuth ? false : query.isLoading,
    isSuccess: terminalAuth ? false : query.isSuccess,
    error: terminalAuth
      ? ({
          errorCode: terminalAuth.errorCode,
          message: terminalAuth.message,
          status: terminalAuth.status,
        } as ApiError)
      : (query.error as unknown as ApiError),
    data: query.data,
  };
};

export const useAuthActions = () => {
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: (data: SignInType) => auth.signIn(data),
    onSuccess: async () => {
      clearAuthExpired();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: auth.signOut,
    onSuccess: () => {
      clearAuthExpired();
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["patient", "me"] });
    },
  });

  return {
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isPending: signInMutation.isPending || signOutMutation.isPending,
    error:
      (signInMutation.error as ApiError | null) ??
      (signOutMutation.error as ApiError | null),
  };
};

export const useSession = () => {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: auth.listSessions,
    select: (res) => res.data,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: auth.revokeSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const revokeAllSessionsMutation = useMutation({
    mutationFn: auth.revokeAllSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return {
    sessions: sessionsQuery.data,
    isSessionsLoading: sessionsQuery.isLoading,
    revokeSession: revokeSessionMutation.mutateAsync,
    revokeAllSessions: revokeAllSessionsMutation.mutateAsync,
  };
};
