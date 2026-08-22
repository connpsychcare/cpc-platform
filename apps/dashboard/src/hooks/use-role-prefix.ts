"use client";

import { usePathname } from "next/navigation";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

/**
 * Returns the role-based route prefix for the currently active workspace,
 * "/admin" or "/staff".
 *
 * Use this in every form and page that builds role-relative links instead of
 * inlining the useMemo pattern.
 */
export function useRolePrefix(): "/admin" | "/staff" {
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();
  if (pathname.startsWith("/staff")) return "/staff";
  if (pathname.startsWith("/admin")) return "/admin";
  if (currentUser?.role === "staff") return "/staff";
  return "/admin";
}
