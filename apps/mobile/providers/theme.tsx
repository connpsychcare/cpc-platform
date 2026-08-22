import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Appearance, View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ThemeContext,
  type ThemePalette,
  type ThemePreference,
} from "@/hooks/use-theme";
import { getThemePalette, withAlpha } from "@/lib/theme";

const THEME_STORAGE_KEY = "theme-preference";

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

export default function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme() ?? "light";
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (!active) {
          return;
        }

        if (isThemePreference(stored)) {
          setPreferenceState(stored);
          Appearance.setColorScheme(stored === "system" ? null : stored);
        } else {
          Appearance.setColorScheme(null);
        }
      } catch (error) {
        console.warn("Failed to load theme preference", error);
      } finally {
        if (active) {
          setIsHydrated(true);
        }
      }
    };

    void loadTheme();

    return () => {
      active = false;
    };
  }, []);

  const colorScheme = preference === "system" ? systemScheme : preference;
  const palette = useMemo<ThemePalette>(() => {
    const appTheme = getThemePalette(colorScheme);

    return {
      navigation: {
        rootSceneBackground: appTheme.background.base,
        tabBarActiveTint: appTheme.primary.base,
        tabBarInactiveTint: appTheme.muted.foreground!,
        tabBarBackground: appTheme.popover.base,
        tabBarBorder: appTheme.border.base,
        drawerBackground: appTheme.sidebar.base,
        drawerSceneBackground: appTheme.background.base,
        drawerOverlay: withAlpha(appTheme.darkSection.base, 0.24),
      },
      statusBarStyle: colorScheme === "dark" ? "light" : "dark",
    };
  }, [colorScheme]);

  const setPreference = useCallback(async (next: ThemePreference) => {
    setPreferenceState(next);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
      Appearance.setColorScheme(next === "system" ? null : next);
    } catch (error) {
      console.warn("Failed to save theme preference", error);
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    const resolvedScheme = preference === "system" ? systemScheme : preference;
    const next: ThemePreference = resolvedScheme === "dark" ? "light" : "dark";

    await setPreference(next);
  }, [preference, setPreference, systemScheme]);

  const value = useMemo(
    () => ({
      preference,
      colorScheme,
      palette,
      isHydrated,
      setPreference,
      toggleTheme,
    }),
    [colorScheme, isHydrated, palette, preference, setPreference, toggleTheme],
  );

  if (!isHydrated) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <View className="flex-1 bg-background will-change-variable">
          {children}
        </View>
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}
