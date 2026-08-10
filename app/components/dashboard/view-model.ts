export type DashboardState =
  | "loading"
  | "loadError"
  | "notEnrolled"
  | "firstSession"
  | "inProgress"
  | "completed";

export interface DashboardCourse {
  id: string;
  slug: string;
  title: string;
  totalDays: number;
}

export interface DashboardProgress {
  completedDays: number;
  totalDays: number;
  percent: number;
}

export interface DashboardSession {
  id: string;
  dayNumber: number | null;
  made: number | null;
  attempted: number | null;
  makeRate: number | null;
  maxDistanceFt: number | null;
  durationSeconds: number | null;
  createdAt: string | null;
}

export interface DashboardViewModel {
  state: DashboardState;
  course: DashboardCourse | null;
  progress: DashboardProgress;
  currentDay: number | null;
  headline: string;
  description: string;
  makeRate: number | null;
  latestSession: DashboardSession | null;
  error: unknown | null;
}

interface DashboardSnapshot {
  course?: Record<string, unknown> | null;
  enrollment?: Record<string, unknown> | null;
  stats?: Record<string, any> | null;
  sessions?: Array<Record<string, any>> | null;
  courseLoading?: boolean;
  enrollmentLoading?: boolean;
  statsLoading?: boolean;
  sessionsLoading?: boolean;
  courseError?: unknown;
  enrollmentError?: unknown;
  statsError?: unknown;
  sessionsError?: unknown;
}

const toPositiveInteger = (value: unknown, fallback: number) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

const toNonNegativeNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

const toOptionalNonNegativeNumber = (value: unknown): number | null => {
  if (value == null) return null;

  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

const toOptionalPercentage = (value: unknown): number | null => {
  if (value == null) return null;

  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 100
    ? number
    : null;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const createProgress = (
  currentDay: number,
  totalDays: number,
): DashboardProgress => {
  const completedDays = clamp(currentDay - 1, 0, totalDays);

  return {
    completedDays,
    totalDays,
    percent: Math.round((completedDays / totalDays) * 100),
  };
};

const normalizeCourse = (
  course: Record<string, unknown>,
  enrollment: Record<string, unknown> | null | undefined,
): DashboardCourse => {
  const totalDays = toPositiveInteger(
    course.totalDays ?? enrollment?.totalDays,
    1,
  );

  return {
    id: String(course._id ?? course.id ?? ""),
    slug: String(course.slug ?? ""),
    title: String(course.title ?? "Putting course"),
    totalDays,
  };
};

const normalizeSession = (
  session: Record<string, any>,
): DashboardSession => ({
  id: String(session.id ?? session._id ?? ""),
  dayNumber:
    session.dayNumber == null ? null : toPositiveInteger(session.dayNumber, 1),
  made: toOptionalNonNegativeNumber(session.overall?.made),
  attempted: toOptionalNonNegativeNumber(session.overall?.attempted),
  makeRate: toOptionalPercentage(session.overall?.percentage),
  maxDistanceFt:
    session.maxDistanceFt == null
      ? null
      : toNonNegativeNumber(session.maxDistanceFt),
  durationSeconds:
    session.durationSeconds == null
      ? null
      : toNonNegativeNumber(session.durationSeconds),
  createdAt: session.createdAt == null ? null : String(session.createdAt),
});

const loadingViewModel = (): DashboardViewModel => ({
  state: "loading",
  course: null,
  progress: { completedDays: 0, totalDays: 1, percent: 0 },
  currentDay: null,
  headline: "Loading your dashboard",
  description: "Your course progress is on its way.",
  makeRate: null,
  latestSession: null,
  error: null,
});

const errorViewModel = (error: unknown): DashboardViewModel => ({
  state: "loadError",
  course: null,
  progress: { completedDays: 0, totalDays: 1, percent: 0 },
  currentDay: null,
  headline: "We couldn't load your dashboard",
  description: "Try again and we'll fetch your course progress again.",
  makeRate: null,
  latestSession: null,
  error,
});

export function createDashboardViewModel(
  snapshot: DashboardSnapshot,
): DashboardViewModel {
  const courseIsReady = Boolean(snapshot.course) && !snapshot.courseError;
  const requiredDataIsLoading =
    snapshot.courseLoading ||
    (courseIsReady && snapshot.enrollmentLoading) ||
    (snapshot.enrollment?.enrolled === true &&
      (snapshot.statsLoading || snapshot.sessionsLoading));

  if (requiredDataIsLoading) {
    return loadingViewModel();
  }

  const error =
    snapshot.courseError ||
    snapshot.enrollmentError ||
    (snapshot.enrollment?.enrolled === true && snapshot.statsError) ||
    (snapshot.enrollment?.enrolled === true && snapshot.sessionsError);

  if (error) {
    return errorViewModel(error);
  }

  if (!snapshot.course || !snapshot.enrollment) {
    return errorViewModel(new Error("Dashboard data is unavailable"));
  }

  const course = normalizeCourse(snapshot.course, snapshot.enrollment);

  if (snapshot.enrollment.enrolled !== true) {
    return {
      state: "notEnrolled",
      course,
      progress: { completedDays: 0, totalDays: course.totalDays, percent: 0 },
      currentDay: null,
      headline: "Enroll to start",
      description: "Join the putting course to see your first day here.",
      makeRate: null,
      latestSession: null,
      error: null,
    };
  }

  const currentDay = toPositiveInteger(snapshot.enrollment.currentDay, 1);
  const progress = createProgress(currentDay, course.totalDays);
  const sessions = snapshot.sessions ?? [];
  const latestSession =
    sessions.length > 0 ? normalizeSession(sessions[sessions.length - 1]) : null;
  const isCompleted = currentDay > course.totalDays;
  const hasSessions = sessions.length > 0;

  return {
    state: isCompleted
      ? "completed"
      : hasSessions
        ? "inProgress"
        : "firstSession",
    course,
    progress: isCompleted
      ? { completedDays: course.totalDays, totalDays: course.totalDays, percent: 100 }
      : progress,
    currentDay,
    headline: isCompleted
      ? "Course Complete"
      : hasSessions
        ? `Continue Day ${currentDay}`
        : "Start Day 1",
    description: isCompleted
      ? "You completed every day of the putting course."
      : hasSessions
        ? `${progress.completedDays} of ${course.totalDays} days completed.`
        : "Your first session will give your progress a place to start.",
    makeRate: hasSessions
      ? toOptionalPercentage(snapshot.stats?.overall?.makeRate)
      : null,
    latestSession,
    error: null,
  };
}
