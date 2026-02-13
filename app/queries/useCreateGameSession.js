import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createGameSession } from "../api/games";
import { useAuth } from "@clerk/react-router";
import { queryKeys } from "./keys";

export function useCreateGameSession(gameSlug) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      return createGameSession(gameSlug, payload, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gameSession.bySlug(gameSlug, variables.courseId),
      });
    },
  });
}
