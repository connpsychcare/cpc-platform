import { useState, useMemo } from "react";
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
import { useAppointments } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";
import {
  formatStatusLabel,
  getAppointmentStatusMeta,
} from "@/lib/patient-status";
import { useThemeColor } from "@/lib/theme";

type FilterOption = "all" | "upcoming" | "completed" | "cancelled";

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
      <Text style={{ fontSize: 12, fontWeight: "500", color: active ? activeText : inactiveText }}>
        {label}
      </Text>
    </Pressable>
  );
}

function AppointmentListSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export function InternalAppointmentsList({ rolePrefix }: { rolePrefix: string }) {
  const { data, isLoading } = useAppointments({});
  const [filter, setFilter] = useState<FilterOption>("all");
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();
  const borderColor = useThemeColor("border");
  const bg = useThemeColor("background");
  const muted = useThemeColor("muted", "foreground");
  const fg = useThemeColor("foreground");

  if (isLoading) return <AppointmentListSkeleton />;

  const all = data?.appointments ?? [];
  const upcoming = all.filter((a) => ["booked", "confirmed"].includes(a.status));
  const completed = all.filter((a) => a.status === "completed");
  const cancelled = all.filter((a) => ["cancelled", "noShow"].includes(a.status));

  const statusFiltered =
    filter === "upcoming"
      ? upcoming
      : filter === "completed"
        ? completed
        : filter === "cancelled"
          ? cancelled
          : all;

  const filtered = search.trim()
    ? statusFiltered.filter((a) => {
        const q = search.trim().toLowerCase();
        return (
          ((a as any).patient?.user?.displayName ?? "").toLowerCase().includes(q) ||
          ((a as any).provider?.user?.displayName ?? "").toLowerCase().includes(q)
        );
      })
    : statusFiltered;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-2">
            <Text className="font-primary text-3xl text-foreground">Appointments</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              View and manage all appointment records.
            </Text>
          </View>

          {/* Search */}
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
              value={search}
              onChangeText={setSearch}
              placeholder="Search by patient or provider…"
              placeholderTextColor={muted}
              style={{ flex: 1, fontSize: 14, color: fg, fontFamily: "Inter_400Regular" }}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {search.length > 0 ? (
              <Pressable onPress={() => setSearch("")}>
                <AppIcon name="XIcon" size="sm" variant="primary" />
              </Pressable>
            ) : null}
          </View>

          <View className="gap-4">
            <StatCard label="Upcoming" value={upcoming.length} icon="IconCalendarTime" iconVariant="info" />
            <StatCard label="Completed" value={completed.length} icon="CheckCircleIcon" iconVariant="success" />
            <StatCard label="Cancelled" value={cancelled.length} icon="XCircleIcon" iconVariant="destructive" />
          </View>

          <View className="flex-row flex-wrap gap-2">
            {(["all", "upcoming", "completed", "cancelled"] as FilterOption[]).map((f) => (
              <FilterChip
                key={f}
                label={f === "all" ? "All" : formatStatusLabel(f)}
                active={filter === f}
                onPress={() => setFilter(f)}
              />
            ))}
          </View>

          <SectionCard
            title="Appointments"
            description="Open any appointment to view details or update its status."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {filtered.length ? (
              filtered.map((appt) => {
                const status = getAppointmentStatusMeta(appt.status);
                const patientName =
                  (appt as any).patient?.user?.displayName ?? "Patient";
                const providerName =
                  (appt as any).provider?.user?.displayName ?? "Provider";

                return (
                  <GradientCard key={appt.id} variant={status.variant}>
                    <View className="gap-3">
                      <View className="flex-row items-center justify-between gap-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Badge variant="secondary">
                          {formatStatusLabel(appt.channel)}
                        </Badge>
                      </View>

                      <View className="flex-row items-center gap-3">
                        <AppIcon name="IconCalendarTime" size="sm" variant={status.variant as any} />
                        <View className="flex-1">
                          <Text className="font-body-semibold text-base text-foreground">
                            {patientName}
                          </Text>
                          <Text className="mt-0.5 font-secondary text-xs text-muted-foreground">
                            {providerName} · {formatDate(appt.scheduledStartAt, { mode: "date" })}{" "}
                            {formatDate(appt.scheduledStartAt, { mode: "time" })}
                          </Text>
                        </View>
                      </View>

                      <Button
                        href={`${rolePrefix}/appointments/${appt.id}` as any}
                        variant="secondary"
                        fullWidth
                      >
                        View details
                      </Button>
                    </View>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconCalendarTime" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No appointments</EmptyTitle>
                  <EmptyDescription>No appointments match the current filter.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
