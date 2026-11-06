// Clean fixture: `Record<string, unknown>` as a deliberate parser boundary.
// The unknown dictionary describes input that has not been trusted yet; every
// field is validated and coerced before typed output is produced. The core
// gate must not flag this (no-unsafe-dictionary-type is off for exactly this
// boundary pattern; see oxlint.config.ts).
export interface ParsedCourseDay {
  day: number;
  title: string;
}

export function parseCourseDay(raw: Record<string, unknown>): ParsedCourseDay {
  return {
    day: typeof raw.day === "number" ? raw.day : 0,
    title: typeof raw.title === "string" ? raw.title : "Untitled",
  };
}

export function parseCourseDays(input: unknown): ParsedCourseDay[] {
  if (!Array.isArray(input)) return [];
  const days: ParsedCourseDay[] = [];
  for (const item of input) {
    if (typeof item === "object" && item !== null) {
      days.push(parseCourseDay(item as Record<string, unknown>));
    }
  }
  return days;
}
