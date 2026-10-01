export interface CourseProgress {
  completedDays: number;
  totalDays: number;
  percent: number;
}

export type DayStatus = "completed" | "current" | "locked";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Course progress from the enrollment's `currentDay` counter, using the same
 * clamp the dashboard uses: `currentDay` means "the day you're on", so a
 * completed course (currentDay 6 of 5) yields 5 completed days and 100%.
 */
export function createCourseProgress(
  currentDay: number,
  totalDays: number,
): CourseProgress {
  const days = Math.max(1, totalDays);
  const completedDays = clamp(currentDay - 1, 0, days);

  return {
    completedDays,
    totalDays: days,
    percent: Math.round((completedDays / days) * 100),
  };
}

/**
 * Where a day sits for an enrollment: `completed` (before the current day),
 * `current` (the day the enrollment is on, while the course is in progress),
 * or `locked` (beyond the current day). A completed course has no current
 * day — every day reads as completed and is open for review.
 */
export function getDayStatus(
  dayNumber: number,
  currentDay: number,
  totalDays: number,
): DayStatus {
  const days = Math.max(1, totalDays);
  const normalizedCurrentDay = Math.max(1, currentDay);

  if (dayNumber <= clamp(currentDay - 1, 0, days)) {
    return "completed";
  }

  if (dayNumber === normalizedCurrentDay && normalizedCurrentDay <= days) {
    return "current";
  }

  return "locked";
}
