import * as SecureStore from "expo-secure-store";
import type { AuthTokensResponse } from "@workspace/contracts/auth";

const AUTH_SESSION_KEY = "connected-psychiatric-care.auth.session";
const listeners = new Set<(session: AuthTokensResponse | null) => void>();
let cachedAuthSession: AuthTokensResponse | null | undefined;

const isAuthTokensResponse = (
  value: unknown,
): value is AuthTokensResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<AuthTokensResponse>;

  return (
    typeof session.accessToken === "string" &&
    typeof session.refreshToken === "string" &&
    typeof session.deviceId === "string"
  );
};

export const getStoredAuthSession = async (): Promise<AuthTokensResponse | null> => {
  if (typeof cachedAuthSession !== "undefined") {
    return cachedAuthSession;
  }

  try {
    const raw = await SecureStore.getItemAsync(AUTH_SESSION_KEY);

    if (!raw) {
      cachedAuthSession = null;
      return null;
    }

    const parsed = JSON.parse(raw);
    cachedAuthSession = isAuthTokensResponse(parsed) ? parsed : null;
    return cachedAuthSession;
  } catch {
    cachedAuthSession = null;
    return null;
  }
};

export const setStoredAuthSession = async (session: AuthTokensResponse) => {
  cachedAuthSession = session;
  await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
  listeners.forEach((listener) => listener(session));
};

export const clearStoredAuthSession = async () => {
  cachedAuthSession = null;
  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
  listeners.forEach((listener) => listener(null));
};

export const subscribeToStoredAuthSession = (
  listener: (session: AuthTokensResponse | null) => void,
) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
