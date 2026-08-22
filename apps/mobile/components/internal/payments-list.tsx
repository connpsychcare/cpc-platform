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
import { usePayments } from "@/hooks/use-healthcare";
import { formatDate, formatPrice } from "@workspace/shared/utils";
import { useThemeColor } from "@/lib/theme";

type StatusFilter = "all" | "succeeded" | "pending" | "failed" | "refunded";

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
        placeholder="Search by patient or reference…"
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

function PaymentListSkeleton() {
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

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  succeeded: "Succeeded",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export function InternalPaymentsList({ rolePrefix }: { rolePrefix: string }) {
  const { data, isLoading } = usePayments({});
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const payments = data?.payments ?? [];

  const filtered = useMemo(() => {
    let list = payments;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          ((p as any).patient?.user?.displayName ?? "").toLowerCase().includes(q) ||
          ((p as any).externalId ?? "").toLowerCase().includes(q) ||
          ((p as any).provider ?? "").toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    return list;
  }, [payments, search, statusFilter]);

  const succeeded = payments.filter((p) => p.status === "succeeded");
  const pending = payments.filter((p) => p.status === "pending");
  const failed = payments.filter((p) => p.status === "failed");
  const refunded = payments.filter((p) => p.status === "refunded");

  if (isLoading) return <PaymentListSkeleton />;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="font-primary text-3xl text-foreground">Payments</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              Review all payment records and their statuses.
            </Text>
          </View>

          {/* Stats */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard label="Succeeded" value={succeeded.length} icon="CheckCircleIcon" iconVariant="success" />
              </View>
              <View className="flex-1">
                <StatCard label="Pending" value={pending.length} icon="IconClockHour4" iconVariant="warning" />
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard label="Failed" value={failed.length} icon="XCircleIcon" iconVariant="destructive" />
              </View>
              <View className="flex-1">
                <StatCard label="Refunded" value={refunded.length} icon="IconCreditCard" iconVariant="info" />
              </View>
            </View>
          </View>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Filters */}
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((f) => (
              <FilterChip
                key={f}
                label={FILTER_LABELS[f]}
                active={statusFilter === f}
                onPress={() => setStatusFilter(f)}
              />
            ))}
          </View>

          {/* List */}
          <SectionCard
            title={`Payment Records${filtered.length !== payments.length ? ` (${filtered.length})` : ""}`}
            description="All payment transactions processed by the platform."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {filtered.length ? (
              filtered.map((p) => {
                const isSettled = p.status === "succeeded";
                const isFailed = p.status === "failed";
                const patientName = (p as any).patient?.user?.displayName;

                return (
                  <GradientCard
                    key={p.id}
                    variant={isSettled ? "success" : isFailed ? "destructive" : "info"}
                  >
                    <Button
                      href={`${rolePrefix}/payments/${p.id}` as any}
                      variant="ghost"
                      className="p-0"
                    >
                      <View className="flex-1 flex-row items-center gap-3">
                        <View className="flex-center size-11 rounded-2xl bg-primary/10">
                          <AppIcon
                            name="IconCreditCard"
                            size="sm"
                            variant={isSettled ? "success" : isFailed ? "destructive" : "primary"}
                          />
                        </View>

                        <View className="flex-1">
                          <Text className="font-body-semibold text-sm text-foreground">
                            {formatPrice((p as any).amount ?? 0)}
                          </Text>
                          {patientName ? (
                            <Text className="mt-0.5 font-secondary text-xs text-muted-foreground">
                              {patientName}
                            </Text>
                          ) : null}
                          <Text className="mt-0.5 font-secondary text-xs text-muted-foreground">
                            {(p as any).provider ?? "Manual"} · {formatDate((p as any).createdAt, { mode: "date" })}
                          </Text>
                        </View>

                        <Badge variant={isSettled ? "success" : isFailed ? "destructive" : "secondary"}>
                          {p.status}
                        </Badge>
                      </View>
                    </Button>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconCreditCard" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{search ? "No payments match your search" : "No payments"}</EmptyTitle>
                  <EmptyDescription>
                    {search ? "Try a different search term." : "Payment records will appear here."}
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
