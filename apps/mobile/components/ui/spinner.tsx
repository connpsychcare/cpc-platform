import { ActivityIndicator } from "react-native";
import type { ComponentProps } from "react";

import { useThemeColor } from "@/lib/theme";

export function Spinner(props: ComponentProps<typeof ActivityIndicator>) {
  const color = useThemeColor("primary");
  return <ActivityIndicator color={color} {...props} />;
}
