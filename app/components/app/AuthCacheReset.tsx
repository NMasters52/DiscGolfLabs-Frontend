import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { shouldClearAuthCache } from "~/queries/auth-cache";

/**
 * Renders nothing; clears the query cache whenever the signed-in Clerk user
 * changes. Without this, a new user on the same device reads the last
 * user's enrollment and progress from cache, and a returning user reads
 * state from before they signed out.
 *
 * Must render inside both QueryClientProvider and ClerkProvider.
 */
export function AuthCacheReset() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (shouldClearAuthCache(previousUserId.current, userId)) {
      queryClient.clear();
    }
    previousUserId.current = userId;
  }, [queryClient, userId]);

  return null;
}
