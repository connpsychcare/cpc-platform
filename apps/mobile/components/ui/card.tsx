import { Text, View } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type CardProps = ComponentProps<typeof View> & { className?: string };

export function Card({ className = "", ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-3xl border border-border bg-card py-5 shadow-soft",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: CardProps) {
  return <View className={cn("gap-2 px-5", className)} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn("font-primary text-lg leading-6 text-card-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn(
        "font-secondary text-sm leading-6 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardAction({ className = "", ...props }: CardProps) {
  return <View className={cn("self-start", className)} {...props} />;
}

export function CardContent({ className = "", ...props }: CardProps) {
  return <View className={cn("px-5", className)} {...props} />;
}

export function CardFooter({ className = "", ...props }: CardProps) {
  return <View className={cn("px-5 pt-4", className)} {...props} />;
}
