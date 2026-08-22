import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "react-native";
import type { DimensionValue } from "react-native";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const logoDark = require("@/assets/images/logo-dark.png");
const logoLight = require("@/assets/images/logo-light.png");

type LogoProps = {
  size?: "sm" | "lg";
  variant?: "light" | "dark";
  className?: string;
  maxWidth?: DimensionValue;
};

export function Logo({ size = "sm", variant, className, maxWidth }: LogoProps) {
  const { colorScheme } = useTheme();
  const isDark = variant === "dark" || (variant === undefined && colorScheme === "dark");

  const iconSize = size === "sm" ? 48 : 60;
  const resolvedMaxWidth = maxWidth ?? (size === "sm" ? 200 : 240);

  return (
    <Button
      href="/"
      variant="link"
      className={cn(
        "min-h-0 shrink items-start justify-start border-0 px-0 py-0",
        className,
      )}
      style={{ maxWidth: resolvedMaxWidth, flexShrink: 1 }}
    >
      <View className="flex-row items-center gap-2">
        <Image
          source={isDark ? logoDark : logoLight}
          style={{ width: iconSize, height: iconSize }}
          contentFit="contain"
          transition={100}
        />

        <View className="flex-col" style={{ gap: 1 }}>
          <Text
            className="font-bold tracking-tight"
            style={{
              fontSize: size === "sm" ? 14 : 17,
              color: isDark ? "#ffffff" : "#0D1B3E",
              lineHeight: size === "sm" ? 17 : 21,
            }}
          >
            Connected,
          </Text>
          <Text
            className="font-semibold uppercase tracking-widest"
            style={{
              fontSize: size === "sm" ? 7 : 9,
              color: "#1659DB",
              lineHeight: size === "sm" ? 9 : 11,
              letterSpacing: 1.5,
            }}
          >
            Psychiatric Care
          </Text>
        </View>
      </View>
    </Button>
  );
}
