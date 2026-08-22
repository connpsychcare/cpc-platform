import { Pressable, View } from "react-native";
import type { ComponentProps } from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { useThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  checked = false,
  disabled,
  onCheckedChange,
  ...props
}: Omit<ComponentProps<typeof Pressable>, "onChange"> & {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const checkColor = useThemeColor("primary", "foreground");

  return (
    <Pressable
      accessibilityRole="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      className={cn(
        "size-5 items-center justify-center rounded border",
        checked ? "border-primary bg-primary" : "border-input bg-transparent",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {checked ? (
        <AppIcon name="CheckIcon" size="sm" color={checkColor} />
      ) : (
        <View />
      )}
    </Pressable>
  );
}
