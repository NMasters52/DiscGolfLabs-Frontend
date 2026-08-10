import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react-router";
import { fetchGameSession } from "../api/games";
import { queryKeys } from "./keys";

export function useGameSessions(gameSlug, courseId, options = {}) {
  const { getToken } = useAuth();
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryKey: queryKeys.gameSession.bySlug(gameSlug, courseId),
    queryFn: async () => {
      const token = await getToken();
      return fetchGameSession(gameSlug, courseId, token);
    },
    enabled: !!gameSlug && !!courseId && enabled,
  });
}
