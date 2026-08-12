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
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_8rem] md:items-center">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full max-w-56" />
              </div>
              <Skeleton className="size-32 justify-self-center rounded-full md:justify-self-end" />
            </CardContent>
          </Card>
          <Skeleton className="min-h-48 w-full rounded-xl" />
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
      <CardHeader>
        <CardTitle className="text-2xl">{viewModel.headline}</CardTitle>
        <CardDescription>
          {course?.title ?? "Putting course"} · {viewModel.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={progress.percent} aria-label="Course progress" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Course progress</span>
            <span>{progress.percent}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {progress.completedDays} of {progress.totalDays} days completed
        </p>
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
    <Card className="h-full">
      <CardContent className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1fr)_8rem] md:items-center">
        <div className="space-y-2">
          <CardTitle className="text-base">Make rate</CardTitle>
          <CardDescription>{supportingCopy}</CardDescription>
        </div>

        <div
          className="relative size-32 justify-self-center text-foreground md:justify-self-end"
          role="img"
          aria-label={`Current 30-day make rate: ${accessibleValue}`}
        >
          <svg
            aria-hidden="true"
            className="size-full"
            viewBox="0 0 120 120"
          >
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
            No sessions yet. Your first session summary will appear here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Make rate</p>
              <p className="font-semibold">
                {session.makeRate == null
                  ? "—"
                  : `${Math.round(session.makeRate)}%`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Putts</p>
              <p className="font-semibold">
                {session.made == null || session.attempted == null
                  ? "—"
                  : `${session.made}/${session.attempted}`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Max distance</p>
              <p className="font-semibold">
                {session.maxDistanceFt == null ? "—" : `${session.maxDistanceFt}ft`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-semibold">{formatDate(session.createdAt) ?? "—"}</p>
            </div>
            {formatDuration(session.durationSeconds) && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-semibold">
                  {formatDuration(session.durationSeconds)}
                </p>
              </div>
            )}
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
