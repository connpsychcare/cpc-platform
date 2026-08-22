import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientCard } from "@/components/shared/gradient-card";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLogs } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

const ACTION_VARIANTS: Record<string, AppUIVariant> = {
  create: "success",
  update: "info",
  delete: "destructive",
  login: "primary",
  logout: "secondary",
};

function AuditLogsSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export default function AdminAuditLogsRoute() {
  const { data, isLoading } = useAuditLogs({ limit: 100 });
  const insets = useSafeAreaInsets();

  if (isLoading) return <AuditLogsSkeleton />;

  const logs = (data as any)?.logs ?? [];

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-1">
            <Text className="font-primary text-3xl text-foreground">Audit Logs</Text>
            <Text className="font-secondary text-sm text-muted-foreground">
              Recent {logs.length} system activity records
            </Text>
          </View>

          <SectionCard
            title="Activity Log"
            description="All tracked user actions in the system."
            className="shadow-soft"
            contentClassName="gap-2"
          >
            {logs.length ? (
              logs.map((log: any) => {
                const action = (log.action ?? "").toLowerCase();
                const variant = ACTION_VARIANTS[action] ?? "secondary";
                return (
                  <GradientCard key={log.id} variant="secondary">
                    <View className="flex-row items-start gap-3">
                      <AppIcon name="ClipboardListIcon" size="sm" variant={variant} />
                      <View className="flex-1 gap-0.5">
                        <View className="flex-row items-center gap-2">
                          <Badge variant={variant} className="self-start">{log.action}</Badge>
                          {log.resource ? (
                            <Text className="font-secondary text-xs text-muted-foreground">
                              {log.resource}
                            </Text>
                          ) : null}
                        </View>
                        {log.user?.displayName ? (
                          <Text className="font-secondary text-xs text-foreground">
                            {log.user.displayName}
                          </Text>
                        ) : null}
                        {log.createdAt ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            {formatDate(log.createdAt, { mode: "datetime" })}
                          </Text>
                        ) : null}
                        {log.description ? (
                          <Text className="font-secondary text-xs text-muted-foreground" numberOfLines={2}>
                            {log.description}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="ClipboardListIcon" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No audit logs</EmptyTitle>
                  <EmptyDescription>System activity will appear here once recorded.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
