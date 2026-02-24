import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchWaitlistCount() {
  const response = await fetch(`${API_BASE}/api/waitlist/count`);
  if (!response.ok) {
    throw new Error("Failed to fetch waitlist count");
  }
  return response.json();
}

export async function joinWaitlist({ email, source }) {
  const response = await fetch(`${API_BASE}/api/waitlist/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, source }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to join waitlist");
  }
  return response.json();
}

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
