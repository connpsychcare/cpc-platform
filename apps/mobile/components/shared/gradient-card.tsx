import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useStatusGradients } from "@/lib/theme";

export function GradientCard({
  variant = "primary",
  children,
  style,
}: {
  variant?: string;
  children: ReactNode;
  style?: ViewProps["style"];
}) {
  const gradients = useStatusGradients();
  const colors = gradients[variant] ?? gradients.primary;
  return (
    <LinearGradient
      colors={colors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "transparent",
          padding: 16,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}
