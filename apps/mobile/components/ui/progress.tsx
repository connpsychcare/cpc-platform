import { View } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Progress({
  className,
  value = 0,
  ...props
}: ComponentProps<typeof View> & { className?: string; value?: number }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <View
      className={cn("h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <View className="h-full rounded-full bg-primary" style={{ width: `${safeValue}%` }} />
    </View>
  );
}
