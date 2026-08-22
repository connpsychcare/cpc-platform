import { createContext, useContext } from "react";

export type ThemePreference = "system" | "light" | "dark";
export type AppColorScheme = "light" | "dark";

export type ThemePalette = {
  navigation: {
    rootSceneBackground: string;
    tabBarActiveTint: string;
    tabBarInactiveTint: string;
    tabBarBackground: string;
    tabBarBorder: string;
    drawerBackground: string;
    drawerSceneBackground: string;
    drawerOverlay: string;
  };
  statusBarStyle: AppColorScheme;
};

export type ThemeContextValue = {
  preference: ThemePreference;
  colorScheme: AppColorScheme;
  palette: ThemePalette;
  isHydrated: boolean;
  setPreference: (next: ThemePreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
