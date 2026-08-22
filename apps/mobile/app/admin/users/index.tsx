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
import { useAdminUsers } from "@/hooks/use-healthcare";
import { getInitials } from "@workspace/shared/utils";
import { useThemeColor } from "@/lib/theme";

const ROLE_VARIANTS: Record<string, AppUIVariant> = {
  provider: "primary",
  staff: "info",
  patient: "secondary",
};

const ROLE_CARD_VARIANTS: Record<string, AppUIVariant> = {
  provider: "primary",
  staff: "info",
  patient: "secondary",
};

type RoleFilter = "all" | "provider" | "staff" | "patient";

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
        placeholder="Search users…"
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

function UsersSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-10 w-full rounded-2xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

const ROLE_FILTERS: RoleFilter[] = ["all", "provider", "staff", "patient"];

export default function AdminUsersRoute() {
  const { data, isLoading } = useAdminUsers({ limit: 100 });
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  if (isLoading) return <UsersSkeleton />;

  const users = data?.users ?? [];
  const activeCount = users.filter((u) => (u as any).status === "active").length;

  const filtered = useMemo(() => {
    let list = users;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.displayName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.includes(q),
      );
    }
    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }
    return list;
  }, [users, search, roleFilter]);

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
            <Text className="font-primary text-3xl text-foreground">Users</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              {users.length} account{users.length !== 1 ? "s" : ""} · {activeCount} active
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard label="Total" value={users.length} icon="IconUsers" iconVariant="primary" />
            </View>
            <View className="flex-1">
              <StatCard label="Active" value={activeCount} icon="CheckCircleIcon" iconVariant="success" />
            </View>
          </View>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Role Filters */}
          <View className="flex-row flex-wrap gap-2">
            {ROLE_FILTERS.map((f) => (
              <FilterChip
                key={f}
                label={f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                active={roleFilter === f}
                onPress={() => setRoleFilter(f)}
              />
            ))}
          </View>

          {/* List */}
          <SectionCard
            title={`Accounts (${filtered.length})`}
            description="View and manage all registered users."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {filtered.length ? (
              filtered.map((u) => {
                const initials = getInitials(u.displayName);
                const isActive = (u as any).status === "active";
                const cardVariant = ROLE_CARD_VARIANTS[u.role] ?? "secondary";
                const roleVariant = ROLE_VARIANTS[u.role] ?? "secondary";

                return (
                  <GradientCard key={u.id} variant={cardVariant}>
                    <View className="gap-3">
                      {/* Top row: role badge + status badge */}
                      <View className="flex-row items-center justify-between gap-2">
                        <Badge variant={roleVariant}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </Badge>
                        <Badge variant={isActive ? "success" : "outline"}>
                          {(u as any).status ?? "unknown"}
                        </Badge>
                      </View>

                      {/* Middle: avatar + info */}
                      <View className="flex-row items-center gap-3">
                        <View className="flex-center size-12 rounded-full bg-primary/10">
                          <Text className="font-primary text-sm text-primary">{initials}</Text>
                        </View>
                        <View className="flex-1 gap-0.5">
                          <Text className="font-body-semibold text-base text-foreground">
                            {u.displayName}
                          </Text>
                          {u.email ? (
                            <Text className="font-secondary text-xs text-muted-foreground" numberOfLines={1}>
                              {u.email}
                            </Text>
                          ) : null}
                          {u.phone ? (
                            <Text className="font-secondary text-xs text-muted-foreground">
                              {u.phone}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      {/* Bottom: action button */}
                      <Button
                        href={`/admin/users/${u.id}` as any}
                        variant="secondary"
                        fullWidth
                      >
                        View Profile
                      </Button>
                    </View>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconUsers" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{search ? "No users match" : "No users found"}</EmptyTitle>
                  <EmptyDescription>
                    {search ? "Try a different name or email." : "No accounts match the current filter."}
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
