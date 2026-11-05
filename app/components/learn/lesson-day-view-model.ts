/**
 * View model for the lesson day page — the same seam `CourseHomeView` uses:
 * the route stays a thin data/behavior shell and the view renders from
 * prebuilt copy, so presentation never re-derives lesson state.
 *
 * Day state derives from the enrollment's single progress field
 * (`currentDay`), mirroring `course-progress.ts`: a day below currentDay is
 * completed, the equal day is current, anything above is locked. The API's
 * complete-day endpoint only accepts the exact current day, so the view
 * disables completion for days already done — a replay never sends a
 * request, which is what keeps revisited days (mid-course or after
 * finishing the course) from hitting the API's "Day cannot be completed"
 * error.
 */

/** The canonical learn-day URL, shared by chips and the continue CTA. */
export function learnDayHref(courseSlug: string, day: number): string {
  return `/app/courses/${courseSlug}/learn/day/${day}`;
}

export type LessonDayState = "completed" | "current" | "locked";

export function getLessonDayState(
  day: number,
  currentDay: number,
): LessonDayState {
  if (day < currentDay) {
    return "completed";
  }
  if (day === currentDay) {
    return "current";
  }
  return "locked";
}

export interface ContinueCtaModel {
  label: string;
  href: string;
}

export interface LessonDayViewModelInput {
  courseTitle: string;
  dayNumber: number;
  totalDays: number;
  title: string;
  description: string;
  /**
   * The enrollment's progress marker (1-based; exceeds totalDays once the
   * course is finished — every day reads as completed then).
   */
  currentDay: number;
  courseSlug: string;
}

export interface LessonDayViewModel {
  /** Small uppercase eyebrow above the heading (the course's title). */
  eyebrow: string;
  /** The page h1: "Day N: Lesson title". Pinned by spec as /^Day N:/. */
  heading: string;
  /** Lesson description from course.days data — content must not change. */
  description: string;
  dayState: LessonDayState;
  /** Only the current day can be completed — mirrors the API's exact-match guard. */
  canComplete: boolean;
  /**
   * Forward navigation once this day is done: the next day's URL, or the
   * course home when this was the final day.
   */
  continueCta: ContinueCtaModel | null;
}

export function buildLessonDayViewModel(
  input: LessonDayViewModelInput,
): LessonDayViewModel {
  const dayState = getLessonDayState(input.dayNumber, input.currentDay);

  let continueCta: ContinueCtaModel | null = null;
  if (dayState === "completed") {
    const nextDay = input.dayNumber + 1;
    continueCta =
      nextDay <= input.totalDays
        ? {
            label: `Continue to Day ${nextDay}`,
            href: learnDayHref(input.courseSlug, nextDay),
          }
        : {
            label: "Finish Course",
            href: `/app/courses/${input.courseSlug}`,
          };
  }

  return {
    eyebrow: input.courseTitle || "Course",
    heading: `Day ${input.dayNumber}: ${input.title}`,
    description: input.description,
    dayState,
    canComplete: dayState === "current",
    continueCta,
  };
}
