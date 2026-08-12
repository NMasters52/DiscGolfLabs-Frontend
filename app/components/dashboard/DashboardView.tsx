import { CalendarDays, CircleDot, Target, Timer } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";
import type { DashboardViewModel } from "./view-model";

interface DashboardViewProps {
  viewModel: DashboardViewModel;
  onRetry: () => void;
}

function DashboardLoading() {
  return (
    <DashboardFrame>
      <div className="space-y-6" data-state="loading" aria-busy="true">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-7 w-12" />
            </div>
            <Skeleton className="h-2.5 w-full" />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="@container h-full">
            <CardContent className="grid flex-1 gap-4 @lg:grid-cols-[minmax(0,1fr)_8rem] @lg:items-center @lg:gap-6">
              <div className="min-w-0 space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full max-w-56" />
              </div>
              <Skeleton className="size-32 justify-self-center rounded-full @lg:justify-self-end" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-48 max-w-full" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="space-y-3 rounded-lg border bg-muted/20 p-4"
                  >
                    <Skeleton className="h-4 w-16 max-w-full" />
                    <Skeleton className="h-5 w-20 max-w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardFrame>
  );
}

function DashboardLoadError({ onRetry }: Pick<DashboardViewProps, "onRetry">) {
  return (
    <DashboardFrame>
      <Card role="alert" data-state="loadError">
        <CardHeader>
          <CardTitle>We couldn't load your dashboard</CardTitle>
          <CardDescription>
            Try again and we'll fetch your course progress again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetry}>Retry</Button>
        </CardContent>
      </Card>
    </DashboardFrame>
  );
}

function DashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </div>
  );
}

function formatDuration(durationSeconds: number | null) {
  if (durationSeconds == null) return null;

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function formatDate(createdAt: string | null) {
  if (!createdAt) return null;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function CourseSummary({ viewModel }: { viewModel: DashboardViewModel }) {
  const { course, progress } = viewModel;

  return (
    <Card className="border-l-4 border-l-primary" data-state={viewModel.state}>
      <CardHeader className="space-y-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Course progress
        </p>
        <CardTitle className="text-2xl sm:text-3xl">
          {viewModel.headline}
        </CardTitle>
        <CardDescription className="font-medium text-foreground">
          {course?.title ?? "Putting course"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {progress.completedDays} of {progress.totalDays}
              </span>{" "}
              days completed
            </p>
            <p className="text-xl font-semibold tabular-nums text-foreground">
              {progress.percent}%
            </p>
          </div>
          <Progress
            className="h-2.5"
            value={progress.percent}
            aria-label="Course progress"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MakeRateCard({ viewModel }: { viewModel: DashboardViewModel }) {
  const displayValue =
    viewModel.makeRate == null ? null : Math.round(viewModel.makeRate);
  const accessibleValue =
    displayValue == null ? "unavailable" : `${displayValue} percent`;
  const supportingCopy =
    viewModel.state === "firstSession"
      ? "Complete your first session to establish a make rate."
      : displayValue == null
        ? "Your 30-day make rate is unavailable."
        : "Your completed sessions from the last 30 days.";

  return (
    <Card className="@container h-full">
      <CardContent className="grid flex-1 gap-4 @lg:grid-cols-[minmax(0,1fr)_8rem] @lg:items-center @lg:gap-6">
        <div className="min-w-0 space-y-2">
          <CardTitle className="whitespace-nowrap text-base">
            Make rate
          </CardTitle>
          <CardDescription>{supportingCopy}</CardDescription>
        </div>

        <div
          className="relative size-32 justify-self-center text-foreground @lg:justify-self-end"
          role="img"
          aria-label={`Current 30-day make rate: ${accessibleValue}`}
        >
          <svg aria-hidden="true" className="size-full" viewBox="0 0 120 120">
            <circle
              className="stroke-muted"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
            />
            {viewModel.makeRate != null && viewModel.makeRate > 0 && (
              <circle
                className="stroke-accent"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                pathLength="100"
                strokeDasharray={`${viewModel.makeRate} 100`}
                strokeLinecap="round"
                strokeWidth="10"
                transform="rotate(-90 60 60)"
              />
            )}
          </svg>
          <span className="absolute inset-0 grid place-items-center font-mono text-3xl font-semibold tabular-nums tracking-tight">
            {displayValue == null ? "—" : `${displayValue}%`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function LastSessionCard({ viewModel }: { viewModel: DashboardViewModel }) {
  const session = viewModel.latestSession;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Last session</CardTitle>
        <CardDescription>Your most recent putting session</CardDescription>
      </CardHeader>
      <CardContent>
        {!session ? (
          <p className="text-sm text-muted-foreground">
            Complete your first putting session to see its practice summary
            here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="min-w-0 space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="size-4 shrink-0" aria-hidden="true" />
                <p className="font-medium">Make rate</p>
              </div>
              <p className="font-semibold tabular-nums">
                {session.makeRate == null
                  ? "—"
                  : `${Math.round(session.makeRate)}%`}
              </p>
            </div>
            <div className="min-w-0 space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CircleDot className="size-4 shrink-0" aria-hidden="true" />
                <p className="font-medium">Putts</p>
              </div>
              <p className="font-semibold tabular-nums">
                {session.made == null || session.attempted == null
                  ? "—"
                  : `${session.made}/${session.attempted}`}
              </p>
            </div>
            <div className="min-w-0 space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                <p className="font-medium">Date</p>
              </div>
              <p className="font-semibold tabular-nums">
                {formatDate(session.createdAt) ?? "—"}
              </p>
            </div>
            <div className="min-w-0 space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="size-4 shrink-0" aria-hidden="true" />
                <p className="font-medium">Duration</p>
              </div>
              <p className="font-semibold tabular-nums">
                {formatDuration(session.durationSeconds) ?? "—"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardView({ viewModel, onRetry }: DashboardViewProps) {
  if (viewModel.state === "loading") return <DashboardLoading />;
  if (viewModel.state === "loadError") {
    return <DashboardLoadError onRetry={onRetry} />;
  }

  return (
    <DashboardFrame>
      <div className="space-y-6">
        <CourseSummary viewModel={viewModel} />
        <div className="grid gap-6 md:grid-cols-2">
          <MakeRateCard viewModel={viewModel} />
          <LastSessionCard viewModel={viewModel} />
        </div>
      </div>
    </DashboardFrame>
  );
}
