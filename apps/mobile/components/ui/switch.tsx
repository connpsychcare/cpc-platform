import { Switch as RNSwitch, View } from "react-native";
import type { ComponentProps } from "react";

import { useTheme } from "@/hooks/use-theme";
import { useAppThemeColors } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  size = "default",
  value,
  onValueChange,
  ...props
}: Omit<ComponentProps<typeof RNSwitch>, "style"> & {
  className?: string;
  size?: "sm" | "default";
}) {
  const { colorScheme } = useTheme();
  const colors = useAppThemeColors();
  const thumbColor =
    colorScheme === "dark" ? colors.foreground.base : colors.popover.base;

  return (
    <View className={cn(size === "sm" ? "scale-90" : "", className)}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        thumbColor={thumbColor}
        trackColor={{ false: colors.border.base, true: colors.primary.base }}
        {...props}
      />
    </View>
  );
}
