import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import type { ThemeMode } from "@workspace/contracts";

export const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted
    ? (resolvedTheme as Omit<ThemeMode, "system"> | undefined)
    : undefined;

  const toggleTheme = () =>
    setTheme(currentTheme === "dark" ? "light" : "dark");

  const syncTheme = (theme: ThemeMode) => {
    setTheme(theme);
  };

  return { isMounted: mounted, theme: currentTheme, toggleTheme, syncTheme };
};
