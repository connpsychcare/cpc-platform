import { View, Dimensions } from "react-native";
import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { useAppThemeColors, withAlpha } from "@/lib/theme";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PLUS_POINTS = [
  { left: 0.2, top: 0.2 },
  { left: 0.34, top: 0.42 },
  { left: 0.58, top: 0.24 },
  { left: 0.74, top: 0.38 },
  { left: 0.84, top: 0.62 },
];

function GridBackground({ stroke }: { stroke: string }) {
  return (
    <View className="absolute inset-0 opacity-50">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="grid"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <Line
              x1="0"
              y1="0"
              x2="72"
              y2="0"
              stroke={stroke}
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2="72"
              stroke={stroke}
              strokeWidth="1"
            />
          </Pattern>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
      </Svg>
    </View>
  );
}

function IntersectionPluses({
  height,
  stroke,
}: {
  height: number;
  stroke: string;
}) {
  return (
    <View className="absolute inset-0">
      <Svg width="100%" height="100%">
        {PLUS_POINTS.map((item, i) => {
          const x = SCREEN_WIDTH * item.left;
          const y = height * item.top;
          const size = 32;
          const half = size / 2;

          return (
            <React.Fragment key={i}>
              <Line
                x1={x}
                y1={y - half}
                x2={x}
                y2={y + half}
                stroke={stroke}
                strokeWidth="1"
              />
              <Line
                x1={x - half}
                y1={y}
                x2={x + half}
                y2={y}
                stroke={stroke}
                strokeWidth="1"
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

function BottomFade({ colors }: { colors: readonly [string, string, string] }) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={colors}
      locations={[0, 0.55, 1]}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "22%",
        zIndex: 2,
      }}
    />
  );
}

interface GradientWrapperProps {
  children: ReactNode;
  minHeight?: number;
}

const GradientWrapper = ({
  children,
  minHeight = 420,
}: GradientWrapperProps) => {
  const palette = useAppThemeColors();
  // Always white - the gradient background is always dark/coloured enough for white lines
  const patternStroke = withAlpha("#FFFFFF", 0.22);
  const fadeStops = [
    withAlpha(palette.secondary.base, 0),
    withAlpha(palette.secondary.base, 0.1),
    withAlpha(palette.secondary.base, 0.22),
  ] as const;

  return (
    <LinearGradient
      colors={[palette.primary.default, palette.secondary.default]}
      locations={[0, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        minHeight,
        overflow: "hidden",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 36,
        position: "relative",
      }}
    >
      <GridBackground stroke={patternStroke} />
      <IntersectionPluses stroke={patternStroke} height={minHeight} />
      <BottomFade colors={fadeStops} />
      {children}
    </LinearGradient>
  );
};

export default GradientWrapper;
