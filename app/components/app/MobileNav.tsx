import * as React from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
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
const MORE_HISTORY_STATE = "mobileMoreReturnTo";

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
  accessState?: "loading" | "error" | "enrolled" | "enrollment-required";
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
 * Back gesture closes the sheet. Manual dismissal consumes that same entry;
 * a directly loaded sheet URL is closed in place. Destination links replace
 * the sheet entry so Back returns to the page with the sheet closed.
 */
export function MobileNav() {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const moreButtonRef = React.useRef<HTMLButtonElement>(null);
  const courseLinkRef = React.useRef<HTMLAnchorElement>(null);
  const [courseAccessOpen, setCourseAccessOpen] = React.useState(false);
  const sheetOpen = searchParams.has(MORE_PARAM);

  const courseQuery = useCourse("putting-course", { enabled: isMobile });
  const enrollmentQuery = useEnrollment(courseQuery.data?._id, {
    enabled: isMobile,
  });
  const accessFailed =
    (courseQuery.isError && !courseQuery.data && !courseQuery.isFetching) ||
    (enrollmentQuery.isError && !enrollmentQuery.isFetching);
  const courseAccessState =
    enrollmentQuery.data?.enrolled === true
      ? "enrolled"
      : enrollmentQuery.data?.enrolled === false
        ? "enrollment-required"
        : accessFailed
          ? "error"
          : "loading";

  const retryCourseAccess = () => {
    if (!courseQuery.data) {
      void courseQuery.refetch();
    } else {
      void enrollmentQuery.refetch();
    }
  };

  React.useEffect(() => {
    if (courseAccessState === "enrolled") setCourseAccessOpen(false);
  }, [courseAccessState]);

  const activeTab = resolveMobileTab(pathname);
  const moreActive = activeTab === "more" || sheetOpen;

  const openSheet = () => {
    if (sheetOpen) return;
    const params = new URLSearchParams(searchParams);
    params.set(MORE_PARAM, "1");
    navigate({ pathname, search: `?${params}`, hash: location.hash }, {
      state: {
        ...location.state,
        [MORE_HISTORY_STATE]: `${pathname}${searchParams.size ? `?${searchParams}` : ""}${location.hash}`,
      },
      preventScrollReset: true,
    });
  };

  const closeSheet = React.useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete(MORE_PARAM);
    const search = params.size ? `?${params}` : "";
    const destination = `${pathname}${search}${location.hash}`;
    if (location.state?.[MORE_HISTORY_STATE] === destination) {
      navigate(-1);
      return;
    }
    navigate({ pathname, search, hash: location.hash }, {
      replace: true,
      state: location.state,
      preventScrollReset: true,
    });
  }, [location, pathname, searchParams, navigate]);

  const handleCourseClick: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    if (courseAccessState === "enrolled") return;

    event.preventDefault();
    if (courseAccessState === "enrollment-required" || courseAccessState === "error") {
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
        accessState={courseAccessState}
        onRetry={retryCourseAccess}
        onOpenChange={setCourseAccessOpen}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          courseLinkRef.current?.focus();
        }}
      />
    </>
  );
}
