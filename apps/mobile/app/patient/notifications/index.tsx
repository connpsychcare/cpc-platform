import { useEffect } from "react";
import { Text, View } from "react-native";
import * as Notifications from "expo-notifications";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientCard } from "@/components/shared/gradient-card";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotificationActions,
  useNotifications,
} from "@/hooks/use-notifications";
import { getNotificationIdentifier } from "@/app/_layout";
import { formatDate } from "@workspace/shared/utils";
import { formatStatusLabel } from "@/lib/patient-status";
import { resolveNotificationHref } from "@/lib/notification-routing";
import { useToast } from "@/providers/toast";

function NotificationListSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <View className="gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </View>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </View>
    </PatientScreen>
  );
}

function dismissFromTray(dbId: string) {
  const identifier = getNotificationIdentifier(dbId);
  if (identifier) {
    void Notifications.dismissNotificationAsync(identifier);
  }
}

export default function PatientNotificationsRoute() {
  const { error, success } = useToast();
  const { notifications, unreadCount, isLoading } = useNotifications();
  const { markAsReadAsync, isPending } = useNotificationActions();

  // Clear all tray entries when the user opens the notifications screen.
  useEffect(() => {
    void Notifications.dismissAllNotificationsAsync();
  }, []);

  const handleMarkAsRead = (id: string) => {
    void markAsReadAsync(id)
      .then(() => {
        dismissFromTray(id);
        success("Notification marked as read.");
      })
      .catch((cause: any) => {
        error("Could not update notification.", {
          description: cause?.message,
        });
      });
  };

  const handleOpenNotification = (notification: (typeof notifications)[number]) => {
    if (notification.readAt) return;
    handleMarkAsRead(notification.id);
  };

  if (isLoading) {
    return <NotificationListSkeleton />;
  }

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Notifications
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Track account updates, reminders, and important system messages.
          </Text>
        </View>

        <View className="gap-4">
          <StatCard
            label="Total Notifications"
            value={notifications.length}
            icon="BellIcon"
            iconVariant="primary"
          />
          <StatCard
            label="Unread"
            value={unreadCount}
            icon="BellIcon"
            iconVariant="warning"
          />
          <StatCard
            label="Read"
            value={notifications.length - unreadCount}
            icon="CheckCircleIcon"
            iconVariant="success"
          />
        </View>

        <SectionCard
          title="All notifications"
          description="Mark items as read once you’ve reviewed them."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {notifications.length ? (
            notifications.map((notification) => {
              const isUnread = !notification.readAt;
              const meta = (notification.meta ?? null) as
                | { actionUrl?: unknown; href?: unknown }
                | null;
              const href =
                resolveNotificationHref(meta?.actionUrl) ??
                resolveNotificationHref(meta?.href);

              return (
                <GradientCard
                  key={notification.id}
                  variant={isUnread ? "primary" : "success"}
                >
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-row items-center gap-2">
                        <AppIcon
                          name="BellIcon"
                          size="sm"
                          variant={isUnread ? "primary" : "success"}
                        />
                        <Badge variant={isUnread ? "primary" : "success"}>
                          {isUnread ? "Unread" : "Read"}
                        </Badge>
                        <Badge variant="secondary">
                          {formatStatusLabel(notification.purpose)}
                        </Badge>
                      </View>
                      <Text className="font-secondary text-xs text-muted-foreground">
                        {formatDate(notification.createdAt, {
                          mode: "datetime",
                        })}
                      </Text>
                    </View>

                    <View>
                      <Text className="font-body-semibold text-base text-foreground">
                        {notification.title}
                      </Text>
                      <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
                        {notification.message}
                      </Text>
                    </View>

                    <View className="ml-auto flex-row gap-2">
                      {href ? (
                        <Button
                          href={href as any}
                          variant="secondary"
                          size="sm"
                          onPress={() => handleOpenNotification(notification)}
                        >
                          View
                        </Button>
                      ) : null}
                      {isUnread ? (
                        <Button
                          variant="outline"
                          disabled={isPending}
                          size="sm"
                          onPress={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      ) : null}
                    </View>
                  </View>
                </GradientCard>
              );
            })
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="BellIcon" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No notifications yet</EmptyTitle>
                <EmptyDescription>
                  New account activity and reminders will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
