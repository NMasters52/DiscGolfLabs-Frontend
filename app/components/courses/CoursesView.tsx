import { useRef } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
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
import { CourseAccessSheet } from "~/components/courses/CourseAccessSheet";
import {
  resolveCardAction,
  type CourseCardStatus,
  type CourseCardViewModel,
  type CoursesViewModel,
} from "./courses-view-model";

interface CoursesViewProps {
  viewModel: CoursesViewModel;
  onRetry: () => void;
  isRetrying?: boolean;
  sheetCard: CourseCardViewModel | null;
  /** Opens the sheet for a card's course; closes it when passed null. */
  onOpenSheet: (courseId: string | null) => void;
  onSheetRetry: () => void;
  isSheetRetrying?: boolean;
}

function CoursesFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="sr-only">Courses</h1>
        {children}
      </div>
    </div>
  );
}

function CoursesLoading() {
  return (
    <div className="space-y-6" data-state="loading" aria-busy="true">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-6 w-32 max-w-1/2" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full max-w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-40 max-w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CoursesLoadError({
  onRetry,
  isRetrying,
}: Pick<CoursesViewProps, "onRetry" | "isRetrying">) {
  return (
    <Card role="alert" data-state="loadError">
      <CardHeader>
        <CardTitle>We couldn't load your courses</CardTitle>
        <CardDescription>
          Try again and we'll fetch the course list.
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

function CoursesEmpty() {
  return (
    <Card data-state="empty">
      <CardHeader>
        <CardTitle>No courses yet</CardTitle>
        <CardDescription>
          Courses will appear here as soon as they're published.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

const statusBadge: Record<
  Exclude<CourseCardStatus, "loading">,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  notEnrolled: { label: "Not enrolled", variant: "outline" },
  inProgress: { label: "In progress", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  error: { label: "Check failed", variant: "outline" },
};

function formatPrice(priceInCents: number | null) {
  if (priceInCents == null || Number.isNaN(Number(priceInCents))) return null;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(priceInCents) / 100);
}

const cardShellClassName =
  "block h-full w-full rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none";

function CourseCard({
  card,
  onOpenCard,
}: {
  card: CourseCardViewModel;
  onOpenCard: (card: CourseCardViewModel) => void;
}) {
  const action = resolveCardAction(card);
  const price = formatPrice(card.priceInCents);
  const badge =
    card.status === "loading" ? null : statusBadge[card.status];

  const content = (
    <Card className="h-full transition-colors group-hover/card:border-primary/40">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight">
            {card.title}
          </CardTitle>
          {badge ? (
            <Badge variant={badge.variant}>{badge.label}</Badge>
          ) : (
            <Skeleton className="h-5 w-20 rounded-full" />
          )}
        </div>
        {card.description && (
          <CardDescription className="line-clamp-2">
            {card.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {card.progress ? (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {card.progress.completedDays} of {card.progress.totalDays}
                </span>{" "}
                days completed
              </p>
              <p className="font-mono text-base font-semibold tabular-nums text-foreground">
                {card.progress.percent}%
              </p>
            </div>
            <Progress
              className="h-2"
              value={card.progress.percent}
              aria-label={`${card.title} progress`}
            />
          </div>
        ) : card.status === "loading" ? (
          <p className="text-sm text-muted-foreground">
            Checking your enrollment…
          </p>
        ) : card.status === "error" ? (
          <p className="text-sm text-muted-foreground">
            We couldn't check your enrollment. Open for a retry.
          </p>
        ) : (
          <p className="font-mono text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {card.totalDays}-day course
            </span>
            {price ? <span> · {price}</span> : null}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (action.type === "navigate") {
    return (
      <Link
        to={action.to}
        data-course-card
        data-course-id={card.courseId}
        data-state={card.status}
        aria-label={`${card.title} course`}
        className={`group/card ${cardShellClassName}`}
      >
        {content}
      </Link>
    );
  }

  if (action.type === "openSheet") {
    return (
      <button
        type="button"
        data-course-card
        data-course-id={card.courseId}
        data-state={card.status}
        onClick={() => onOpenCard(card)}
        className={`cursor-pointer ${cardShellClassName}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      data-course-card
      data-course-id={card.courseId}
      data-state="loading"
      aria-disabled="true"
      className={cardShellClassName}
    >
      {content}
    </div>
  );
}

export function CoursesView({
  viewModel,
  onRetry,
  isRetrying,
  sheetCard,
  onOpenSheet,
  onSheetRetry,
  isSheetRetrying,
}: CoursesViewProps) {
  // The course id whose sheet was opened, kept through the close
  // transition: sheetCard is already null when onCloseAutoFocus fires, so
  // the focus target has to come from a ref rather than the current render.
  const sheetCourseIdRef = useRef<string | null>(null);

  if (viewModel.state === "loading") {
    return (
      <CoursesFrame>
        <CoursesLoading />
      </CoursesFrame>
    );
  }

  if (viewModel.state === "loadError") {
    return (
      <CoursesFrame>
        <CoursesLoadError onRetry={onRetry} isRetrying={isRetrying} />
      </CoursesFrame>
    );
  }

  if (viewModel.state === "empty") {
    return (
      <CoursesFrame>
        <CoursesEmpty />
      </CoursesFrame>
    );
  }

  // The sheet stays put while a retried check is in flight — otherwise it
  // would close and reopen as the card's status flickers underneath it.
  // Held on the error path so the disabled Checking button stays put too.
  const sheetOpen =
    sheetCard != null &&
    (isSheetRetrying ||
      sheetCard.status === "error" ||
      sheetCard.status === "notEnrolled");
  const sheetAccessState =
    isSheetRetrying || sheetCard?.status === "error"
      ? "error"
      : "enrollment-required";

  return (
    <CoursesFrame>
      <div className="grid gap-4 sm:grid-cols-2">
        {viewModel.cards.map((card) => (
          <CourseCard
            key={card.courseId}
            card={card}
            onOpenCard={(opened) => {
              sheetCourseIdRef.current = opened.courseId;
              onOpenSheet(opened.courseId);
            }}
          />
        ))}
      </div>

      {/* A retry that enrolls the account closes the sheet through the open
          flag, and focus returns to that card — re-resolved by its course
          id, because the card's element is replaced while its status
          changes, so a saved node reference can go stale. */}
      <CourseAccessSheet
        open={sheetOpen}
        courseTitle={sheetCard?.title ?? "Course"}
        courseSlug={sheetCard?.slug ?? ""}
        accessState={sheetAccessState}
        onRetry={onSheetRetry}
        isRetrying={isSheetRetrying}
        onOpenChange={(open) => {
          if (!open) onOpenSheet(null);
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const card = document.querySelector(
            `[data-course-card][data-course-id="${sheetCourseIdRef.current ?? ""}"]`,
          ) as HTMLElement | null;
          card?.focus();
        }}
      />
    </CoursesFrame>
  );
}
