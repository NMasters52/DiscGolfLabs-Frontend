import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react-router";
import { fetchPuttingGameStats } from "../api/games";
import { queryKeys } from "./keys";

export function usePuttingGameStats(options = {}) {
  const { getToken } = useAuth();
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryKey: queryKeys.puttingGame.stats(),
    queryFn: async () => {
      const token = await getToken();
      return fetchPuttingGameStats(token);
    },
    enabled,
  });
}
