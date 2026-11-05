import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import type { SessionsViewModel } from "./view-model";

interface SessionsViewProps {
  viewModel: SessionsViewModel;
}

/** Mirrors LessonDayView's LessonFrame: the muted canvas with a centered column. */
export function SessionsView({ viewModel }: SessionsViewProps) {
  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {viewModel.state === "loading" && (
          <p
            data-state="loading"
            aria-busy="true"
            className="text-sm text-muted-foreground"
          >
            Loading your sessions…
          </p>
        )}

        {viewModel.state === "loadError" && (
          <p
            role="alert"
            data-state="loadError"
            className="text-sm font-medium text-destructive"
          >
            Error: {viewModel.errorMessage}
          </p>
        )}

        {viewModel.state === "notEnrolled" && (
          <Card data-state="notEnrolled">
            <CardHeader>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Sessions
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Your practice sessions
              </h1>
              <CardDescription className="max-w-prose font-medium text-foreground">
                Enroll in the putting course to start recording sessions —
                every completed game shows up here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to={viewModel.courseHref}
                className="inline-flex items-center gap-1 font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary hover:underline"
              >
                Go to the course <span aria-hidden="true">→</span>
              </Link>
            </CardContent>
          </Card>
        )}

        {viewModel.state === "empty" && (
          <Card data-state="empty">
            <CardHeader>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Sessions
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Your practice sessions
              </h1>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No sessions yet. Play your first game!
              </p>
            </CardContent>
          </Card>
        )}

        {viewModel.state === "ready" && (
          <>
            <Card data-state="sessions-header">
              <CardHeader className="space-y-3">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  Sessions
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Your practice sessions
                </h1>
                <CardDescription className="max-w-prose font-medium text-foreground">
                  Every recorded game from the putting ladder, newest first.
                </CardDescription>
                <p
                  data-state="total-sessions"
                  className="font-mono text-sm font-medium tabular-nums text-foreground"
                >
                  {viewModel.totalSessionsLabel}
                </p>
              </CardHeader>
            </Card>

            {/* One listitem per session — the e2e persistence proof counts
                these via the list's accessible name (the app shell's nav
                also renders listitems, so the count must be scoped). */}
            <ul className="space-y-4" aria-label="Session history" data-state="session-list">
              {viewModel.rows.map((row) => (
                <li key={row.id}>
                  <Card data-state="session-card">
                    <CardHeader className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h2 className="text-base font-semibold leading-none">
                          {row.heading}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {row.dateLabel}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            Overall:
                          </span>{" "}
                          <span className="font-mono tabular-nums text-foreground">
                            {row.overallLabel}
                          </span>
                        </p>
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            Max Distance
                          </span>
                          <span className="font-mono font-semibold tabular-nums text-foreground">
                            {row.maxDistanceLabel}
                          </span>
                        </p>
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            Duration
                          </span>
                          <span className="font-mono tabular-nums text-foreground">
                            {row.durationLabel}
                          </span>
                        </p>
                      </div>

                      {row.distanceRows.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            Performance by Distance
                          </p>
                          <div className="space-y-1">
                            {row.distanceRows.map((distance) => (
                              <div
                                key={distance.feetLabel}
                                className="grid grid-cols-[2.5rem_5rem_minmax(0,1fr)] items-center gap-2"
                              >
                                <span className="font-mono text-xs font-medium text-foreground">
                                  {distance.feetLabel}
                                </span>
                                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                                  {distance.made}/{distance.attempted} (
                                  {distance.percentage}%)
                                </span>
                                <progress
                                  value={distance.percentage}
                                  max="100"
                                  className="h-2 w-full min-w-0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
