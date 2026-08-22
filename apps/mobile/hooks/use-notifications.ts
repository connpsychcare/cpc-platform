import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllNotification, markAsRead } from "@workspace/sdk/notification";
import { parseDuration } from "@workspace/shared/utils";
import type { ApiException } from "@workspace/sdk";

const STALE_TIME = parseDuration("1m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchInterval: STALE_TIME,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: false,
  retry: false,
} as const;

export function useNotifications(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotification,
    enabled,
    select: (response) => response.data,
    ...queryDefaults,
  });

  const notifications = query.data ?? [];
  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as ApiException | null,
  };
}

export function useNotificationsSummary(options?: { enabled?: boolean }) {
  return useNotifications(options);
}

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "patient"] });
    },
  });

  return {
    markAsReadAsync: markAsReadMutation.mutateAsync,
    isPending: markAsReadMutation.isPending,
    mutateError: markAsReadMutation.error as ApiException | null,
  };
}
