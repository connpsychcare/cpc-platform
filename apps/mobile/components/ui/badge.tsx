import { Text } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type BadgeVariants = {
  variant?: AppUIVariant | "outline";
  appearance?: Extract<AppUIAppearance, "solid" | "soft">;
};

const solidClasses = {
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
  accent: "border-transparent bg-accent text-accent-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground",
  info: "border-transparent bg-info text-info-foreground",
  card: "border-border bg-card text-card-foreground",
  outline: "border-border bg-transparent text-foreground",
} as const;

const softClasses = {
  primary: "border-transparent bg-primary/10 text-primary",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  muted: "border-transparent bg-muted/60 text-muted-foreground",
  accent: "border-transparent bg-accent/70 text-accent-foreground",
  destructive: "border-transparent bg-destructive/10 text-destructive",
  success: "border-transparent bg-success/10 text-success",
  warning: "border-transparent bg-warning/10 text-warning",
  info: "border-transparent bg-info/10 text-info",
  card: "border-border bg-card text-card-foreground",
  outline: "border-border bg-transparent text-foreground",
} as const;

export function badgeVariants({
  variant = "primary",
  appearance = "soft",
}: BadgeVariants = {}) {
  return cn(
    "max-w-full shrink self-start rounded-full border px-2.5 py-1 font-body-medium text-xs capitalize",
    appearance === "solid" ? solidClasses[variant] : softClasses[variant],
  );
}

export function Badge({
  className,
  variant = "primary",
  appearance = "soft",
  ...props
}: ComponentProps<typeof Text> & BadgeVariants & { className?: string }) {
  return (
    <Text
      className={cn(badgeVariants({ variant, appearance }), className)}
      {...props}
    />
  );
}
