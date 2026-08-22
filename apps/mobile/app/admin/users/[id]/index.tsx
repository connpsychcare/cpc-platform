import { ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUser } from "@/hooks/use-healthcare";
import { formatDate, getInitials } from "@workspace/shared/utils";

const ROLE_VARIANTS = {
  admin: "destructive",
  author: "primary",
  staff: "info",
  patient: "secondary",
} as const satisfies Record<string, AppUIVariant>;

function UserDetailSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-56 w-full rounded-[28px]" />
      </View>
    </InternalScreen>
  );
}

export default function AdminUserDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const userId = Array.isArray(id) ? id[0] : id;
  const { data: u, isLoading } = useAdminUser(userId);
  const insets = useSafeAreaInsets();

  if (isLoading) return <UserDetailSkeleton />;
  if (!u) return null;

  const initials = getInitials(u.displayName);

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <Button variant="ghost" onPress={() => router.back()}>
            <AppIcon name="ArrowLeftIcon" size="sm" variant="secondary" />
            <Text className="font-secondary text-sm text-muted-foreground">Users</Text>
          </Button>

          {/* ── Header ─────────────────────────────────────────── */}
          <View className="flex-row items-center gap-4">
            <View className="flex-center size-16 rounded-full bg-primary/10">
              <Text className="font-primary text-xl text-primary">{initials}</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-primary text-2xl text-foreground">{u.displayName}</Text>
              <View className="flex-row gap-2">
                <Badge variant={ROLE_VARIANTS[u.role] ?? "secondary"}>{u.role}</Badge>
                <Badge variant={(u as any).status === "active" ? "success" : "outline"}>
                  {(u as any).status}
                </Badge>
              </View>
            </View>
          </View>

          {/* ── Account info ────────────────────────────────────── */}
          <SectionCard title="Account Info" className="shadow-soft">
            {[
              { label: "Email", value: u.email },
              { label: "Phone", value: u.phone },
              { label: "Role", value: u.role },
              { label: "Status", value: (u as any).status },
              { label: "Created", value: (u as any).createdAt ? formatDate((u as any).createdAt, { mode: "date" }) : null },
            ].map(({ label, value }) =>
              value ? (
                <View key={label} className="flex-row gap-3 py-2">
                  <Text className="w-24 font-secondary text-sm text-muted-foreground">{label}</Text>
                  <Text className="flex-1 font-secondary text-sm text-foreground">{value}</Text>
                </View>
              ) : null,
            )}
          </SectionCard>

          {(u as any).mfaEnabled ? (
            <SectionCard title="Security">
              <View className="flex-row items-center gap-2">
                <AppIcon name="ShieldCheckIcon" size="sm" variant="success" />
                <Text className="font-secondary text-sm text-foreground">MFA enabled</Text>
              </View>
            </SectionCard>
          ) : null}
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
