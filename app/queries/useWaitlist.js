import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWaitlistCount, joinWaitlist } from "../api/waitlist";

export function useWaitlistCount() {
  return useQuery({
    queryKey: ["waitlist", "count"],
    queryFn: fetchWaitlistCount,
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useJoinWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist", "count"] });
    },
  });
}
