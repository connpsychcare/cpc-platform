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
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { InternalScreen } from "@/components/internal/internal-screen";
import { useInternalStaff } from "@/hooks/use-healthcare";
import { getInitials } from "@workspace/shared/utils";
import { useThemeColor } from "@/lib/theme";

type StatusFilter = "all" | "active" | "inactive";

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
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
        placeholder={placeholder ?? "Search…"}
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

function StaffListSkeleton() {
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

export function InternalStaffList({ rolePrefix }: { rolePrefix: string }) {
  const { data, isLoading } = useInternalStaff({});
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  if (isLoading) return <StaffListSkeleton />;

  const members = data?.staff ?? [];
  const activeCount = members.filter((s) => s.isActive).length;

  const filtered = useMemo(() => {
    let list = members;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.user?.displayName?.toLowerCase().includes(q) ||
          s.user?.email?.toLowerCase().includes(q) ||
          (s as any).title?.toLowerCase().includes(q),
      );
    }
    if (statusFilter === "active") list = list.filter((s) => s.isActive);
    else if (statusFilter === "inactive") list = list.filter((s) => !s.isActive);
    return list;
  }, [members, search, statusFilter]);

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
              <Text className="font-primary text-3xl text-foreground">Staff</Text>
              <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                {members.length} member{members.length !== 1 ? "s" : ""} · {activeCount} active
              </Text>
            </View>
            {rolePrefix === "/admin" ? (
              <Button href={`${rolePrefix}/staff/new` as any} size="sm">
                <AppIcon name="PlusIcon" size="sm" variant="accent" />
                New
              </Button>
            ) : null}
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard label="Total Staff" value={members.length} icon="IconUsersGroup" iconVariant="primary" />
            </View>
            <View className="flex-1">
              <StatCard label="Active" value={activeCount} icon="CheckCircleIcon" iconVariant="success" />
            </View>
          </View>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff members…" />

          {/* Status Filters */}
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
            title={`Team Members (${filtered.length})`}
            description="View each staff member's profile and assigned permissions."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {filtered.length ? (
              filtered.map((s) => {
                const name = s.user?.displayName ?? "Staff Member";
                const initials = getInitials(name);
                const title = (s as any).title ?? null;
                const email = s.user?.email ?? null;
                const permCount = (s as any).permissions?.length ?? 0;

                return (
                  <GradientCard key={s.id} variant={s.isActive ? "info" : "secondary"}>
                    <Button
                      href={`${rolePrefix}/staff/${s.id}` as any}
                      variant="ghost"
                      className="p-0 flex-1"
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="flex-center size-11 rounded-full bg-primary/10">
                          <Text className="font-body-semibold text-sm text-primary">{initials}</Text>
                        </View>

                        <View className="flex-1 gap-0.5">
                          <Text className="font-body-semibold text-sm text-foreground">{name}</Text>
                          {title ? (
                            <Text className="font-secondary text-xs text-muted-foreground">{title}</Text>
                          ) : null}
                          {email ? (
                            <Text className="font-secondary text-xs text-muted-foreground">{email}</Text>
                          ) : null}
                          <View className="flex-row gap-1 flex-wrap mt-0.5">
                            <Badge variant={s.isActive ? "success" : "secondary"}>
                              {s.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {permCount > 0 ? (
                              <Badge variant="outline">{permCount} module{permCount !== 1 ? "s" : ""}</Badge>
                            ) : null}
                          </View>
                        </View>

                        <AppIcon name="ChevronRightIcon" size="sm" variant="primary" />
                      </View>
                    </Button>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconUsersGroup" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{search ? "No staff match" : "No staff members"}</EmptyTitle>
                  <EmptyDescription>
                    {search ? "Try a different name or title." : "Staff profiles created in the dashboard will appear here."}
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
