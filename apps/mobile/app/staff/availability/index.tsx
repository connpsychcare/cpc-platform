import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AppIcon } from "@/components/ui/app-icon";
import { useMyProviderProfile, useMyProviderAvailability } from "@/hooks/use-healthcare";

const WEEKDAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const WEEKDAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

function AvailabilitySkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-64 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
      </View>
    </InternalScreen>
  );
}

export default function ProviderAvailabilityRoute() {
  const { data: profile, isLoading: profileLoading } = useMyProviderProfile();
  const { data: schedule, isLoading: scheduleLoading } = useMyProviderAvailability(profile?.id);
  const insets = useSafeAreaInsets();

  if (profileLoading || scheduleLoading) return <AvailabilitySkeleton />;

  const rules = schedule?.rules ?? [];
  const blocked = schedule?.blockedTimes ?? [];

  // Group rules by weekday
  const byDay: Record<string, typeof rules> = {};
  for (const rule of rules) {
    const day = (rule as any).weekday?.toLowerCase() ?? "unknown";
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(rule);
  }

  const activeDays = WEEKDAY_ORDER.filter((d) => byDay[d]?.length);

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-1">
            <Text className="font-primary text-3xl text-foreground">Availability</Text>
            <Text className="font-secondary text-sm text-muted-foreground">
              Your weekly schedule and blocked times.
            </Text>
          </View>

          {/* ── Weekly schedule ─────────────────────────────────── */}
          <SectionCard title="Weekly Schedule" className="shadow-soft" contentClassName="gap-3">
            {activeDays.length ? (
              activeDays.map((day) => (
                <View key={day} className="gap-1">
                  <Text className="font-body-semibold text-sm text-foreground">
                    {WEEKDAY_LABELS[day] ?? day}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {byDay[day].map((rule) => (
                      <Badge
                        key={rule.id}
                        variant={(rule as any).isActive ? "success" : "secondary"}
                      >
                        {(rule as any).startTime} – {(rule as any).endTime}
                        {(rule as any).slotDurationMinute
                          ? ` (${(rule as any).slotDurationMinute}m slots)`
                          : ""}
                      </Badge>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="CalendarDaysIcon" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No availability set</EmptyTitle>
                  <EmptyDescription>
                    Configure your weekly schedule from the web dashboard.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>

          {/* ── Blocked times ───────────────────────────────────── */}
          {blocked.length > 0 ? (
            <SectionCard title="Blocked Times" contentClassName="gap-3">
              {blocked.map((b) => (
                <View key={b.id} className="gap-1 rounded-2xl border border-border p-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-body-semibold text-sm text-foreground">
                      {new Date((b as any).startAt).toLocaleDateString()}
                    </Text>
                    <Badge variant="destructive">Blocked</Badge>
                  </View>
                  <Text className="font-secondary text-xs text-muted-foreground">
                    {new Date((b as any).startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" – "}
                    {new Date((b as any).endAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                  {(b as any).reason ? (
                    <Text className="font-secondary text-xs text-muted-foreground">
                      {(b as any).reason}
                    </Text>
                  ) : null}
                </View>
              ))}
            </SectionCard>
          ) : null}
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
