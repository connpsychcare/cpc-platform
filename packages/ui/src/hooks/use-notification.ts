"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiException } from "@workspace/sdk";
import { createSseSubscription } from "@workspace/sdk";
import * as notification from "@workspace/sdk/notification";
import { parseDuration } from "@workspace/shared/utils";
import type { ConfigurePushNotificationsType } from "@workspace/contracts/notification";
import {
  deleteFirebasePushToken,
  getFirebasePushToken,
} from "@workspace/ui/lib/firebase";

// ─── Shared query config ──────────────────────────────────────────────────────

const QUERY_DEFAULTS = {
  staleTime: 0,
  gcTime: parseDuration("5m"),
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: parseDuration("1m"),
  retry: false,
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseNotificationsOptions {
  enabled?: boolean;
  /**
   * Suppress toast for `newChatMessage` notifications.
   * Set to `true` when the user is actively viewing a conversation.
   */
  suppressChatToast?: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useNotifications({
  enabled = true,
  suppressChatToast = false,
}: UseNotificationsOptions = {}) {
  const queryClient = useQueryClient();
  const prevUnreadRef = React.useRef(-1);

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: notification.getAllNotification,
    select: (res) => res.data,
    enabled,
    ...QUERY_DEFAULTS,
  });

  const data = query.data;
  const unreadCount = data?.filter((n) => !n.readAt).length ?? 0;

  // SSE - instant delivery from the server
  React.useEffect(() => {
    if (!enabled) return;

    let closed = false;
    let sub: { close(): void } | null = null;

    void createSseSubscription("/notifications/stream", (payload: any) => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }).then((s) => {
      if (closed) s.close();
      else sub = s;
    });

    return () => {
      closed = true;
      sub?.close();
    };
  }, [enabled, queryClient]);

  // In-app toast when new unread notifications arrive
  React.useEffect(() => {
    if (!data) return;

    if (prevUnreadRef.current >= 0 && unreadCount > prevUnreadRef.current) {
      const newest = data.find((n) => !n.readAt);
      if (
        newest &&
        (newest.purpose !== "newChatMessage" || !suppressChatToast)
      ) {
        toast(newest.title, { description: newest.message });
      }
    }

    prevUnreadRef.current = unreadCount;
  }, [data, unreadCount, suppressChatToast]);

  return {
    data,
    unreadCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException,
  };
}

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notification.markAsRead(id),
    onSuccess: invalidate,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notification.markAllAsRead(),
    onSuccess: invalidate,
  });

  const updatePushMutation = useMutation({
    mutationFn: configurePush,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });

  return {
    markAsReadAsync: markAsReadMutation.mutateAsync,
    isPending: markAsReadMutation.isPending,
    /**
     * Id of the notification currently being marked read. Without it every row
     * reads the shared isPending and the whole list disables on one click.
     */
    pendingId: markAsReadMutation.variables,
    mutateError: markAsReadMutation.error as ApiException | null,

    markAllAsReadAsync: markAllAsReadMutation.mutateAsync,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    updatePushNotificationsAsync: updatePushMutation.mutateAsync,
    isPushPending: updatePushMutation.isPending,
    pushError: updatePushMutation.error as ApiException | Error | null,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function configurePush(enabled: boolean) {
  if (enabled) {
    const token = await getFirebasePushToken();
    return notification.updatePushNotifications({
      enabled: true,
      token,
      provider: "fcm",
    });
  }

  await deleteFirebasePushToken();
  return notification.updatePushNotifications({
    enabled: false,
  } satisfies ConfigurePushNotificationsType);
}
