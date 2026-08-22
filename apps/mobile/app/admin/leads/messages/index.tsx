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
import { useContactMessages } from "@/hooks/use-healthcare";
import { formatDate, getInitials } from "@workspace/shared/utils";
import { useThemeColor } from "@/lib/theme";

type ReadFilter = "all" | "unread" | "read";

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
        placeholder="Search by name or email…"
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

function MessagesSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-10 w-full rounded-2xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export default function AdminContactMessagesRoute() {
  const { data, isLoading } = useContactMessages({ limit: 100 });
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");

  if (isLoading) return <MessagesSkeleton />;

  const messages = data?.messages ?? [];
  const unreadCount = messages.filter((m) => !(m as any).isRead).length;

  const filtered = useMemo(() => {
    let list = messages;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          (m as any).name?.toLowerCase().includes(q) ||
          (m as any).email?.toLowerCase().includes(q) ||
          (m as any).subject?.toLowerCase().includes(q) ||
          (m as any).message?.toLowerCase().includes(q),
      );
    }
    if (readFilter === "unread") list = list.filter((m) => !(m as any).isRead);
    else if (readFilter === "read") list = list.filter((m) => (m as any).isRead);
    return list;
  }, [messages, search, readFilter]);

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
            <Text className="font-primary text-3xl text-foreground">Contact Messages</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              {messages.length} message{messages.length !== 1 ? "s" : ""} · {unreadCount} unread
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard label="Total" value={messages.length} icon="MailIcon" iconVariant="primary" />
            </View>
            <View className="flex-1">
              <StatCard
                label="Unread"
                value={unreadCount}
                icon="BellIcon"
                iconVariant={unreadCount > 0 ? "warning" : "success"}
              />
            </View>
          </View>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Filter Chips */}
          <View className="flex-row flex-wrap gap-2">
            {(["all", "unread", "read"] as ReadFilter[]).map((f) => (
              <FilterChip
                key={f}
                label={f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                active={readFilter === f}
                onPress={() => setReadFilter(f)}
              />
            ))}
          </View>

          {/* List */}
          <SectionCard
            title={`Inbox (${filtered.length})`}
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {filtered.length ? (
              filtered.map((msg) => {
                const name = (msg as any).name ?? (msg as any).email ?? "Unknown";
                const email = (msg as any).email ?? null;
                const subject = (msg as any).subject ?? null;
                const body = (msg as any).message ?? null;
                const isRead = !!(msg as any).isRead;
                const initials = getInitials(name);

                return (
                  <GradientCard key={msg.id} variant={isRead ? "secondary" : "primary"}>
                    <View className="gap-3">
                      {/* Top row: badge + date - always same line, never overflow */}
                      <View className="flex-row items-center justify-between gap-2">
                        <Badge variant={isRead ? "outline" : "warning"}>
                          {isRead ? "Read" : "New"}
                        </Badge>
                        {(msg as any).createdAt ? (
                          <Text className="font-secondary text-[10px] text-muted-foreground">
                            {formatDate((msg as any).createdAt, { mode: "datetime" })}
                          </Text>
                        ) : null}
                      </View>

                      {/* Sender row: avatar + name + email */}
                      <View className="flex-row items-center gap-3">
                        <View className="flex-center size-10 rounded-full bg-primary/10">
                          <Text className="font-body-semibold text-xs text-primary">{initials}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-body-semibold text-sm text-foreground" numberOfLines={1}>
                            {name}
                          </Text>
                          {email && email !== name ? (
                            <Text className="font-secondary text-xs text-muted-foreground" numberOfLines={1}>
                              {email}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      {/* Content: subject + body preview */}
                      {subject ? (
                        <Text className="font-body-semibold text-xs text-foreground" numberOfLines={1}>
                          {subject}
                        </Text>
                      ) : null}
                      {body ? (
                        <Text className="font-secondary text-xs text-muted-foreground" numberOfLines={2}>
                          {body}
                        </Text>
                      ) : null}

                      {/* Action */}
                      <Button
                        href={`/admin/leads/messages/${msg.id}` as any}
                        variant="secondary"
                        fullWidth
                      >
                        View Message
                      </Button>
                    </View>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="MailIcon" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{search ? "No messages match" : "No messages"}</EmptyTitle>
                  <EmptyDescription>
                    {search ? "Try a different name or subject." : "No contact messages received yet."}
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
