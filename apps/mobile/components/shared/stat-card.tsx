import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";
import { useAppThemeColors, withAlpha } from "@/lib/theme";
import { AppIconName } from "@/lib/icons";

type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  icon?: AppIconName;
  iconVariant?: AppUIVariant;
  helper?: ReactNode;
  action?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  labelVariant?: "description" | "title";
  valueInContent?: boolean;
  gradient?: boolean;
};

const iconBgMap: Record<AppUIVariant, string> = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/60",
  muted: "bg-muted",
  accent: "bg-accent/60",
  success: "bg-success/10",
  warning: "bg-warning/10",
  info: "bg-info/10",
  destructive: "bg-destructive/10",
};

const cardSoftBgMap: Record<AppUIVariant, string> = {
  primary: "border-primary/15",
  secondary: "border-secondary",
  muted: "border-muted",
  accent: "border-accent",
  success: "border-success/15",
  warning: "border-warning/15",
  info: "border-info/15",
  destructive: "border-destructive/15",
};

function useGradientColors(variant: AppUIVariant) {
  const colors = useAppThemeColors();
  const variantColor = colors[variant]?.base ?? colors.primary.base;
  const cardBase = colors.card.base;
  return [withAlpha(variantColor, 0.12), cardBase] as const;
}

export function StatCard({
  label,
  value,
  icon,
  iconVariant = "primary",
  helper,
  action,
  className,
  headerClassName,
  contentClassName,
  labelClassName,
  valueClassName,
  labelVariant = "description",
  valueInContent = false,
  gradient = true,
}: StatCardProps) {
  const gradientColors = useGradientColors(iconVariant);

  const defaultValueClassName =
    labelVariant === "description"
      ? "font-primary text-3xl tracking-tight text-foreground"
      : "font-primary text-2xl text-foreground";

  const renderLabel = () =>
    labelVariant === "title" ? (
      <CardTitle className={cn("text-base", labelClassName)}>{label}</CardTitle>
    ) : (
      <CardDescription className={labelClassName}>{label}</CardDescription>
    );

  const renderValue = () =>
    typeof value === "string" || typeof value === "number" ? (
      <Text className={cn(defaultValueClassName, valueClassName)}>{value}</Text>
    ) : (
      value
    );

  const iconEl = icon ? (
    <View
      className={cn(
        "size-11 items-center justify-center rounded-full",
        iconBgMap[iconVariant],
      )}
    >
      <AppIcon name={icon} size="sm" variant={iconVariant} />
    </View>
  ) : null;

  const cardClassName = cn(
    icon ? cardSoftBgMap[iconVariant] : "",
    gradient ? "overflow-hidden p-0" : "",
    className,
  );

  const cardContent = (
    <>
      <CardHeader className={headerClassName}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1.5">
            {renderLabel()}
            {!valueInContent ? renderValue() : null}
          </View>
          {iconEl ?? (action ? action : null)}
        </View>
      </CardHeader>
      {valueInContent || helper ? (
        <CardContent className={cn("gap-2", contentClassName)}>
          {valueInContent ? renderValue() : null}
          {typeof helper === "string" ? (
            <Text className="font-secondary text-sm text-muted-foreground">
              {helper}
            </Text>
          ) : (
            helper
          )}
        </CardContent>
      ) : null}
    </>
  );

  return (
    <Card className={cardClassName}>
      {gradient ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}
        >
          {cardContent}
        </LinearGradient>
      ) : (
        cardContent
      )}
    </Card>
  );
}
