import { View } from "react-native";
import { appIconMap, type AppIconName } from "@/lib/icons";
import { useAppThemeColors } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type AppIconVariant = AppUIVariant;
export type AppIconAppearance = Extract<AppUIAppearance, "solid" | "soft">;
export type AppIconMode = "wrap" | "plain";
export type AppIconWrapperSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<
  AppIconWrapperSize,
  {
    icon: number;
    container: number;
    radius: number;
  }
> = {
  sm: {
    icon: 14,
    container: 32,
    radius: 12,
  },
  md: {
    icon: 18,
    container: 40,
    radius: 16,
  },
  lg: {
    icon: 20,
    container: 48,
    radius: 18,
  },
};

export type AppIconProps = {
  name: AppIconName;
  size?: AppIconWrapperSize;
  variant?: AppIconVariant;
  appearance?: AppIconAppearance;
  mode?: AppIconMode;
  color?: string;
  strokeWidth?: number;
  wrapperClassName?: string;
};

export function AppIcon({
  name,
  size = "md",
  variant = "primary",
  appearance = "soft",
  mode = "plain",
  color,
  strokeWidth = 1.75,
  wrapperClassName,
}: AppIconProps) {
  const colors = useAppThemeColors();
  const scale = colors[variant];
  const Icon = appIconMap[name];
  const sizing = SIZE_MAP[size];

  const iconColor =
    color ?? (appearance === "solid" ? scale.foreground : scale.base);

  if (mode === "plain") {
    return (
      <Icon size={sizing.icon} color={iconColor} strokeWidth={strokeWidth} />
    );
  }

  const backgroundColor = appearance === "solid" ? scale.base : scale.soft;

  return (
    <View
      className={cn("items-center justify-center", wrapperClassName)}
      style={{
        width: sizing.container,
        height: sizing.container,
        borderRadius: sizing.radius,
        backgroundColor,
      }}
    >
      <Icon size={sizing.icon} color={iconColor} strokeWidth={strokeWidth} />
    </View>
  );
}
