"use client";

import { startTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthExpired, type AuthExpiredDetail } from "@workspace/sdk";

const buildSignInUrl = ({ errorCode, message }: AuthExpiredDetail) => {
  const params = new URLSearchParams();

  if (errorCode) {
    params.set("error", errorCode);
  }

  if (message) {
    params.set("message", message);
  }

  const query = params.toString();
  return query ? `/auth/sign-in?${query}` : "/auth/sign-in";
};

const PROTECTED_ROUTE_PREFIXES = [
  "/patient",
  "/admin",
  "/provider",
  "/staff",
  "/account",
  "/notifications",
  "/messages",
  "/orders",
  "/products",
  "/media",
  "/categories",
];

const isProtectedRoute = (pathname?: string | null) =>
  Boolean(
    pathname &&
      PROTECTED_ROUTE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      ),
  );

const AuthSessionSync = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    return onAuthExpired((detail) => {
      void queryClient.cancelQueries();
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["patient", "me"] });

      if (pathname?.startsWith("/auth") || !isProtectedRoute(pathname)) {
        return;
      }

      startTransition(() => {
        router.replace(buildSignInUrl(detail));
      });
    });
  }, [pathname, queryClient, router]);

  return null;
};

export default AuthSessionSync;
