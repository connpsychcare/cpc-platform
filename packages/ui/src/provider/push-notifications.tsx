"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  primeFirebaseMessaging,
  subscribeToForegroundMessages,
} from "@workspace/ui/lib/firebase";

/**
 * Mounts invisibly in DashboardLayout.
 * - Primes the SW so it's ready before the user enables push.
 * - Subscribes to foreground FCM messages and refreshes notification/dashboard queries.
 */
export default function PushNotificationsBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Fire-and-forget - failures are intentionally swallowed here.
    // Actionable errors surface when the user explicitly enables push.
    void primeFirebaseMessaging()
      .then(() =>
        subscribeToForegroundMessages(() => {
          void queryClient.invalidateQueries({ queryKey: ["notifications"] });
          void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }),
      )
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch(() => {});

    return () => unsubscribe?.();
  }, [queryClient]);

  return null;
}
