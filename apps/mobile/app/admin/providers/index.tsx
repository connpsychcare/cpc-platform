import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProviders } from "@/hooks/use-healthcare";
import { getInitials } from "@workspace/shared/utils";
import { useThemeColor } from "@/lib/theme";

type AvailFilter = "all" | "available" | "unavailable";

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
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
        placeholder="Search providers…"
        placeholderTextColor={muted}
        style={{
          flex: 1,
          fontSize: 14,
          color: fg,
          fontFamily: "Inter_400Regular",
        }}
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

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
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
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          color: active ? activeText : inactiveText,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ProvidersSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-10 w-full rounded-2xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export default function AdminProvidersRoute() {
  const { data, isLoading } = useProviders({ limit: 50 });
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [availFilter, setAvailFilter] = useState<AvailFilter>("all");

  if (isLoading) return <ProvidersSkeleton />;

  const providers = data?.providers ?? [];
  const availableCount = providers.filter((d) => d.isAvailable).length;

  const filtered = useMemo(() => {
    let list = providers;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.user?.displayName?.toLowerCase().includes(q) ||
          d.user?.email?.toLowerCase().includes(q) ||
          d.title?.toLowerCase().includes(q) ||
          d.specialties?.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (availFilter === "available") list = list.filter((d) => d.isAvailable);
    else if (availFilter === "unavailable")
      list = list.filter((d) => !d.isAvailable);
    return list;
  }, [providers, search, availFilter]);

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          {/* Header */}
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-primary text-3xl text-foreground">
                Providers
              </Text>
              <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                {providers.length} provider{providers.length !== 1 ? "s" : ""} ·{" "}
                {availableCount} available
              </Text>
            </View>
            <Button href="/admin/providers/new" size="sm">
              <AppIcon name="PlusIcon" size="sm" variant="accent" />
              New
            </Button>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard
                label="Total"
                value={providers.length}
                icon="IconStethoscope"
                iconVariant="primary"
              />
            </View>
            <View className="flex-1">
              <StatCard
                label="Available"
                value={availableCount}
                icon="CheckCircleIcon"
                iconVariant="success"
              />
            </View>
          </View>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Filters */}
          <View className="flex-row flex-wrap gap-2">
            {(["all", "available", "unavailable"] as AvailFilter[]).map((f) => (
              <FilterChip
                key={f}
                label={
                  f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)
                }
                active={availFilter === f}
                onPress={() => setAvailFilter(f)}
              />
            ))}
          </View>

          {/* List */}
          <SectionCard
            title={`Providers${filtered.length !== providers.length ? ` (${filtered.length})` : ` (${providers.length})`}`}
            description="Tap a provider to view their profile and schedule."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {filtered.length ? (
              filtered.map((d) => {
                const name = d.user?.displayName ?? "Unknown";
                const initials = getInitials(name);
                return (
                  <GradientCard
                    key={d.id}
                    variant={d.isAvailable ? "success" : "secondary"}
                  >
                    <Button
                      href={`/admin/providers/${d.id}` as any}
                      variant="ghost"
                      className="p-0 flex-1"
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="flex-center size-11 rounded-full bg-primary/10">
                          <Text className="font-primary text-sm text-primary">
                            {initials}
                          </Text>
                        </View>
                        <View className="flex-1 gap-0.5">
                          <Text className="font-body-semibold text-sm text-foreground">
                            {name}
                          </Text>
                          {d.title ? (
                            <Text className="font-secondary text-xs text-muted-foreground">
                              {d.title}
                            </Text>
                          ) : null}
                          {d.specialties?.length ? (
                            <Text
                              className="font-secondary text-xs text-muted-foreground"
                              numberOfLines={1}
                            >
                              {d.specialties.join(" · ")}
                            </Text>
                          ) : null}
                          <View className="flex-row gap-1 flex-wrap mt-0.5">
                            <Badge
                              variant={d.isAvailable ? "success" : "secondary"}
                            >
                              {d.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                            {d.credentials?.length ? (
                              <Badge variant="outline">
                                {d.credentials[0]}
                              </Badge>
                            ) : null}
                          </View>
                        </View>
                        <AppIcon
                          name="ChevronRightIcon"
                          size="sm"
                          variant="primary"
                        />
                      </View>
                    </Button>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconStethoscope" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>
                    {search ? "No providers match" : "No providers added"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {search
                      ? "Try a different name or specialty."
                      : "Providers will appear here once added."}
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
