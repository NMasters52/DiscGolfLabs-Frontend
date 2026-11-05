/**
 * View model for the Sessions page (the full practice-session history that
 * used to render inline on the lesson day page).
 *
 * The API's session ordering is not a contract, so rows are sorted
 * newest-first by createdAt here — the same rule the day page's
 * latest-session snapshot uses.
 */

export interface SessionRecord {
  id?: string | number;
  dayNumber?: number | null;
  maxDistanceFt?: number;
  durationSeconds?: number;
  createdAt: string;
  overall: { made: number; attempted: number; percentage: number };
  distanceStats?: Record<
    string,
    { made: number; attempted: number; percentage: number }
  >;
}

export type SessionsViewState =
  | "loading"
  | "loadError"
  | "notEnrolled"
  | "empty"
  | "ready";

export interface SessionDistanceRow {
  feetLabel: string;
  made: number;
  attempted: number;
  percentage: number;
}

export interface SessionRow {
  id: string | number;
  /** "Day 3", or "Session" when the record carries no day number. */
  heading: string;
  dateLabel: string;
  /**
   * "30/30(100%)" — the view renders it directly after the "Overall: "
   * label inside one element so spec regexes like /Overall:.*N\/N/
   * keep matching.
   */
  overallLabel: string;
  maxDistanceLabel: string;
  durationLabel: string;
  distanceRows: SessionDistanceRow[];
}

export interface SessionsViewModel {
  state: SessionsViewState;
  /** "Total Sessions: 4" — pinned text contract with the e2e suite. */
  totalSessionsLabel: string | null;
  rows: SessionRow[];
  /** Course home, offered to users without an active enrollment. */
  courseHref: string;
  errorMessage: string | null;
}

export function formatDuration(seconds?: number): string {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) return "—";
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function toSessionRow(session: SessionRecord): SessionRow {
  const distanceRows = Object.entries(session.distanceStats ?? {})
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([distance, stats]) => ({
      feetLabel: `${distance}ft`,
      made: stats.made,
      attempted: stats.attempted,
      percentage: stats.percentage,
    }));

  return {
    id: session.id ?? session.createdAt,
    heading: session.dayNumber ? `Day ${session.dayNumber}` : "Session",
    dateLabel: new Date(session.createdAt).toLocaleDateString(),
    overallLabel: `${session.overall.made}/${session.overall.attempted}(${session.overall.percentage}%)`,
    maxDistanceLabel: `${session.maxDistanceFt}ft`,
    durationLabel: formatDuration(session.durationSeconds),
    distanceRows,
  };
}

export function createSessionsViewModel({
  accessError,
  enrollmentPending,
  isEnrolled,
  sessions,
  sessionsLoading,
  sessionsError,
  courseSlug,
}: {
  accessError?: Error | null;
  enrollmentPending: boolean;
  isEnrolled: boolean;
  sessions?: SessionRecord[];
  sessionsLoading: boolean;
  sessionsError: Error | null;
  courseSlug: string;
}): SessionsViewModel {
  if (accessError) {
    return {
      state: "loadError",
      totalSessionsLabel: null,
      rows: [],
      courseHref: `/app/courses/${courseSlug}`,
      errorMessage: accessError.message,
    };
  }

  // Enrollment gates the sessions query, so its pending state settles
  // first; a not-enrolled user never loads sessions at all.
  if (enrollmentPending) {
    return {
      state: "loading",
      totalSessionsLabel: null,
      rows: [],
      courseHref: `/app/courses/${courseSlug}`,
      errorMessage: null,
    };
  }

  if (!isEnrolled) {
    return {
      state: "notEnrolled",
      totalSessionsLabel: null,
      rows: [],
      courseHref: `/app/courses/${courseSlug}`,
      errorMessage: null,
    };
  }

  if (sessionsLoading) {
    return {
      state: "loading",
      totalSessionsLabel: null,
      rows: [],
      courseHref: `/app/courses/${courseSlug}`,
      errorMessage: null,
    };
  }

  if (sessionsError) {
    return {
      state: "loadError",
      totalSessionsLabel: null,
      rows: [],
      courseHref: `/app/courses/${courseSlug}`,
      errorMessage: sessionsError.message || "Failed to fetch game sessions",
    };
  }

  if (!sessions?.length) {
    return {
      state: "empty",
      totalSessionsLabel: null,
      rows: [],
      courseHref: `/app/courses/${courseSlug}`,
      errorMessage: null,
    };
  }

  const rows = [...sessions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map(toSessionRow);

  return {
    state: "ready",
    totalSessionsLabel: `Total Sessions: ${rows.length}`,
    rows,
    courseHref: `/app/courses/${courseSlug}`,
    errorMessage: null,
  };
}
