export async function fetchEnrollment(token, courseId) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/enrollments/check/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
