import { Pressable, ScrollView, Text, View } from "react-native";
import { type ComponentProps } from "react";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

export function Sidebar({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("flex-1 bg-card", className)} {...props} />;
}

export function SidebarInset({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("flex-1 bg-background", className)} {...props} />;
}

export function SidebarHeader({
  className,
  safeAreaClassName,
  safeAreaEdges = ["top"],
  withSafeArea = true,
  ...props
}: ComponentProps<typeof View> & {
  className?: string;
  safeAreaClassName?: string;
  safeAreaEdges?: readonly Edge[];
  withSafeArea?: boolean;
}) {
  const content = (
    <View
      className={cn("border-b border-border/60 px-5 pb-4 pt-5", className)}
      {...props}
    />
  );

  if (!withSafeArea) {
    return content;
  }

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      className={cn("bg-card", safeAreaClassName)}
    >
      {content}
    </SafeAreaView>
  );
}

export function SidebarContent({
  className,
  contentContainerClassName,
  ...props
}: ComponentProps<typeof ScrollView> & {
  className?: string;
  contentContainerClassName?: string;
}) {
  return (
    <ScrollView
      className={cn("flex-1", className)}
      contentContainerClassName={cn(
        "gap-6 px-3 py-4",
        contentContainerClassName,
      )}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  safeAreaClassName,
  safeAreaEdges = ["bottom"],
  withSafeArea = true,
  ...props
}: ComponentProps<typeof View> & {
  className?: string;
  safeAreaClassName?: string;
  safeAreaEdges?: readonly Edge[];
  withSafeArea?: boolean;
}) {
  const content = (
    <View
      className={cn("border-t border-border/60 px-3 pb-4 pt-4", className)}
      {...props}
    />
  );

  if (!withSafeArea) {
    return content;
  }

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      className={cn("bg-card", safeAreaClassName)}
    >
      {content}
    </SafeAreaView>
  );
}

export function SidebarGroup({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("gap-2", className)} {...props} />;
}

export function SidebarGroupLabel({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn(
        "px-3 font-body-semibold text-xs uppercase tracking-[2px] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenu({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("gap-1", className)} {...props} />;
}

export function SidebarMenuItem({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("", className)} {...props} />;
}

export function SidebarMenuButton({
  isActive = false,
  className,
  children,
  ...props
}: ComponentProps<typeof Pressable> & {
  isActive?: boolean;
  className?: string;
}) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-3 rounded-2xl px-3 py-3",
        isActive ? "bg-primary text-primary-foreground" : "bg-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}
