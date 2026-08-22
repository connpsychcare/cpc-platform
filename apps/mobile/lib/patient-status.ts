import type { BadgeVariants } from "@/components/ui/badge";

type StatusMeta = {
  label: string;
  variant: BadgeVariants["variant"];
};

const APPOINTMENT_STATUS_MAP: Record<string, StatusMeta> = {
  booked: { label: "Booked", variant: "info" },
  confirmed: { label: "Confirmed", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  noShow: { label: "No Show", variant: "warning" },
};

const ORDER_STATUS_MAP: Record<string, StatusMeta> = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "accent" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  refunded: { label: "Refunded", variant: "secondary" },
};

const PAYMENT_STATUS_MAP: Record<string, StatusMeta> = {
  pending: { label: "Pending", variant: "warning" },
  succeeded: { label: "Paid", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  refunded: { label: "Refunded", variant: "secondary" },
};

function titleCase(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function getStatusMeta(
  map: Record<string, StatusMeta>,
  status?: string,
): StatusMeta {
  if (!status) {
    return { label: "Unknown", variant: "secondary" };
  }

  return map[status] ?? { label: titleCase(status), variant: "secondary" };
}

export function getAppointmentStatusMeta(status?: string) {
  return getStatusMeta(APPOINTMENT_STATUS_MAP, status);
}

export function getOrderStatusMeta(status?: string) {
  return getStatusMeta(ORDER_STATUS_MAP, status);
}

export function getPaymentStatusMeta(status?: string) {
  return getStatusMeta(PAYMENT_STATUS_MAP, status);
}

const VARIANT_SOFT_BG: Record<string, string> = {
  // base variants
  primary: "bg-primary/5 border-primary/10",
  secondary: "bg-secondary/40 border-secondary",
  muted: "bg-muted/60 border-muted",
  accent: "bg-accent/50 border-accent",
  success: "bg-success/5 border-success/10",
  warning: "bg-warning/5 border-warning/10",
  info: "bg-info/5 border-info/10",
  destructive: "bg-destructive/5 border-destructive/10",
  card: "bg-card border-border",
  outline: "bg-surface-elevated border-border",

  // success-like statuses
  active: "bg-success/5 border-success/10",
  verified: "bg-success/5 border-success/10",
  confirmed: "bg-success/5 border-success/10",
  completed: "bg-success/5 border-success/10",
  succeeded: "bg-success/5 border-success/10",
  paid: "bg-success/5 border-success/10",
  delivered: "bg-success/5 border-success/10",

  // warning / pending
  pending: "bg-warning/5 border-warning/10",
  scheduled: "bg-warning/5 border-warning/10",
  partial: "bg-warning/5 border-warning/10",

  // info / neutral-active
  processing: "bg-info/5 border-warning/10",
  booked: "bg-info/5 border-info/10",
  shipped: "bg-info/5 border-info/10",
  sent: "bg-info/5 border-info/10",
  open: "bg-info/5 border-info/10",

  // destructive / error
  rejected: "bg-destructive/5 border-destructive/10",
  cancelled: "bg-destructive/5 border-destructive/10",
  failed: "bg-destructive/5 border-destructive/10",
  refunded: "bg-destructive/5 border-destructive/10",
  revoked: "bg-destructive/5 border-destructive/10",
  expired: "bg-destructive/5 border-destructive/10",

  // inactive / muted
  suspended: "bg-secondary/40 border-secondary",
  noShow: "bg-secondary/40 border-secondary",
  draft: "bg-secondary/40 border-secondary",
  closed: "bg-secondary/40 border-secondary",

  // neutral default-ish
  processed: "bg-primary/5 border-primary/10",
};

export function getVariantSoftBg(variant?: string): string {
  return VARIANT_SOFT_BG[variant ?? "outline"] ?? "bg-surface-elevated";
}

export function formatStatusLabel(value?: string) {
  if (!value) {
    return "Unknown";
  }

  return titleCase(value);
}
