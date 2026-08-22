import { ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactMessage } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

export default function AdminContactMessageDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const msgId = Array.isArray(id) ? id[0] : id;
  const { data: msg, isLoading } = useContactMessage(msgId);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <InternalScreen>
        <View className="section-wrapper gap-6 pt-6">
          <Skeleton className="h-10 w-40 rounded-full" />
          <Skeleton className="h-64 w-full rounded-[28px]" />
        </View>
      </InternalScreen>
    );
  }
  if (!msg) return null;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <Button variant="ghost" onPress={() => router.back()}>
            <AppIcon name="ArrowLeftIcon" size="sm" variant="secondary" />
            <Text className="font-secondary text-sm text-muted-foreground">Messages</Text>
          </Button>

          <SectionCard
            title={(msg as any).subject ?? "Contact Message"}
            description={formatDate((msg as any).createdAt, { mode: "datetime" })}
            className="shadow-soft"
            contentClassName="gap-4"
          >
            {[
              { label: "From", value: (msg as any).name },
              { label: "Email", value: (msg as any).email },
              { label: "Phone", value: (msg as any).phone },
            ].map(({ label, value }) =>
              value ? (
                <View key={label} className="flex-row gap-3 py-1">
                  <Text className="w-16 font-secondary text-sm text-muted-foreground">{label}</Text>
                  <Text className="flex-1 font-secondary text-sm text-foreground">{value}</Text>
                </View>
              ) : null,
            )}
            <Separator />
            <Text className="font-secondary text-sm leading-6 text-foreground">
              {(msg as any).message}
            </Text>
          </SectionCard>

          {(msg as any).reply ? (
            <SectionCard title="Reply Sent" className="bg-success/10">
              <Text className="font-secondary text-sm leading-6 text-foreground">
                {(msg as any).reply}
              </Text>
            </SectionCard>
          ) : null}
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
