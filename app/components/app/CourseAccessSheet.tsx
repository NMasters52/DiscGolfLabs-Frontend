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
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Gives an unenrolled player context before the app sends them to the public
 * course page. The explicit link avoids turning a primary-nav tap into an
 * unexplained exit from the authenticated shell.
 */
export function CourseAccessSheet({
  open,
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
            Enroll before starting the course. You can review the course first
            without losing your place in the app.
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
          <Button asChild className="min-h-12">
            <Link to={COURSE_MARKETING_ROUTE}>View Course</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
