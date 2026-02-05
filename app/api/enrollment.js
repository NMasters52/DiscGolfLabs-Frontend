export async function fetchEnrollment(token, courseId) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/enrollments/check/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Enrollment check failed");
  }

  return res.json();
}

export async function completeDay(token, courseId, day) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/${courseId}/complete-day`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ day }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to complete day");
  }

  return res.json();
}
