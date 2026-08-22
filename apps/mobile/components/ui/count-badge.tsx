import { View, Text } from "react-native";
import type { ViewProps, TextProps } from "react-native";

import { cn } from "@/lib/utils";

type CountBadgeProps = ViewProps & {
  count: number;
  max?: number;
  hiddenWhenZero?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: AppUIVariant;
  textProps?: TextProps;
};

const toneClasses = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  muted: "bg-muted",
  accent: "bg-accent",
  destructive: "bg-destructive",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  card: "bg-card",
} as const;

const textToneClasses = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent-foreground",
  destructive: "text-destructive-foreground",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  info: "text-info-foreground",
  card: "text-card-foreground",
} as const;

const sizeClasses = {
  sm: {
    container: "h-4 min-w-4 px-1 rounded-full",
    text: "text-[10px]",
  },
  md: {
    container: "h-5 min-w-5 px-1 rounded-full",
    text: "text-xs",
  },
  lg: {
    container: "h-6 min-w-6 px-1.5 rounded-full",
    text: "text-sm",
  },
} as const;

export function CountBadge({
  count,
  max = 99,
  hiddenWhenZero = true,
  size = "md",
  tone = "primary",
  className,
  textProps,
  ...props
}: CountBadgeProps) {
  if (hiddenWhenZero && count <= 0) return null;

  const displayValue = count > max ? `${max}+` : `${count}`;
  const sizeStyle = sizeClasses[size];

  return (
    <View
      className={cn(
        "items-center justify-center",
        toneClasses[tone],
        sizeStyle.container,
        className,
      )}
      {...props}
    >
      <Text
        className={cn(
          "text-center font-body-medium",
          textToneClasses[tone],
          sizeStyle.text,
        )}
        style={{
          includeFontPadding: false,
          textAlignVertical: "center",
        }}
        {...textProps}
      >
        {displayValue}
      </Text>
    </View>
  );
}
