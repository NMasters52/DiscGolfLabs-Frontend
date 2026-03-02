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

export async function fetchGameSession(gameSlug, courseId, token) {
  const url = import.meta.env.VITE_API_URL;
  const params = new URLSearchParams();

  if (courseId) params.append("courseId", courseId);
  const res = await fetch(`${url}/api/games/${gameSlug}/sessions?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch game sessions");
  }

  return res.json();
}

export async function fetchPuttingGameStats(token) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch putting game stats");
  }

  return res.json();
}
