import { useAuth } from "@/hooks/use-auth";
import useUser from "@/hooks/use-user";
import type { Href } from "expo-router";

type Role = "admin" | "provider" | "staff" | "patient";

export const SIGN_IN_ROUTE = {
  pathname: "/auth/[type]",
  params: { type: "sign-in" },
} as const satisfies Href;

/**
 * Shared auth + role guard for internal (admin/provider/staff) mobile layouts.
 * Returns loading state, auth errors, and whether the current user has the
 * expected role. Callers render redirects based on the returned flags.
 */
export function useInternalAuth(expectedRole: Role) {
  const { error, isLoading: isAuthLoading, isSuccess, refetch } = useAuth();
  const { currentUser, isLoading: isUserLoading } = useUser();

  const isLoading = isAuthLoading || isUserLoading;
  const isOffline = !isSuccess && (error?.status === 0 || error?.status == null && !!error);
  const isUnauthorized = !isLoading && !isOffline && !isSuccess;
  const hasWrongRole =
    !isLoading && isSuccess && !!currentUser && currentUser.role !== expectedRole;

  return {
    isLoading,
    isSuccess,
    isOffline,
    isUnauthorized,
    hasWrongRole,
    currentUser,
    error,
    refetch,
  };
}
