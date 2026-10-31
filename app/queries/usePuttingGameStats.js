import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react-router";
import { fetchPuttingGameStats } from "../api/games";
import { DEFAULT_STATS_PERIOD_DAYS } from "../components/dashboard/stats-period";
import { queryKeys } from "./keys";

export function usePuttingGameStats(options = {}) {
  const { getToken } = useAuth();
  const { enabled = true, days = DEFAULT_STATS_PERIOD_DAYS, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryKey: queryKeys.puttingGame.stats(days),
    queryFn: async () => {
      const token = await getToken();
      return fetchPuttingGameStats(token, days);
    },
    enabled,
  });
}
