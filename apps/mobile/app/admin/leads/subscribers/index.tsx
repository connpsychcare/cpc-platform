import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
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
import { useNewsletterSubscribers } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";
import { useThemeColor } from "@/lib/theme";

type StatusFilter = "all" | "active" | "inactive";

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const borderColor = useThemeColor("border");
  const bg = useThemeColor("background");
  const muted = useThemeColor("muted", "foreground");
  const fg = useThemeColor("foreground");
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor,
        backgroundColor: bg,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <AppIcon name="SearchIcon" size="sm" variant="primary" />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search by email…"
        placeholderTextColor={muted}
        style={{ flex: 1, fontSize: 14, color: fg, fontFamily: "Inter_400Regular" }}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChange("")}>
          <AppIcon name="XIcon" size="sm" variant="primary" />
        </Pressable>
      ) : null}
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const activeBg = useThemeColor("primary");
  const inactiveBg = useThemeColor("background");
  const activeBorder = useThemeColor("primary");
  const inactiveBorder = useThemeColor("border");
  const activeText = useThemeColor("primary", "foreground");
  const inactiveText = useThemeColor("muted", "foreground");
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: active ? activeBg : inactiveBg,
        borderColor: active ? activeBorder : inactiveBorder,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "500", color: active ? activeText : inactiveText }}>
        {label}
      </Text>
    </Pressable>
  );
}

function SubscribersSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-10 w-full rounded-2xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export default function AdminSubscribersRoute() {
  const { data, isLoading } = useNewsletterSubscribers({ limit: 100 });
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  if (isLoading) return <SubscribersSkeleton />;

  const subscribers = data?.subscribers ?? [];
  const activeCount = subscribers.filter((s) => (s as any).isActive !== false).length;
  const inactiveCount = subscribers.length - activeCount;

  const filtered = useMemo(() => {
    let list = subscribers;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.email?.toLowerCase().includes(q));
    }
    if (statusFilter === "active") list = list.filter((s) => (s as any).isActive !== false);
    else if (statusFilter === "inactive") list = list.filter((s) => (s as any).isActive === false);
    return list;
  }, [subscribers, search, statusFilter]);

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          {/* Header */}
          <View className="flex-1 gap-1">
            <Text className="font-primary text-3xl text-foreground">Newsletter</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""} · {activeCount} active
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard label="Total" value={subscribers.length} icon="MailIcon" iconVariant="primary" />
            </View>
            <View className="flex-1">
              <StatCard label="Active" value={activeCount} icon="CheckCircleIcon" iconVariant="success" />
            </View>
            {inactiveCount > 0 ? (
              <View className="flex-1">
                <StatCard label="Inactive" value={inactiveCount} icon="XIcon" iconVariant="secondary" />
              </View>
            ) : null}
          </View>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Filter Chips */}
          <View className="flex-row flex-wrap gap-2">
            {(["all", "active", "inactive"] as StatusFilter[]).map((f) => (
              <FilterChip
                key={f}
                label={f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                active={statusFilter === f}
                onPress={() => setStatusFilter(f)}
              />
            ))}
          </View>

          {/* List */}
          <SectionCard
            title={`Subscribers (${filtered.length})`}
            className="shadow-soft"
            contentClassName="gap-2"
          >
            {filtered.length ? (
              filtered.map((sub) => {
                const isActive = (sub as any).isActive !== false;
                return (
                  <GradientCard key={sub.id} variant={isActive ? "secondary" : "muted"}>
                    <View className="flex-row items-center gap-3">
                      <View className="size-9 rounded-full bg-primary/10 items-center justify-center">
                        <AppIcon name="MailIcon" size="sm" variant="primary" />
                      </View>

                      <View className="flex-1 gap-0.5">
                        <Text className="font-body-semibold text-sm text-foreground" numberOfLines={1}>
                          {sub.email}
                        </Text>
                        {(sub as any).createdAt ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            Subscribed {formatDate((sub as any).createdAt, { mode: "date" })}
                          </Text>
                        ) : null}
                      </View>

                      <Badge variant={isActive ? "success" : "outline"}>
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </View>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="MailIcon" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{search ? "No subscribers match" : "No subscribers"}</EmptyTitle>
                  <EmptyDescription>
                    {search ? "Try a different email." : "Nobody has subscribed to the newsletter yet."}
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
