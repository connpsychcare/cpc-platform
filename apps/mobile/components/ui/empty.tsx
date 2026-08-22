import { Text, View } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Empty({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return (
    <View
      className={cn(
        "items-center justify-center gap-5 rounded-[28px] border border-dashed border-border p-6",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyHeader({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("items-center gap-2", className)} {...props} />;
}

export function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof View> & {
  className?: string;
  variant?: "default" | "icon";
}) {
  return (
    <View
      className={cn(
        "items-center justify-center",
        variant === "icon" && "mb-2 size-12 rounded-2xl bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyTitle({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text className={cn("font-primary text-lg text-foreground", className)} {...props} />
  );
}

export function EmptyDescription({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn(
        "font-secondary text-center text-sm leading-6 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyContent({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("w-full items-center gap-4", className)} {...props} />;
}
