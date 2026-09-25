// @ts-expect-error Node's native type stripping requires the explicit extension.
import { createCourseProgress, getDayStatus, type CourseProgress, type DayStatus } from "./course-progress.ts";

export type CourseHomeState =
  | "loading"
  | "loadError"
  | "notEnrolled"
  | "inProgress"
  | "completed";

export interface CourseHomeDay {
  dayNumber: number;
  title: string;
  description: string | null;
  status: DayStatus;
  /** Day route for open days; null while the day is locked. */
  to: string | null;
}

export interface CourseHomeCourse {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  totalDays: number;
}

export interface CourseHomeViewModel {
  state: CourseHomeState;
  course: CourseHomeCourse | null;
  progress: CourseProgress | null;
  days: CourseHomeDay[];
  primaryCta: { label: string; to: string } | null;
  headline: string;
  description: string;
  error: unknown | null;
}

interface CourseHomeSnapshot {
  courseSlug?: string;
  course?: Record<string, unknown> | null;
  courseLoading?: boolean;
  courseError?: unknown;
  enrollment?: Record<string, unknown> | null;
  enrollmentLoading?: boolean;
  enrollmentError?: unknown;
}

const toPositiveInteger = (value: unknown, fallback: number) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

const normalizeCourse = (course: Record<string, unknown>): CourseHomeCourse => {
  const totalDays = toPositiveInteger(course.totalDays, 1);

  return {
    id: String(course._id ?? course.id ?? ""),
    slug: String(course.slug ?? ""),
    title: String(course.title ?? "Course"),
    description:
      course.description == null ? null : String(course.description),
    totalDays,
  };
};

const normalizeDays = (
  course: CourseHomeCourse,
  rawDays: Array<Record<string, unknown>> | null | undefined,
  currentDay: number,
): CourseHomeDay[] => {
  const count = rawDays?.length
    ? rawDays.length
    : course.totalDays;

  return Array.from({ length: count }, (_, index) => {
    const dayNumber = index + 1;
    const rawDay = rawDays?.[index];
    const status = getDayStatus(dayNumber, currentDay, course.totalDays);

    return {
      dayNumber,
      title: String(rawDay?.title ?? `Day ${dayNumber}`),
      description:
        rawDay?.description == null ? null : String(rawDay.description),
      status,
      to:
        status === "locked"
          ? null
          : `/app/courses/${course.slug}/learn/day/${dayNumber}`,
    };
  }).sort((a, b) => a.dayNumber - b.dayNumber);
};

const loadingViewModel = (): CourseHomeViewModel => ({
  state: "loading",
  course: null,
  progress: null,
  days: [],
  primaryCta: null,
  headline: "Loading course",
  description: "The course details are on their way.",
  error: null,
});

const errorViewModel = (error: unknown): CourseHomeViewModel => ({
  state: "loadError",
  course: null,
  progress: null,
  days: [],
  primaryCta: null,
  headline: "We couldn't load this course",
  description: "Try again and we'll fetch the course details.",
  error,
});

export function createCourseHomeViewModel(
  snapshot: CourseHomeSnapshot,
): CourseHomeViewModel {
  const courseIsReady = Boolean(snapshot.course) && !snapshot.courseError;
  const requiredDataIsLoading =
    snapshot.courseLoading || (courseIsReady && snapshot.enrollmentLoading);

  if (requiredDataIsLoading) {
    return loadingViewModel();
  }

  const error = snapshot.courseError || snapshot.enrollmentError;

  if (error || !snapshot.course) {
    return errorViewModel(
      error ?? new Error("Course data is unavailable"),
    );
  }

  const course = normalizeCourse(snapshot.course);
  const slug = course.slug || snapshot.courseSlug || "";
  const rawDays = Array.isArray(snapshot.course.days)
    ? (snapshot.course.days as Array<Record<string, unknown>>)
    : null;

  if (snapshot.enrollment?.enrolled !== true) {
    return {
      state: "notEnrolled",
      course,
      progress: null,
      days: normalizeDays(course, rawDays, 1).map((day) => ({
        ...day,
        status: "locked" as const,
        to: null,
      })),
      primaryCta: {
        label: "View course & enroll",
        to: `/courses/${slug}`,
      },
      headline: course.title,
      description:
        "Enroll to unlock every day and track your progress here.",
      error: null,
    };
  }

  const currentDay = toPositiveInteger(snapshot.enrollment.currentDay, 1);
  const totalDays = toPositiveInteger(
    rawDays?.length ?? snapshot.course.totalDays,
    course.totalDays,
  );
  const progress = createCourseProgress(currentDay, totalDays);
  const isCompleted = currentDay > totalDays;

  return {
    state: isCompleted ? "completed" : "inProgress",
    course,
    progress,
    days: normalizeDays(
      { ...course, totalDays },
      rawDays,
      currentDay,
    ),
    primaryCta: isCompleted
      ? { label: "Review Day 1", to: `/app/courses/${slug}/learn/day/1` }
      : currentDay <= 1
        ? { label: "Start Day 1", to: `/app/courses/${slug}/learn/day/1` }
        : {
            label: `Continue Day ${currentDay}`,
            to: `/app/courses/${slug}/learn/day/${currentDay}`,
          },
    headline: isCompleted
      ? "Course Complete"
      : currentDay <= 1
        ? "Start Day 1"
        : `Continue Day ${currentDay}`,
    description: isCompleted
      ? `You completed every day of ${course.title}. Every day is open for review.`
      : `${progress.completedDays} of ${totalDays} days completed.`,
    error: null,
  };
}
