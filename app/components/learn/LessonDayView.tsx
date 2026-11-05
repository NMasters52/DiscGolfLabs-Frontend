import type { ReactNode } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import type { LessonDayViewModel } from "./lesson-day-view-model";

interface LessonDayViewProps {
  viewModel: LessonDayViewModel;
  onComplete: () => void;
  isPending: boolean;
  /** Rendered as an inline alert under the completion controls. */
  errorMessage: string | null;
  /**
   * The practice game and progress summary arrive as slots so this typed
   * view never has to import the untyped (.jsx) game components directly —
   * the route wires them, this view only positions them.
   */
  gameSlot: ReactNode;
  progressSlot: ReactNode;
}

/** Mirrors CourseHomeFrame: the muted canvas with a centered reading column. */
function LessonFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">{children}</div>
    </div>
  );
}

export function LessonDayView({
  viewModel,
  onComplete,
  isPending,
  errorMessage,
  gameSlot,
  progressSlot,
}: LessonDayViewProps) {
  return (
    <LessonFrame>
      {/* Lesson header: identity, copy, and the completion controls. Day
          navigation lives in the sidebar's course-days list. */}
      <Card className="border-l-4 border-l-primary" data-state="lesson-header">
        <CardHeader className="space-y-3">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {viewModel.eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {viewModel.heading}
          </h1>
          <CardDescription className="max-w-prose font-medium text-foreground">
            {viewModel.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {/*
              Completion mirrors the API's exact-match guard: only the
              current day can complete. Days already done grey out instead
              of sending a replay that the endpoint would reject, and the
              forward CTA appears only once this day is done.
            */}
            {viewModel.canComplete ? (
              <Button
                className="min-h-11 sm:min-w-40"
                onClick={onComplete}
                disabled={isPending}
                aria-busy={isPending || undefined}
                data-state={isPending ? "completing" : "idle"}
              >
                {isPending ? "Completing…" : "Complete Day"}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="min-h-11 sm:min-w-40"
                disabled
                data-state="completed"
              >
                Completed ✓
              </Button>
            )}
            {viewModel.continueCta && (
              <Button asChild className="min-h-11" data-state="continue-day">
                <Link to={viewModel.continueCta.href}>
                  {viewModel.continueCta.label}
                </Link>
              </Button>
            )}
          </div>
          {errorMessage && (
            <p
              role="alert"
              data-state="completeError"
              className="mt-3 text-sm font-medium text-destructive"
            >
              {errorMessage}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Practice: the putting ladder game widget. */}
      <Card data-state="lesson-practice">
        <CardHeader>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Practice
          </p>
          <h2 className="text-base font-semibold leading-none">
            Putting ladder
          </h2>
          <CardDescription>
            Five putts per round. Make at least three and the basket steps
            back 5ft, from 10ft up to 35ft.
          </CardDescription>
        </CardHeader>
        <CardContent>{gameSlot}</CardContent>
      </Card>

      {/* Progress: latest-session snapshot linking to the full sessions page. */}
      <Card data-state="lesson-progress">
        <CardHeader>
          <h2 className="text-base font-semibold leading-none">
            Your Putting Progress
          </h2>
          <CardDescription>
            Your most recent recorded session from the putting ladder.
          </CardDescription>
        </CardHeader>
        <CardContent>{progressSlot}</CardContent>
      </Card>
    </LessonFrame>
  );
}
