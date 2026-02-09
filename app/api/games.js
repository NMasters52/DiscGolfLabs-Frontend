export async function createGameSession(gameSlug, payload, token) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/games/${gameSlug}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to save game session");
  }

  return res.json();
}
