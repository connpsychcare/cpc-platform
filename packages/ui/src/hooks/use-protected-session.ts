"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

/**
 * Redirects to sign-in once the session resolves with no data, carrying the
 * error code/message through as query params. Shared by any shell that needs
 * an authenticated-only page, with or without the sidebar chrome.
 */
export function useProtectedSession() {
  const router = useRouter();
  const { data, isLoading, isSuccess, error } = useAuth();
  const isAuthError = error?.status === 401 || error?.status === 403 || !!error?.errorCode;
  const hasResolvedWithoutSession = !isLoading && !data;
  const shouldRedirect = hasResolvedWithoutSession;

  useEffect(() => {
    if (!shouldRedirect) return;

    const params = new URLSearchParams();

    if (error?.errorCode) {
      params.set("error", error.errorCode);
    }

    if (error?.message) {
      params.set("message", error.message);
    }

    const target = params.toString()
      ? `/auth/sign-in?${params.toString()}`
      : "/auth/sign-in";

    startTransition(() => {
      router.replace(target);
    });
  }, [error?.errorCode, error?.message, router, shouldRedirect]);

  const isPending =
    isLoading || shouldRedirect || (!data && !isSuccess && !isAuthError);

  return { session: data, isPending, isAuthError };
}
