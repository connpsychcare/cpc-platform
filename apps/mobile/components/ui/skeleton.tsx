import { View } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("rounded-md bg-accent", className)} {...props} />;
}
