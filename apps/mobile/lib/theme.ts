import { useMemo } from "react";
import { useTheme } from "@/hooks/use-theme";

export type ThemeMode = "light" | "dark";

type ThemeColorTokenInput = {
  base: string;
  foreground?: string;
};

type ThemeColorToken = {
  base: string;
  foreground: string;
};

type ThemeScale = ThemeColorToken & {
  default: string;
  soft: string;
  subtle: string;
  strong: string;
  border: string;
};

type ShadowToken = {
  color: string;
  soft: string;
  card: string;
};

type RadiusToken = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

type ChartSet = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
};

type AppThemePalette = {
  background: ThemeScale;
  foreground: ThemeScale;

  card: ThemeScale;
  popover: ThemeScale;

  primary: ThemeScale;
  secondary: ThemeScale;
  muted: ThemeScale;
  accent: ThemeScale;

  destructive: ThemeScale;
  success: ThemeScale;
  warning: ThemeScale;
  info: ThemeScale;

  border: ThemeScale;
  input: ThemeScale;
  ring: ThemeScale;

  sidebar: ThemeScale;
  sidebarPrimary: ThemeScale;
  sidebarAccent: ThemeScale;
  sidebarBorder: ThemeScale;
  sidebarRing: ThemeScale;

  hero: {
    from: string;
    to: string;
    ring: string;
  };

  section: {
    soft: string;
    softer: string;
  };

  surface: {
    elevated: string;
    soft: string;
  };

  darkSection: {
    base: string;
    foreground: string;
  };

  footer: {
    base: string;
    foreground: string;
  };

  chart: ChartSet;
  shadow: ShadowToken;
  radius: RadiusToken;
};

