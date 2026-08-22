"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bell, BellRing, Check, CheckCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Badge } from "../components/badge";
import { Separator } from "../components/separator";
import { Skeleton } from "../components/skeleton";
import { cn } from "../lib/utils";
import {
  useNotificationActions,
  useNotifications,
} from "../hooks/use-notification";
import { formatDate } from "@workspace/shared/utils";
import SectionCard from "./SectionCard";

const formatDateTime = (value: string) =>
  formatDate(value, { mode: "datetime" });

interface NotificationsViewProps {
  /** Extra class applied to the outer wrapper */
  className?: string;
}

function closeSwNotification(tag: string) {
  if (typeof navigator === "undefined") return;
  navigator.serviceWorker?.controller?.postMessage({
    type: "CLOSE_NOTIFICATION",
    tag,
  });
}

export const NotificationsView = ({ className }: NotificationsViewProps) => {
  const { data, isLoading, unreadCount } = useNotifications();
  const {
    markAsReadAsync,
    isPending,
    pendingId,
    markAllAsReadAsync,
    isMarkingAllAsRead,
  } = useNotificationActions();

  // When the notifications page opens, close all browser tray entries that
  // correspond to notifications already loaded in the list.
  useEffect(() => {
    if (!data?.length) return;
    data.forEach((n) => closeSwNotification(n.id));
  }, [data]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadAsync();
      data?.forEach((n) => closeSwNotification(n.id));
      toast.success("All notifications marked as read.");
    } catch (error: any) {
      toast.error("Failed to update notifications", {
        description: error?.message,
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadAsync(id);
      closeSwNotification(id);
      toast.success("Notification marked as read.");
    } catch (error: any) {
      toast.error("Failed to update notification", {
        description: error?.message,
      });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-linear-to-br from-primary/10 to-card">
          <CardHeader>
            <CardDescription>Total Notifications</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {data?.length ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-warning/25 bg-linear-to-br from-warning/15 to-card">
          <CardHeader>
            <CardDescription>Unread</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {unreadCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-success/25 bg-linear-to-br from-success/15 to-card">
          <CardHeader>
            <CardDescription>Read</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {(data?.length ?? 0) - unreadCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <BellRing className="size-5" />
            Notifications
          </span>
        }
        description="Track security events, account updates, and important system messages."
        action={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
            >
              <Check className="size-4" />
              {isMarkingAllAsRead ? "Marking..." : "Mark all as read"}
            </Button>
          ) : undefined
        }
        contentClassName="space-y-4"
      >
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2 rounded-xl border p-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !data?.length && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
            <Bell className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                New account activity and system alerts will appear here.
              </p>
            </div>
          </div>
        )}

        {data?.map((notification) => {
          const isUnread = !notification.readAt;
          const actionUrl = (notification.meta as any)?.actionUrl as
            | string
            | undefined;

          return (
            <div
              key={notification.id}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                isUnread
                  ? "border-primary/30 bg-primary/5"
                  : "border-success/30 bg-success/5",
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={isUnread ? "default" : "secondary"}>
                      {isUnread ? "Unread" : "Read"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {notification.purpose}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Received {formatDateTime(notification.createdAt)}
                    </span>
                    {actionUrl && (
                      <Link
                        href={actionUrl}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        View
                      </Link>
                    )}
                  </div>
                </div>

                {isUnread && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending && pendingId === notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <CheckCheck className="size-4" />
                    Mark as read
                  </Button>
                )}
              </div>
              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground">
                Channels: {notification.channels.join(", ")}
              </div>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
};
