import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren, ReactNode } from "react";
import { useAppThemeColors, withAlpha } from "@/lib/theme";

export function Screen({
  children,
  stickyHeader,
  overlay,
  safeAreaEdges = ["top", "left", "right"],
}: PropsWithChildren<{
  stickyHeader?: ReactNode;
  overlay?: ReactNode;
  safeAreaEdges?: readonly Edge[];
}>) {
  const colors = useAppThemeColors();
  const bg = colors.background.base;
  const primaryTint = withAlpha(colors.primary.base, 0.07);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Subtle radial-like gradient from top-left - mirrors web body background */}
        <LinearGradient
          colors={[primaryTint, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.5 }}
          style={{ position: "absolute", inset: 0 } as any}
          pointerEvents="none"
        />
        <SafeAreaView edges={[...safeAreaEdges]} style={{ flex: 1 }}>
          {stickyHeader ? <View style={{ backgroundColor: "transparent" }}>{stickyHeader}</View> : null}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1 }}>{children}</View>
          </ScrollView>
          {overlay ? (
            <View pointerEvents="box-none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              {overlay}
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}
