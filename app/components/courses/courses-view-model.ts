// @ts-expect-error Node's native type stripping requires the explicit extension.
import { createCourseProgress, type CourseProgress } from "./course-progress.ts";

export type CoursesPageState = "loading" | "loadError" | "empty" | "ready";

export type CourseCardStatus =
  | "loading"
  | "error"
  | "notEnrolled"
  | "inProgress"
  | "completed";

export interface CourseCardViewModel {
  courseId: string;
  slug: string;
  title: string;
  description: string | null;
  priceInCents: number | null;
  totalDays: number;
  status: CourseCardStatus;
  progress: CourseProgress | null;
  currentDay: number | null;
  error: unknown | null;
}

export interface CoursesViewModel {
  state: CoursesPageState;
  cards: CourseCardViewModel[];
  error: unknown | null;
}

/** Keep the sheet selection only while its course has a visible card. */
export function reconcileSheetCourseId(
  viewModel: CoursesViewModel,
  courseId: string | null,
): string | null {
  if (
    courseId === null ||
    viewModel.state !== "ready" ||
    !viewModel.cards.some((card) => card.courseId === courseId)
  ) {
    return null;
  }

  return courseId;
}

/** What clicking a course card should do, resolved from the card's state. */
export type CourseCardAction =
  | { type: "navigate"; to: string }
  | { type: "openSheet"; courseId: string; slug: string }
  | { type: "none" };

/**
 * Structural subset of a TanStack enrollment-check result, so the route can
 * pass query results straight through.
 */
interface EnrollmentResult {
  data?: { enrolled?: unknown; currentDay?: unknown; totalDays?: unknown } | null;
  isPending?: boolean;
  error?: unknown;
}

interface CourseCardSnapshot {
  course: Record<string, unknown>;
  enrollment?: EnrollmentResult | null;
}

interface CoursesSnapshot {
  courses?: Array<Record<string, unknown>> | null;
  coursesLoading?: boolean;
  coursesError?: unknown;
  enrollmentResults?: Array<EnrollmentResult | null> | null;
}

const toPositiveInteger = (value: unknown, fallback: number) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export function createCourseCardViewModel(
  snapshot: CourseCardSnapshot,
): CourseCardViewModel {
  const course = snapshot.course;
  const enrollment = snapshot.enrollment;
  const totalDays = toPositiveInteger(course.totalDays, 1);

  const card: CourseCardViewModel = {
    courseId: String(course._id ?? course.id ?? ""),
    slug: String(course.slug ?? ""),
    title: String(course.title ?? "Course"),
    description:
      course.description == null ? null : String(course.description),
    priceInCents:
      course.priceInCents == null ? null : Number(course.priceInCents),
    totalDays,
    status: "loading",
    progress: null,
    currentDay: null,
    error: null,
  };

  // No enrollment result yet (the list resolved before its checks did), or
  // the check is still in flight: keep the card in its loading state.
  if (!enrollment || enrollment.isPending) {
    return card;
  }

  if (enrollment.error) {
    return { ...card, status: "error", error: enrollment.error };
  }

  const data = enrollment.data;

  if (data?.enrolled !== true) {
    return { ...card, status: "notEnrolled" };
  }

  const currentDay = toPositiveInteger(data.currentDay, 1);
  const effectiveTotalDays = toPositiveInteger(
    data.totalDays ?? course.totalDays,
    totalDays,
  );

  return {
    ...card,
    status: currentDay > effectiveTotalDays ? "completed" : "inProgress",
    progress: createCourseProgress(currentDay, effectiveTotalDays),
    currentDay,
  };
}

export function resolveCardAction(
  card: CourseCardViewModel,
): CourseCardAction {
  if (card.status === "inProgress" || card.status === "completed") {
    return { type: "navigate", to: `/app/courses/${card.slug}` };
  }

  if (card.status === "notEnrolled" || card.status === "error") {
    return { type: "openSheet", courseId: card.courseId, slug: card.slug };
  }

  return { type: "none" };
}

export function createCoursesViewModel(
  snapshot: CoursesSnapshot,
): CoursesViewModel {
  if (snapshot.coursesLoading) {
    return { state: "loading", cards: [], error: null };
  }

  // A failed background refresh can leave the last successful list in cache.
  // Keep those cards usable; only show the page-level error when there is no
  // course data to render.
  if (snapshot.coursesError && snapshot.courses == null) {
    return {
      state: "loadError",
      cards: [],
      error: snapshot.coursesError,
    };
  }

  const courses = snapshot.courses;

  if (!courses || courses.length === 0) {
    return { state: "empty", cards: [], error: null };
  }

  return {
    state: "ready",
    cards: courses.map((course, index) =>
      createCourseCardViewModel({
        course,
        enrollment: snapshot.enrollmentResults?.[index] ?? null,
      }),
    ),
    error: null,
  };
}
