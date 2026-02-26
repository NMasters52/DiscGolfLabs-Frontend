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
