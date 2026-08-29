export async function fetchCourse(slug) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/courses/${slug}`);

  if (!res.ok) throw new Error("course not found");

  return res.json();
}
