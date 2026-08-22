import { View } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof View> & {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <View
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}
