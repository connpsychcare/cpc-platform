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
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrafficSources } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

function TrafficSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

function MetricPill({ label, count, variant }: { label: string; count: number; variant: AppUIVariant }) {
  if (!count) return null;
  return (
    <View className="flex-row items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
      <Badge variant={variant} className="text-[10px] px-1.5 py-0">{count}</Badge>
      <Text className="font-secondary text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}

export default function AdminTrafficRoute() {
  const { data, isLoading } = useTrafficSources({ limit: 100 });
  const insets = useSafeAreaInsets();

  if (isLoading) return <TrafficSkeleton />;

  const sources = data?.sources ?? [];

  const totalViews = sources.reduce((s: number, src: any) => s + (src.postViews?.length ?? 0), 0);
  const totalContacts = sources.reduce((s: number, src: any) => s + (src.contactMessages?.length ?? 0), 0);
  const totalConsults = sources.reduce((s: number, src: any) => s + (src.consultationRequests?.length ?? 0), 0);
  const totalSubs = sources.reduce((s: number, src: any) => s + (src.newsletterSubs?.length ?? 0), 0);

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          {/* Header */}
          <View>
            <Text className="font-primary text-3xl text-foreground">Traffic Sources</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              {sources.length} source{sources.length !== 1 ? "s" : ""} tracked
            </Text>
          </View>

          {sources.length ? (
            <>
              {/* Summary stats */}
              <View className="flex-row flex-wrap gap-3">
                <View className="flex-1 min-w-[44%]">
                  <StatCard label="Page Views" value={totalViews} icon="IconChartBar" iconVariant="primary" />
                </View>
                <View className="flex-1 min-w-[44%]">
                  <StatCard label="Contacts" value={totalContacts} icon="MailIcon" iconVariant="info" />
                </View>
                <View className="flex-1 min-w-[44%]">
                  <StatCard label="Consult Requests" value={totalConsults} icon="IconStethoscope" iconVariant="warning" />
                </View>
                <View className="flex-1 min-w-[44%]">
                  <StatCard label="Subscribers" value={totalSubs} icon="BellIcon" iconVariant="success" />
                </View>
              </View>

              {/* Sources list */}
              <SectionCard
                title={`Sources (${sources.length})`}
                description="Where visitors are coming from."
                className="shadow-soft"
                contentClassName="gap-3"
              >
                {sources.map((src: any) => {
                  const views = src.postViews?.length ?? 0;
                  const contacts = src.contactMessages?.length ?? 0;
                  const consults = src.consultationRequests?.length ?? 0;
                  const subs = src.newsletterSubs?.length ?? 0;
                  const totalActivity = views + contacts + consults + subs;

                  return (
                    <GradientCard key={src.id} variant="info">
                      <View className="gap-2.5">
                        <View className="flex-row items-start justify-between gap-2">
                          <View className="flex-row items-center gap-2 flex-1">
                            <View className="size-8 rounded-xl bg-primary/10 items-center justify-center">
                              <AppIcon name="IconChartBar" size="sm" variant="primary" />
                            </View>
                            <View className="flex-1">
                              <Text className="font-body-semibold text-sm text-foreground capitalize">
                                {src.source ?? "Unknown"}
                              </Text>
                              {src.referrer ? (
                                <Text className="font-secondary text-xs text-muted-foreground" numberOfLines={1}>
                                  {src.referrer}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                          <View className="items-end gap-1">
                            <Badge variant="secondary">{src.medium ?? "direct"}</Badge>
                            {totalActivity > 0 ? (
                              <Text className="font-secondary text-[10px] text-muted-foreground">
                                {totalActivity} total
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        {totalActivity > 0 ? (
                          <View className="flex-row flex-wrap gap-1.5">
                            <MetricPill label="views" count={views} variant="primary" />
                            <MetricPill label="contacts" count={contacts} variant="info" />
                            <MetricPill label="consults" count={consults} variant="warning" />
                            <MetricPill label="subs" count={subs} variant="success" />
                          </View>
                        ) : null}

                        {src.createdAt ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            First seen {formatDate(src.createdAt, { mode: "date" })}
                          </Text>
                        ) : null}
                      </View>
                    </GradientCard>
                  );
                })}
              </SectionCard>
            </>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconChartBar" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No traffic data</EmptyTitle>
                <EmptyDescription>Traffic sources will appear here once visitors start arriving.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
