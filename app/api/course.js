import { normalizeCourseDays } from "./course-days";

/**
 * An API failure that keeps the HTTP status, so screens can tell "this
 * slug has no course" (404) apart from "the server is having a bad day".
 */
export class CourseApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "CourseApiError";
    this.status = status;
  }
}

export async function fetchCourse(slug) {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/courses/${slug}`);

  if (!res.ok) {
    throw new CourseApiError(
      res.status,
      res.status === 404
        ? `No course for slug "${slug}"`
        : `Failed to fetch course (${res.status})`,
    );
  }

  const course = await res.json();
  return { ...course, days: normalizeCourseDays(course.days) };
}

export async function fetchCourses() {
  const url = import.meta.env.VITE_API_URL;

  const res = await fetch(`${url}/api/courses`);

  if (!res.ok) throw new Error("Failed to fetch courses");

  return res.json();
}
