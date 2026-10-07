import { CheckCircle2, ChevronRight, Lock, Play } from "lucide-react";
import { Link } from "react-router";
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
import type { CourseHomeViewModel } from "./course-home-view-model";

interface CourseHomeViewProps {
  viewModel: CourseHomeViewModel;
  onRetry: () => void;
  isRetrying?: boolean;
}

function CourseHomeFrame({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="sr-only">{title}</h1>
        {children}
      </div>
    </div>
  );
}

function CourseHomeLoading() {
  return (
    <div className="space-y-6" data-state="loading" aria-busy="true">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="space-y-3">
          <Skeleton className="h-3 w-24" />
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

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-48 max-w-full" />
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <Skeleton className="size-9 rounded-md" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16 max-w-full" />
                  <Skeleton className="h-4 w-24 max-w-full" />
                </div>
                <Skeleton className="h-5 w-14" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseHomeLoadError({
  onRetry,
  isRetrying,
}: Pick<CourseHomeViewProps, "onRetry" | "isRetrying">) {
  return (
    <Card role="alert" data-state="loadError">
      <CardHeader>
        <CardTitle>We couldn't load this course</CardTitle>
        <CardDescription>
          Try again and we'll fetch the course details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="min-h-11" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? "Retrying…" : "Retry"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Not an alert: the API answered — this slug has no course — so there is
// nothing to retry and the way forward is the courses index.
function CourseHomeNotFound({
  cta,
}: {
  cta: CourseHomeViewModel["primaryCta"];
}) {
  return (
    <Card data-state="notFound">
      <CardHeader>
        <CardTitle>We couldn't find that course</CardTitle>
        <CardDescription>
          It may have been renamed or retired. Browse the courses index to
          find it.
        </CardDescription>
      </CardHeader>
      {cta && (
        <CardContent>
          <Button className="min-h-11" asChild>
            <Link to={cta.to}>{cta.label}</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

function CourseSummary({ viewModel }: { viewModel: CourseHomeViewModel }) {
  const { course, progress } = viewModel;

  return (
    <Card
      className="border-l-4 border-l-primary"
      data-state={viewModel.state}
    >
      <CardHeader className="space-y-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {course?.title ?? "Course"}
        </p>
        <CardTitle className="text-2xl sm:text-3xl">
          {viewModel.headline}
        </CardTitle>
        <CardDescription className="font-medium text-foreground">
          {viewModel.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {progress ? (
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
        ) : (
          <p className="text-sm text-muted-foreground">
            {course?.description}
          </p>
        )}

        {viewModel.primaryCta && (
          <Button asChild className="min-h-11">
            <Link to={viewModel.primaryCta.to}>
              {viewModel.primaryCta.label}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function DayList({ viewModel }: { viewModel: CourseHomeViewModel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Course days</CardTitle>
        <CardDescription>
          {viewModel.state === "completed"
            ? "Every day is open for review."
            : "Work through the days in order."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border/60">
          {viewModel.days.map((day) => {
            const to = day.to;

            // first:/last: must sit on the li — on the row element they
            // always match, because each row is its li's only child.
            return (
              <li
                key={day.dayNumber}
                className="py-2.5 first:pt-0 last:pb-0"
              >
                {to != null ? (
                  <Link
                    to={to}
                    data-status={day.status}
                    className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 transition-colors hover:bg-muted/40 focus-visible:bg-muted/40"
                  >
                    <DayRow day={day} />
                  </Link>
                ) : (
                  <div
                    data-status={day.status}
                    aria-disabled="true"
                    className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3"
                  >
                    <DayRow day={day} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function DayRow({ day }: { day: CourseHomeViewModel["days"][number] }) {
  const Icon =
    day.status === "completed"
      ? CheckCircle2
      : day.status === "current"
        ? Play
        : Lock;

  return (
    <>
      <div
        className={`grid size-9 place-items-center rounded-md ${
          day.status === "locked"
            ? "bg-muted text-muted-foreground"
            : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Day {day.dayNumber}
        </p>
        <p className="mt-0.5 truncate text-base font-semibold text-foreground">
          {day.title}
        </p>
      </div>
      <div className="flex items-center gap-1 font-mono text-sm font-medium">
        {day.status === "completed" && (
          <>
            <span className="sr-only">
              Day {day.dayNumber} completed. Open day {day.dayNumber} for
              review.
            </span>
            <span aria-hidden="true" className="text-muted-foreground">
              Review
            </span>
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </>
        )}
        {day.status === "current" && (
          <>
            <span className="sr-only">
              Open day {day.dayNumber}, your current day.
            </span>
            <span aria-hidden="true">Continue</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </>
        )}
        {day.status === "locked" && (
          <span className="text-muted-foreground">
            Locked
            <span className="sr-only">
              Complete the previous days to unlock day {day.dayNumber}.
            </span>
          </span>
        )}
      </div>
    </>
  );
}

export function CourseHomeView({
  viewModel,
  onRetry,
  isRetrying,
}: CourseHomeViewProps) {
  if (viewModel.state === "loading") {
    return (
      <CourseHomeFrame
        title={viewModel.course?.title ?? "Course"}
      >
        <CourseHomeLoading />
      </CourseHomeFrame>
    );
  }

  if (viewModel.state === "loadError") {
    return (
      <CourseHomeFrame title="Course">
        <CourseHomeLoadError onRetry={onRetry} isRetrying={isRetrying} />
      </CourseHomeFrame>
    );
  }

  if (viewModel.state === "notFound") {
    return (
      <CourseHomeFrame title="Course">
        <CourseHomeNotFound cta={viewModel.primaryCta} />
      </CourseHomeFrame>
    );
  }

  return (
    <CourseHomeFrame title={viewModel.course?.title ?? "Course"}>
      <div className="space-y-6">
        <CourseSummary viewModel={viewModel} />
        <DayList viewModel={viewModel} />
      </div>
    </CourseHomeFrame>
  );
}
