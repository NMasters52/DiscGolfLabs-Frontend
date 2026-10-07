/**
 * The one contract for `course.days`: sorted ascending by day number and
 * renumbered contiguously from 1. The backend enforces neither (latent —
 * seeded data is clean today), and the course home, learn index, and day
 * route each assumed a different shape, so every consumer reads the
 * normalized array `fetchCourse` produces.
 */
export interface CourseDay {
  dayNumber: number;
  title: string;
  description: string | null;
}

const toTitle = (value: unknown, dayNumber: number): string =>
  typeof value === "string" && value.trim() !== ""
    ? value
    : `Day ${dayNumber}`;

export function normalizeCourseDays(raw: unknown): CourseDay[] {
  if (!Array.isArray(raw)) return [];

  const sorted = [...raw]
    .filter((day): day is Record<string, unknown> =>
      typeof day === "object" && day !== null,
    )
    .sort((a, b) => Number(a.dayNumber ?? 0) - Number(b.dayNumber ?? 0));

  return sorted.map((day, index) => {
    const dayNumber = index + 1;
    return {
      dayNumber,
      title: toTitle(day.title, dayNumber),
      description:
        day.description == null ? null : String(day.description),
    };
  });
}
