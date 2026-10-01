import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

interface CourseAccessSheetProps {
  open: boolean;
  courseTitle: string;
  courseSlug: string;
  /** The live access state for the card whose sheet is open. */
  accessState: "enrollment-required" | "checking" | "error";
  onRetry: () => void;
  isRetrying?: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Lets players retry a failed enrollment check or choose whether to view the
 * public course page when enrollment is required. Rendered by the courses
 * index for whatever card opened it, at both breakpoints.
 */
export function CourseAccessSheet({
  open,
  courseTitle,
  courseSlug,
  accessState,
  onRetry,
  isRetrying,
  onOpenChange,
  onCloseAutoFocus,
}: CourseAccessSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="w-full pb-[env(safe-area-inset-bottom)]"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <SheetHeader>
          <SheetTitle>{courseTitle}</SheetTitle>
          <SheetDescription>
            {accessState === "checking"
              ? "Checking your course access…"
              : accessState === "error"
                ? "We couldn't check your course access. Try again without leaving this page."
                : "Enroll before starting the course. You can review the course first without losing your place in the app."}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="grid grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-12"
            onClick={() => onOpenChange(false)}
          >
            Stay Here
          </Button>
          {accessState === "error" || accessState === "checking" ? (
            <Button
              type="button"
              className="min-h-12"
              onClick={onRetry}
              disabled={accessState === "checking" || isRetrying}
            >
              {accessState === "checking" || isRetrying
                ? "Checking..."
                : "Retry"}
            </Button>
          ) : (
            <Button asChild className="min-h-12">
              <Link to={`/courses/${courseSlug}`}>View Course</Link>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
