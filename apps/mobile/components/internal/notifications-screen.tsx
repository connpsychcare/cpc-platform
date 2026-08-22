import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { InternalScreen } from "@/components/internal/internal-screen";
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
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

function dismissFromTray(dbId: string) {
  const identifier = getNotificationIdentifier(dbId);
  if (identifier) void Notifications.dismissNotificationAsync(identifier);
}

export function InternalNotifications() {
  const { error, success } = useToast();
  const { notifications, unreadCount, isLoading } = useNotifications();
  const { markAsReadAsync, isPending } = useNotificationActions();
  const insets = useSafeAreaInsets();

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
        error("Could not update notification.", { description: cause?.message });
      });
  };

  if (isLoading) return <NotificationListSkeleton />;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-2">
            <Text className="font-primary text-3xl text-foreground">Notifications</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              Track account updates, reminders, and system messages.
            </Text>
          </View>

          <View className="gap-4">
            <StatCard label="Total" value={notifications.length} icon="BellIcon" iconVariant="primary" />
            <StatCard label="Unread" value={unreadCount} icon="BellIcon" iconVariant="warning" />
            <StatCard
              label="Read"
              value={notifications.length - unreadCount}
              icon="CheckCircleIcon"
              iconVariant="success"
            />
          </View>

          <SectionCard
            title="All Notifications"
            description="Mark items as read once you've reviewed them."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {notifications.length ? (
              notifications.map((n) => {
                const isUnread = !n.readAt;
                const meta = (n.meta ?? null) as { actionUrl?: unknown; href?: unknown } | null;
                const href =
                  resolveNotificationHref(meta?.actionUrl) ??
                  resolveNotificationHref(meta?.href);

                return (
                  <GradientCard key={n.id} variant={isUnread ? "primary" : "success"}>
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
                          <Badge variant="secondary">{formatStatusLabel(n.purpose)}</Badge>
                        </View>
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {formatDate(n.createdAt, { mode: "datetime" })}
                        </Text>
                      </View>

                      <View>
                        <Text className="font-body-semibold text-base text-foreground">{n.title}</Text>
                        <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
                          {n.message}
                        </Text>
                      </View>

                      <View className="ml-auto flex-row gap-2">
                        {href ? (
                          <Button
                            href={href as any}
                            variant="secondary"
                            size="sm"
                            onPress={() => { if (isUnread) handleMarkAsRead(n.id); }}
                          >
                            View
                          </Button>
                        ) : null}
                        {isUnread ? (
                          <Button
                            variant="outline"
                            disabled={isPending}
                            size="sm"
                            onPress={() => handleMarkAsRead(n.id)}
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
                    Account activity and reminders will appear here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
