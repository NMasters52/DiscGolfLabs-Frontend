import {
  CalendarDays,
  CircleDot,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react";
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
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-48 max-w-full" />
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <Skeleton className="size-9 rounded-md" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-16 max-w-full" />
                      <Skeleton className="h-4 w-20 max-w-full" />
                    </div>
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
  if (durationSeconds == null) return "—";

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function formatDate(createdAt: string | null) {
  if (!createdAt) return "—";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";

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
            <p className="font-mono text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {progress.completedDays} of {progress.totalDays}
              </span>{" "}
              days completed
            </p>
            <p className="font-mono text-xl font-semibold tabular-nums text-foreground">
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

interface SessionMetricRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function SessionMetricRow({
  icon: Icon,
  label,
  value,
}: SessionMetricRowProps) {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 break-words font-mono text-sm font-semibold tabular-nums text-foreground">
          {value}
        </dd>
      </div>
    </div>
  );
}

function LastSessionCard({ viewModel }: { viewModel: DashboardViewModel }) {
  const session = viewModel.latestSession;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Last session</CardTitle>
        <CardDescription>Your most recent putting session</CardDescription>
      </CardHeader>
      <CardContent>
        {!session ? (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>No sessions yet</p>
            <p>Your first session summary will appear here after you play.</p>
          </div>
        ) : (
          <dl className="divide-y divide-border/60">
            <SessionMetricRow
              icon={Target}
              label="Make rate"
              value={
                session.makeRate == null
                  ? "—"
                  : `${Math.round(session.makeRate)}%`
              }
            />
            <SessionMetricRow
              icon={CircleDot}
              label="Putts made"
              value={
                session.made == null || session.attempted == null
                  ? "—"
                  : `${session.made}/${session.attempted}`
              }
            />
            <SessionMetricRow
              icon={CalendarDays}
              label="Played"
              value={formatDate(session.createdAt)}
            />
            <SessionMetricRow
              icon={Timer}
              label="Duration"
              value={formatDuration(session.durationSeconds)}
            />
          </dl>
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
