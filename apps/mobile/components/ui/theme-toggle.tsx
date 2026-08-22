import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "@/hooks/use-theme";
import { useAppThemeColors } from "@/lib/theme";

type ThemeToggleProps = {
  /** Overrides the glyph colour when placed on a surface that does not follow
   *  the page foreground, e.g. a dark hero. */
  color?: string;
};

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

/**
 * React Native twin of the web ThemeSwitch: one shadow/contrast glyph that
 * rotates 180 degrees on toggle while the theme's colours swap underneath, so
 * it reads as a "flip" without swapping icons.
 */
export function ThemeToggle({ color }: ThemeToggleProps) {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = useAppThemeColors();
  const isDark = colorScheme === "dark";
  const rotation = useSharedValue(isDark ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(isDark ? 180 : 0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [isDark, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const stroke = color ?? colors.foreground.base;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel="Toggle dark mode"
      onPress={toggleTheme}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <AnimatedSvg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={animatedStyle}
      >
        <Path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <Path d="M12 3l0 18" />
        <Path d="M12 9l4.65 -4.65" />
        <Path d="M12 14.3l7.37 -7.37" />
        <Path d="M12 19.6l8.85 -8.85" />
      </AnimatedSvg>
    </Pressable>
  );
}
