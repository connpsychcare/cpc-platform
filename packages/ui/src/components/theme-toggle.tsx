"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@workspace/ui/hooks/use-theme";
import { cn } from "../lib/utils";

type ThemeSwitchProps = {
  className?: string;
};

/**
 * Minimal theme toggle: a single shadow/contrast glyph in the current
 * foreground color. On toggle the icon rotates 180 degrees while the theme's
 * colors swap underneath, which reads as a "flip" without swapping icons.
 * Pass a text color class (e.g. text-footer-foreground) when placed on
 * a surface that does not follow the page foreground.
 */
const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className={cn(
        "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-[transform,opacity] duration-500 ease-out hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
        isDark && "rotate-180",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-4.5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
    </button>
  );
};

export default ThemeSwitch;
