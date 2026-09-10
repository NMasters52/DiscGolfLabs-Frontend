import * as React from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { BookOpen, LayoutDashboard, Menu, type LucideIcon } from "lucide-react";

import {
  COURSE_ROUTE,
  resolveMobileTab,
} from "~/components/app/navigation";
import { CourseAccessSheet } from "~/components/app/CourseAccessSheet";
import { MoreSheet } from "~/components/app/MoreSheet";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
// @ts-expect-error Legacy JavaScript hook has no declaration file yet.
import useCourse from "~/queries/useCourse";
// @ts-expect-error Legacy JavaScript hook has no declaration file yet.
import useEnrollment from "~/queries/useEnrollment";

/** Search parameter that marks the More sheet as open in the URL. */
const MORE_PARAM = "more";

function MobileTab({
  to,
  icon: Icon,
  label,
  active,
  linkRef,
  onClick,
  accessState,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  linkRef?: React.Ref<HTMLAnchorElement>;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  accessState?: "loading" | "enrolled" | "enrollment-required";
}) {
  return (
    <Link
      ref={linkRef}
      to={to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-disabled={accessState === "loading" ? true : undefined}
      data-access={accessState}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
        accessState === "loading" && "opacity-60",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

/**
 * The phone (<768px) navigation surface: a fixed Dashboard, Course,
 * More bottom bar plus the More sheet. Hidden at desktop widths, where the
 * sidebar is the only navigation chrome.
 *
 * The sheet's open state lives in a `?more` search parameter instead of
 * component state: opening pushes a history entry, so the browser/device
 * Back gesture closes the sheet (closing via UI replaces the entry instead,
 * so Back after a manual close returns to the pre-sheet page). Navigating
 * to a destination from the sheet naturally drops the parameter, which is
 * what closes it.
 */
export function MobileNav() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const moreButtonRef = React.useRef<HTMLButtonElement>(null);
  const courseLinkRef = React.useRef<HTMLAnchorElement>(null);
  const [courseAccessOpen, setCourseAccessOpen] = React.useState(false);
  const sheetOpen = searchParams.has(MORE_PARAM);

  const courseQuery = useCourse("putting-course", { enabled: isMobile });
  const enrollmentQuery = useEnrollment(courseQuery.data?._id, {
    enabled: isMobile,
  });
  const courseAccessState =
    enrollmentQuery.data?.enrolled === true
      ? "enrolled"
      : enrollmentQuery.data?.enrolled === false
        ? "enrollment-required"
        : "loading";

  const activeTab = resolveMobileTab(pathname);
  const moreActive = activeTab === "more" || sheetOpen;

  const openSheet = () => {
    const params = new URLSearchParams(searchParams);
    params.set(MORE_PARAM, "1");
    setSearchParams(params);
  };

  const closeSheet = React.useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete(MORE_PARAM);
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleCourseClick: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    if (courseAccessState === "enrolled") return;

    event.preventDefault();
    if (courseAccessState === "enrollment-required") {
      setCourseAccessOpen(true);
    }
  };

  return (
    <>
      <nav
        data-slot="mobile-nav"
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 touch-manipulation border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <MobileTab
          to="/app/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          active={activeTab === "dashboard"}
        />
        <MobileTab
          to={COURSE_ROUTE}
          icon={BookOpen}
          label="Course"
          active={activeTab === "course"}
          linkRef={courseLinkRef}
          onClick={handleCourseClick}
          accessState={courseAccessState}
        />
        <button
          type="button"
          ref={moreButtonRef}
          onClick={openSheet}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          aria-current={activeTab === "more" ? "page" : undefined}
          data-active={moreActive}
          className={cn(
            "flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
            moreActive
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Menu className="size-5" aria-hidden="true" />
          <span>More</span>
        </button>
      </nav>
      {/* isMobile closes both sheets when the viewport crosses md while one
          is open: the md:hidden lives on the sheet contents only, so without
          this a resize would leave an invisible overlay and focus trap on
          the desktop layout. */}
      <MoreSheet
        open={sheetOpen && isMobile}
        onOpenChange={(next) => (next ? openSheet() : closeSheet())}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          moreButtonRef.current?.focus();
        }}
      />
      <CourseAccessSheet
        open={courseAccessOpen && isMobile}
        onOpenChange={setCourseAccessOpen}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          courseLinkRef.current?.focus();
        }}
      />
    </>
  );
}
