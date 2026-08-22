import { Text } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn(
        "font-body-medium text-sm leading-none text-foreground",
        className,
      )}
      {...props}
    />
  );
}
