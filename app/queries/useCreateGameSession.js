import { useMutation } from "@tanstack/react-query";
import { createGameSession } from "../api/games";
import { useAuth } from "@clerk/react-router";

export function useCreateGameSession(gameSlug) {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (payload) => {
      console.log(
        "🔥 MUTATION FN CALLED WITH creating a gamesession:",
        gameSlug,
      );
      const token = await getToken();
      return createGameSession(gameSlug, payload, token);
    },
  });
}
