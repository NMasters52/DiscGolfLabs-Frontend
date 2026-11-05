import { Link } from "react-router";
import { useGameSessions } from "../../queries/useGameSession";

/**
 * The Sessions page route. Exported so the day-page link and the Sessions
 * page itself share one source of truth.
 */
export const SESSIONS_HREF = "/app/sessions";

/**
 * Compact progress summary for the lesson day page: the latest recorded
 * session plus a link to the full history on the Sessions page. The full
 * session list (and the "Total Sessions" counter) live on the Sessions
 * page now. Pinned text contract kept here: "Overall: made/attempted(pct)%"
 * renders with the label and fraction inside one element so spec regexes
 * like /Overall:.*N\/N/ keep matching.
 */
export function PuttingProgressView({ gameSlug, courseId }) {
  const {
    data: sessions,
    isLoading,
    error,
  } = useGameSessions(gameSlug, courseId);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground" data-state="loading">
        Loading your progress…
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm font-medium text-destructive">
        Error: {error.message}
      </p>
    );
  }

  if (!sessions?.length) {
    return (
      <p className="text-sm text-muted-foreground" data-state="empty">
        No sessions yet. Play your first game!
      </p>
    );
  }

  // The API's ordering isn't a contract — pick the newest by timestamp.
  const latest = sessions.reduce((newest, session) =>
    new Date(session.createdAt).getTime() >
    new Date(newest.createdAt).getTime()
      ? session
      : newest,
  );

  return (
    <div className="space-y-4" data-state="latest-session">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          Latest session
          {latest.dayNumber && ` • Day ${latest.dayNumber}`}
        </h3>
        <p className="shrink-0 text-xs text-muted-foreground">
          {new Date(latest.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-1.5 text-sm">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Overall:
          </span>{" "}
          <span className="font-mono tabular-nums text-foreground">
            {latest.overall.made}/
            {latest.overall.attempted}({latest.overall.percentage}%)
          </span>
        </p>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Max Distance
          </span>
          <span className="font-mono font-semibold tabular-nums text-foreground">
            {latest.maxDistanceFt}ft
          </span>
        </p>
      </div>

      <Link
        to={SESSIONS_HREF}
        data-state="view-all-sessions"
        className="inline-flex items-center gap-1 font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary hover:underline"
      >
        View all sessions <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
