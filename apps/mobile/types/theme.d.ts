declare global {
  type ThemeVariant =
    | "background"
    | "foreground"
    | "card"
    | "popover"
    | "primary"
    | "secondary"
    | "muted"
    | "accent"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "border"
    | "input"
    | "ring"
    | "sidebar"
    | "sidebarPrimary"
    | "sidebarAccent"
    | "sidebarBorder"
    | "sidebarRing";

  type ThemeTone =
    | "base"
    | "foreground"
    | "default"
    | "soft"
    | "subtle"
    | "strong"
    | "border";

  type AppUIVariant =
    | "primary"
    | "secondary"
    | "muted"
    | "accent"
    | "destructive"
    | "success"
    | "warning"
    | "info";

  type AppUIAppearance = "solid" | "soft" | "plain";
}

export {};
