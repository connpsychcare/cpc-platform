import { useEffect, useState } from "react";
import type { AuthTokensResponse } from "@workspace/contracts/auth";

import {
  getStoredAuthSession,
  subscribeToStoredAuthSession,
} from "@/lib/auth-storage";

export function useAuthSessionState() {
  const [session, setSession] = useState<AuthTokensResponse | null | undefined>(
    undefined,
  );

  useEffect(() => {
    let isMounted = true;

    void getStoredAuthSession().then((value) => {
      if (isMounted) {
        setSession(value);
      }
    });

    const unsubscribe = subscribeToStoredAuthSession((value) => {
      setSession(value);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    session,
    hasSession: Boolean(session),
    isLoading: typeof session === "undefined",
  };
}
