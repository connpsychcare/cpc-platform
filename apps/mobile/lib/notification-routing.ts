const MOBILE_NOTIFICATION_FALLBACK = "/patient/notifications";

const ALLOWED_PREFIXES = [
  "/patient",
  "/providers",
  "/services",
  "/resources",
  "/contact",
  "/about",
  "/account",
  "/auth",
] as const;

function normalizeRawHref(rawHref: string) {
  const trimmed = rawHref.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function resolveNotificationHref(rawHref: unknown) {
  if (typeof rawHref !== "string") return null;

  const normalized = normalizeRawHref(rawHref);
  if (!normalized) return null;

  if (
    normalized.startsWith("/admin") ||
    normalized.startsWith("/provider") ||
    normalized.startsWith("/staff")
  ) {
    return null;
  }

  if (normalized.startsWith("/patient/messages/")) {
    return "/patient/messages";
  }

  if (normalized.startsWith("/patient/payments/")) {
    return "/patient/payments";
  }

  if (normalized.startsWith("/patient/progress-reports")) {
    return MOBILE_NOTIFICATION_FALLBACK;
  }

  if (ALLOWED_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return normalized;
  }

  return null;
}

export function getNotificationNavigationHref(
  notification: { meta?: unknown } | null | undefined,
) {
  const meta = (notification?.meta ?? null) as
    | { actionUrl?: unknown; href?: unknown }
    | null;

  return (
    resolveNotificationHref(meta?.actionUrl) ??
    resolveNotificationHref(meta?.href) ??
    MOBILE_NOTIFICATION_FALLBACK
  );
}

export function getPushNotificationHref(
  payload: Record<string, unknown> | undefined,
) {
  return (
    resolveNotificationHref(payload?.href) ??
    resolveNotificationHref(payload?.actionUrl) ??
    MOBILE_NOTIFICATION_FALLBACK
  );
}

export { MOBILE_NOTIFICATION_FALLBACK };
