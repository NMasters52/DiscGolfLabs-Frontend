import { Link } from "react-router";

import { COURSE_MARKETING_ROUTE } from "~/components/app/navigation";
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
  accessState: "loading" | "error" | "enrolled" | "enrollment-required";
  onRetry: () => void;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Lets players retry a failed access check or choose whether to view the
 * public course page when enrollment is required.
 */
export function CourseAccessSheet({
  open,
  accessState,
  onRetry,
  onOpenChange,
  onCloseAutoFocus,
}: CourseAccessSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="w-full pb-[env(safe-area-inset-bottom)] md:hidden"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <SheetHeader>
          <SheetTitle>Putting Course</SheetTitle>
          <SheetDescription>
            {accessState === "error"
              ? "We couldn't check your course access. Try again without leaving this page."
              : accessState === "loading"
                ? "Checking your course access..."
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
          {accessState === "error" || accessState === "loading" ? (
            <Button
              type="button"
              className="min-h-12"
              onClick={onRetry}
              disabled={accessState === "loading"}
            >
              {accessState === "loading" ? "Checking..." : "Retry"}
            </Button>
          ) : (
            <Button asChild className="min-h-12">
              <Link to={COURSE_MARKETING_ROUTE}>View Course</Link>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
