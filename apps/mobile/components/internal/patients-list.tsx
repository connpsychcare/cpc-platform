import { useState, useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useInternalPatients } from "@/hooks/use-healthcare";
import { getInitials } from "@workspace/shared/utils";
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
        placeholder="Search patients…"
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

function PatientListSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-10 w-full rounded-2xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export function InternalPatientsList({
  rolePrefix,
  showAddButton = false,
}: {
  rolePrefix: string;
  showAddButton?: boolean;
}) {
  const { data, isLoading } = useInternalPatients();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const patients = data?.patients ?? [];

  const filtered = useMemo(() => {
    let list = patients;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.user?.displayName?.toLowerCase().includes(q) ||
          p.user?.email?.toLowerCase().includes(q) ||
          p.user?.phone?.includes(q),
      );
    }
    if (statusFilter === "active") {
      list = list.filter((p) => (p as any).status === "active");
    } else if (statusFilter === "inactive") {
      list = list.filter((p) => (p as any).status !== "active");
    }
    return list;
  }, [patients, search, statusFilter]);

  const activeCount = patients.filter((p) => (p as any).status === "active").length;

  if (isLoading) return <PatientListSkeleton />;

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
              <Text className="font-primary text-3xl text-foreground">Patients</Text>
              <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                {patients.length} patient{patients.length !== 1 ? "s" : ""} in your caseload.
              </Text>
            </View>
            {showAddButton ? (
              <Button href={`${rolePrefix}/patients/new` as any} variant="primary" size="sm">
                <AppIcon name="PlusIcon" size="sm" variant="accent" />
                New
              </Button>
            ) : null}
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard label="Total" value={patients.length} icon="IconUsers" iconVariant="primary" />
            </View>
            <View className="flex-1">
              <StatCard label="Active" value={activeCount} icon="CheckCircleIcon" iconVariant="success" />
            </View>
          </View>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Filters */}
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
            title={`Patients${filtered.length !== patients.length ? ` (${filtered.length})` : ""}`}
            description="Select a patient to view their profile and clinical summary."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {filtered.length ? (
              filtered.map((p) => {
                const name = p.user?.displayName ?? "Unknown Patient";
                const email = p.user?.email ?? "";
                const initials = getInitials(name);
                const isActive = (p as any).status === "active";

                return (
                  <GradientCard key={p.id} variant="info">
                    <View className="flex-row items-center gap-3">
                      <View className="flex-center size-11 rounded-full bg-primary/10">
                        <Text className="font-body-semibold text-sm text-primary">{initials}</Text>
                      </View>

                      <View className="flex-1 gap-0.5">
                        <Text className="font-body-semibold text-base text-foreground">{name}</Text>
                        {email ? (
                          <Text className="font-secondary text-xs text-muted-foreground">{email}</Text>
                        ) : null}
                        {(p as any).status ? (
                          <Badge
                            variant={isActive ? "success" : "secondary"}
                            className="mt-0.5 self-start"
                          >
                            {(p as any).status}
                          </Badge>
                        ) : null}
                      </View>

                      <Button
                        href={`${rolePrefix}/patients/${p.id}` as any}
                        variant="secondary"
                        size="sm"
                      >
                        View
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
                  <EmptyTitle>{search ? "No patients match your search" : "No patients found"}</EmptyTitle>
                  <EmptyDescription>
                    {search
                      ? "Try a different name or email."
                      : "Patients assigned to you will appear here."}
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
