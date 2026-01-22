const API_URL = import.meta.env.VITE_API_URL;

export async function fetchUser(token) {
  const res = await fetch(`${API_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Token invalid");
  }

  return res.json();
}