export function withAlpha(color: string, alpha: number) {
  const normalized = alpha > 1 ? alpha / 100 : alpha;
  const body = color.trim();

  if (body.startsWith("#")) {
    const hex = body.slice(1);
    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;

    const red = Number.parseInt(fullHex.slice(0, 2), 16);
    const green = Number.parseInt(fullHex.slice(2, 4), 16);
    const blue = Number.parseInt(fullHex.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${normalized})`;
  }

  if (body.startsWith("rgb(")) {
    return body.replace("rgb(", "rgba(").replace(")", `, ${normalized})`);
  }

  if (body.startsWith("rgba(")) {
    return body.replace(/,\s*[\d.]+\)$/, `, ${normalized})`);
  }

  return color;
}

function createScale(token: ThemeColorTokenInput): ThemeScale {
  const foreground = token.foreground ?? token.base;

  return {
    base: token.base,
    foreground,
    default: withAlpha(token.base, 0.92),
    soft: withAlpha(token.base, 0.12),
    subtle: withAlpha(token.base, 0.06),
    strong: withAlpha(token.base, 0.18),
    border: withAlpha(token.base, 0.22),
  };
}

function createThemePalette(theme: {
  background: ThemeColorToken;
  foreground: ThemeColorToken;

  card: ThemeColorToken;
  popover: ThemeColorToken;

  primary: ThemeColorToken;
  secondary: ThemeColorToken;
  muted: ThemeColorToken;
  accent: ThemeColorToken;

  destructive: ThemeColorToken;
  success: ThemeColorToken;
  warning: ThemeColorToken;
  info: ThemeColorToken;

  border: ThemeColorToken;
  input: ThemeColorToken;
  ring: ThemeColorToken;

  sidebar: ThemeColorToken;
  sidebarPrimary: ThemeColorToken;
  sidebarAccent: ThemeColorToken;
  sidebarBorder: ThemeColorToken;
  sidebarRing: ThemeColorToken;

  hero: {
    from: string;
    to: string;
    ring: string;
  };

  section: {
    soft: string;
    softer: string;
  };

  surface: {
    elevated: string;
    soft: string;
  };

  darkSection: {
    base: string;
    foreground: string;
  };

  footer: {
    base: string;
    foreground: string;
  };

  chart: ChartSet;
  shadow: ShadowToken;
  radius: RadiusToken;
}): AppThemePalette {
  return {
    background: createScale(theme.background),
    foreground: createScale(theme.foreground),

    card: createScale(theme.card),
    popover: createScale(theme.popover),

    primary: createScale(theme.primary),
    secondary: createScale(theme.secondary),
    muted: createScale(theme.muted),
    accent: createScale(theme.accent),

    destructive: createScale(theme.destructive),
    success: createScale(theme.success),
    warning: createScale(theme.warning),
    info: createScale(theme.info),

    border: createScale(theme.border),
    input: createScale(theme.input),
    ring: createScale(theme.ring),

    sidebar: createScale(theme.sidebar),
    sidebarPrimary: createScale(theme.sidebarPrimary),
    sidebarAccent: createScale(theme.sidebarAccent),
    sidebarBorder: createScale(theme.sidebarBorder),
    sidebarRing: createScale(theme.sidebarRing),

    hero: theme.hero,
    section: theme.section,
    surface: theme.surface,
    darkSection: theme.darkSection,
    footer: theme.footer,
    chart: theme.chart,
    shadow: theme.shadow,
    radius: theme.radius,
  };
}

/**
 * These hex values are the RN-safe equivalents of your CSS OKLCH theme.
 * Keep this file as the source of truth for React Native inline styles / gradients.
 */
export const lightThemePalette = createThemePalette({
  background: { base: "#FDFAF4", foreground: "#22190E" },
  foreground: { base: "#22190E", foreground: "#22190E" },

  card: { base: "#FFFFFF", foreground: "#22190E" },
  popover: { base: "#FFFFFF", foreground: "#22190E" },

  /* Brand - blue is the dominant primary */
  primary: { base: "#1659DB", foreground: "#FAFAFA" },
  secondary: { base: "#E3F0FF", foreground: "#1043A8" },
  muted: { base: "#E3F0FF", foreground: "#596471" },
  /* Action signal - green */
  accent: { base: "#154D00", foreground: "#FAFAFA" },

  destructive: { base: "#EE343B", foreground: "#FAFAFA" },
  success: { base: "#2FC183", foreground: "#FAFAFA" },
  warning: { base: "#F6C330", foreground: "#1C1505" },
  info: { base: "#00AACE", foreground: "#FAFAFA" },

  border: { base: "#D2DCE8", foreground: "#D2DCE8" },
  input: { base: "#D2DCE8", foreground: "#D2DCE8" },
  /* Focus ring uses the green signal */
  ring: { base: "#154D00", foreground: "#154D00" },

  sidebar: { base: "#08121F", foreground: "#E5ECF3" },
  sidebarPrimary: { base: "#77B5FB", foreground: "#06101C" },
  sidebarAccent: { base: "#111E2D", foreground: "#EAEFF5" },
  sidebarBorder: { base: "#222F3F", foreground: "#222F3F" },
  sidebarRing: { base: "#549A44", foreground: "#549A44" },

  hero: {
    from: "#08121F",
    to: "#0F1D2F",
    ring: "rgba(22, 89, 219, 0.14)",
  },

  section: {
    soft: "#E3F0FF",
    softer: "#FDFAF4",
  },

  surface: {
    elevated: "#FFFFFF",
    soft: "#E3F0FF",
  },

  darkSection: {
    base: "#1043A8",
    foreground: "#FAFAFA",
  },

  footer: {
    base: "#08121F",
    foreground: "#F6F2E7",
  },

  chart: {
    1: "#1659DB",
    2: "#154D00",
    3: "#4683C5",
    4: "#F2716A",
    5: "#B37ED8",
  },

  shadow: {
    color: "rgba(22, 89, 219, 0.1)",
    soft: "0 10px 30px rgba(22, 89, 219, 0.08)",
    card: "0 8px 24px rgba(22, 89, 219, 0.06)",
  },

  radius: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 22,
  },
});

export const darkThemePalette = createThemePalette({
  background: { base: "#02060F", foreground: "#F6F2E7" },
  foreground: { base: "#F6F2E7", foreground: "#F6F2E7" },

  card: { base: "#0A1421", foreground: "#F6F2E7" },
  popover: { base: "#0A1421", foreground: "#F6F2E7" },

  /* Brand - blue is the dominant primary */
  primary: { base: "#59A0F9", foreground: "#030915" },
  secondary: { base: "#122032", foreground: "#F6F2E7" },
  muted: { base: "#122032", foreground: "#99A6B4" },
  /* Action signal - green */
  accent: { base: "#96C979", foreground: "#051106" },

  destructive: { base: "#FC5858", foreground: "#FAFAFA" },
  success: { base: "#53C48E", foreground: "#06100A" },
  warning: { base: "#EABE4A", foreground: "#161107" },
  info: { base: "#07BFDE", foreground: "#09121F" },

  border: { base: "#222F3F", foreground: "#222F3F" },
  input: { base: "#222F3F", foreground: "#222F3F" },
  /* Focus ring uses the green signal */
  ring: { base: "#96C979", foreground: "#96C979" },

  sidebar: { base: "#02060F", foreground: "#E2E9F0" },
  sidebarPrimary: { base: "#59A0F9", foreground: "#02060F" },
  sidebarAccent: { base: "#0A1421", foreground: "#EAEFF5" },
  sidebarBorder: { base: "#222F3F", foreground: "#222F3F" },
  sidebarRing: { base: "#96C979", foreground: "#96C979" },

  hero: {
    from: "#0A1421",
    to: "#122032",
    ring: "rgba(89, 160, 249, 0.2)",
  },

  section: {
    soft: "#122032",
    softer: "#0A1421",
  },

  surface: {
    elevated: "#0A1421",
    soft: "#122032",
  },

  darkSection: {
    base: "#0A1421",
    foreground: "#F6F2E7",
  },

  footer: {
    base: "#010309",
    foreground: "#F6F2E7",
  },

  chart: {
    1: "#59A0F9",
    2: "#96C979",
    3: "#558AC0",
    4: "#F97770",
    5: "#B984DF",
  },

  shadow: {
    color: "rgba(0, 0, 0, 0.28)",
    soft: "0 10px 30px rgba(0, 0, 0, 0.24)",
    card: "0 8px 24px rgba(0, 0, 0, 0.20)",
  },

  radius: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 22,
  },
});

export function getThemePalette(mode: ThemeMode): AppThemePalette {
  return mode === "dark" ? darkThemePalette : lightThemePalette;
}

export function useAppThemeColors() {
  const { colorScheme } = useTheme();
  const mode: ThemeMode = colorScheme === "dark" ? "dark" : "light";

  return useMemo(() => getThemePalette(mode), [mode]);
}

export function useThemeColor(variant: ThemeVariant, tone: ThemeTone = "base") {
  const colors = useAppThemeColors();
  return colors[variant][tone];
}

/**
 * Returns [startColor, endColor] for a LinearGradient card based on a UI variant.
 * Mimics the web's `bg-linear-to-br from-{variant}/10 to-card` pattern.
 */
export function useStatusGradients() {
  const colors = useAppThemeColors();
  return useMemo(() => {
    const make = (variantKey: keyof AppThemePalette): readonly [string, string] => {
      const token = colors[variantKey] as any;
      const base: string = token?.base ?? colors.primary.base;
      return [withAlpha(base, 0.11), colors.card.base] as const;
    };
    return {
      primary: make("primary"),
      secondary: make("secondary"),
      muted: make("muted"),
      accent: make("accent"),
      success: make("success"),
      warning: make("warning"),
      info: make("info"),
      destructive: make("destructive"),
    } as Record<string, readonly [string, string]>;
  }, [colors]);
}
