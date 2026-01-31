export async function createCheckoutSession(token, slug) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ courseSlug: slug }),
  });

  if (!res.ok) throw new Error("Failed to checkout");

  return res.json(); // returns a URL to stripe checkout page
}
