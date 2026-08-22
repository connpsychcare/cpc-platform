import "@/lib/auth-client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthExpired } from "@workspace/sdk";

import { clearStoredAuthSession } from "@/lib/auth-storage";

// Clears stored session and query cache when the SDK fires authExpired.
// Redirect is handled by the patient layout via useAuth terminalAuth state.
const AuthSessionSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return onAuthExpired(async () => {
      await clearStoredAuthSession();
      await queryClient.cancelQueries();
      queryClient.removeQueries({ queryKey: ["session"] });
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["patient", "me"] });
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "patient",
      });
    });
  }, [queryClient]);

  return null;
};

export default AuthSessionSync;
