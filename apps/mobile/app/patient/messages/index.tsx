import { useState } from "react";
import { Pressable, Text, View } from "react-native";

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
import { PatientScreen } from "@/components/shared/patient-screen";
import { GradientCard } from "@/components/shared/gradient-card";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";
import { useThemeColor } from "@/lib/theme";

type FilterOption = "all" | "unread";

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

function MessageListSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientMessagesRoute() {
  const { data: conversations, isLoading } = useConversations();
  const [filter, setFilter] = useState<FilterOption>("all");

  if (isLoading) {
    return <MessageListSkeleton />;
  }

  const list = conversations ?? [];
  const filtered =
    filter === "unread"
      ? list.filter((c) => ((c as any).unreadCount ?? 0) > 0)
      : list;

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Messages
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Conversations are linked to appointments. Open one below to continue
            the chat.
          </Text>
        </View>

        {list.length > 0 && (
          <View className="flex-row gap-2">
            <FilterChip
              label="All"
              active={filter === "all"}
              onPress={() => setFilter("all")}
            />
            <FilterChip
              label="Unread"
              active={filter === "unread"}
              onPress={() => setFilter("unread")}
            />
          </View>
        )}

        <SectionCard
          title="Conversations"
          description="Most recent conversation appears first."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {filtered.length ? (
            filtered.map((conv) => {
              const providerName =
                (conv as any).appointment?.provider?.user?.displayName ??
                "Care Team";
              const initials = providerName
                .split(" ")
                .map((part: string) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const lastMessage = (conv as any).lastMessage;
              const unreadCount: number = (conv as any).unreadCount ?? 0;
              const appointmentId = (conv as any).appointmentId;
              const lastTime =
                (conv as any).lastMessageAt ?? (conv as any).createdAt;

              return (
                <GradientCard key={conv.id} variant="info">
                  <View className="gap-3">
                    <View className="flex-row items-start gap-3">
                      <View className="relative">
                        <View className="flex-center size-11 rounded-full bg-primary/10">
                          <Text className="font-body-semibold text-sm text-primary">
                            {initials}
                          </Text>
                        </View>
                        {unreadCount > 0 ? (
                          <View className="absolute -right-1 -top-1 flex-center size-5 rounded-full bg-primary">
                            <Text className="font-body-semibold text-[10px] text-primary-foreground">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <View className="flex-1 gap-1">
                        <View className="flex-row items-center justify-between gap-3">
                          <Text className="font-body-semibold text-base text-foreground">
                            {providerName}
                          </Text>
                          {lastTime ? (
                            <Text className="font-secondary text-xs text-muted-foreground">
                              {formatDate(lastTime, { mode: "datetime" })}
                            </Text>
                          ) : null}
                        </View>

                        {lastMessage ? (
                          <Text
                            className="font-secondary text-sm text-muted-foreground"
                            numberOfLines={2}
                          >
                            {lastMessage.body}
                          </Text>
                        ) : (
                          <Text className="font-secondary text-sm italic text-muted-foreground">
                            No messages yet
                          </Text>
                        )}

                        {unreadCount > 0 ? (
                          <Badge variant="primary" className="self-start">
                            {unreadCount} unread
                          </Badge>
                        ) : null}
                      </View>
                    </View>

                    <Button
                      href={`/patient/appointments/${appointmentId}`}
                      variant={unreadCount > 0 ? "primary" : "info"}
                      size="sm"
                      className="ml-auto"
                    >
                      {unreadCount > 0 ? "Reply" : "Open chat"}
                    </Button>
                  </View>
                </GradientCard>
              );
            })
          ) : list.length > 0 ? (
            <View className="items-center gap-3 py-8">
              <Text className="font-secondary text-sm text-muted-foreground">
                No unread conversations
              </Text>
              <Button
                onPress={() => setFilter("all")}
                variant="outline"
                size="sm"
              >
                Show all
              </Button>
            </View>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconMessageCircle" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No conversations yet</EmptyTitle>
                <EmptyDescription>
                  Messages are available once you have a booked or confirmed
                  appointment.
                </EmptyDescription>
              </EmptyHeader>
              <Button href="/patient/appointments" variant="outline" fullWidth>
                View appointments
              </Button>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
