import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react-router";
import { fetchGameSession } from "../api/games";
import { queryKeys } from "./keys";

export function useGameSessions(gameSlug, courseId) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: () => queryKeys.gameSession(gameSlug, courseId),
    queryFn: async () => {
      const token = await getToken();
      return fetchGameSession(gameSlug, courseId, token);
    },
    enabled: !!gameSlug, // Only run if gameSlug exists
  });
}
