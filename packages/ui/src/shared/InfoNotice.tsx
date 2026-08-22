import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type InfoNoticeProps = {
  message: ReactNode;
  variant?: "warning" | "info" | "error" | "success" | "default";
  className?: string;
};

const variantClasses = {
  warning: "border-warning/25 bg-warning/10 text-warning",
  info: "border-info/25 bg-info/10 text-info",
  error: "border-destructive/25 bg-destructive/10 text-destructive",
  success: "border-success/25 bg-success/10 text-success",
  default: "border-border bg-muted/40 text-foreground",
};

export function InfoNotice({
  message,
  variant = "warning",
  className,
}: InfoNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        variantClasses[variant],
        className,
      )}
    >
      {message}
    </div>
  );
}
