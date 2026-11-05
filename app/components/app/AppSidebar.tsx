import {
  BookOpen,
  Check,
  ChevronRight,
  CircleDashed,
  History,
  LayoutDashboard,
  Lock,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { SignOutButton, useUser } from "@clerk/react-router";
import { Link, useLocation } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";
import { ModeToggle } from "~/components/mode-toggle";
import { ThemeChoice } from "~/components/app/theme-choice";
import { resolveDestination } from "~/components/app/navigation";
import {
  getLessonDayState,
  learnDayHref,
} from "~/components/learn/lesson-day-view-model";
import useCourse from "~/queries/useCourse";
import useEnrollment from "~/queries/useEnrollment";
import { defaultQueryOptions } from "~/queries/query-options";
import { courseDayNavClassName } from "~/components/learn/course-day-nav-styles";
import { cn } from "~/lib/utils";

const PRIMARY_NAVIGATION: readonly {
  label: string;
  to: string;
  destinationPath: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Dashboard",
    to: "/app/dashboard",
    destinationPath: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Courses",
    to: "/app/courses",
    destinationPath: "/app/courses",
    icon: BookOpen,
  },
  {
    label: "Sessions",
    to: "/app/sessions",
    destinationPath: "/app/sessions",
    icon: History,
  },
];

const navigationButtonClassName =
  "relative h-10 rounded-lg px-3 data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary data-[active=true]:hover:bg-primary/15 data-[active=true]:hover:text-primary data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 data-[active=true]:before:w-1 data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-primary group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2";

function NavigationItem({
  label,
  to,
  destinationPath,
  icon: Icon,
  activePath,
}: (typeof PRIMARY_NAVIGATION)[number] & {
  activePath: string | undefined;
}) {
  const isActive = activePath === destinationPath;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
        className={navigationButtonClassName}
      >
        <Link
          to={to}
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
        >
          <Icon aria-hidden="true" />
          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// The enrolled course's days as sidebar navigation: completed days stay
// reviewable, the viewed day is highlighted, locked days are inert (the
// routes' redirect enforces what this affordance shows). Shares the same
// query keys the dashboard and learn layout use, so the rows flip live
// when a completion invalidates the enrollment.
const COURSE_SLUG = "putting-course";

function CourseDayNav() {
  const { pathname } = useLocation();
  const courseQuery = useCourse(COURSE_SLUG, defaultQueryOptions);
  const enrollmentQuery = useEnrollment(
    courseQuery.data?._id,
    defaultQueryOptions,
  );
  const course = courseQuery.data;
  const enrollment = enrollmentQuery.data;
  if (!course || enrollment?.enrolled !== true) return null;
  const currentDay = enrollment.currentDay;

  return (
    <SidebarGroup
      className="px-2 pt-1 group-data-[collapsible=icon]:hidden"
      data-state="nav-days"
    >
      <SidebarGroupLabel>{course.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {course.days.map((day: { dayNumber: number }) => {
            const state = getLessonDayState(day.dayNumber, currentDay);
            if (state === "locked") {
              return (
                <SidebarMenuItem key={day.dayNumber}>
                  <span
                    aria-disabled="true"
                    data-state="locked"
                    title="Complete the previous day first"
                    aria-label={`Day ${day.dayNumber} (locked). Complete the previous day first`}
                    className={courseDayNavClassName({ selected: false, locked: true })}
                  >
                    <Lock aria-hidden="true" />
                    Day {day.dayNumber}
                  </span>
                </SidebarMenuItem>
              );
            }
            const isCurrent = state === "current";
            const href = learnDayHref(COURSE_SLUG, day.dayNumber);
            const isSelected = pathname.replace(/\/$/, "") === href;
            return (
              <SidebarMenuItem key={day.dayNumber}>
                <Link
                  to={href}
                  aria-current={isSelected ? "page" : undefined}
                  data-active={isSelected}
                  data-state={state}
                  aria-label={`Day ${day.dayNumber}${isCurrent ? " (current)" : " (completed)"}`}
                  className={courseDayNavClassName({ selected: isSelected, locked: false })}
                >
                  {state === "completed" ? (
                    <Check aria-hidden="true" className="text-primary" />
                  ) : (
                    <CircleDashed aria-hidden="true" className="text-primary" />
                  )}
                  Day {day.dayNumber}
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AccountSummary({ active }: { active: boolean }) {
  const { user } = useUser();
  const { state } = useSidebar();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress;
  const displayName = user?.fullName ?? user?.username ?? email ?? "Account";
  const initials =
    user?.fullName
      ?.split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? email?.slice(0, 2).toUpperCase() ?? "?";

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={active}
          tooltip="Account & Settings"
          className="size-8! justify-center rounded-lg p-0!"
        >
          <Link
            to="/app/settings"
            aria-label="Account & Settings"
            aria-current={active ? "page" : undefined}
            title="Account & Settings"
          >
            <Avatar className={cn("size-7", active && "ring-2 ring-sidebar-ring")}>
              {user?.imageUrl ? <AvatarImage src={user.imageUrl} alt="" /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Link
        to="/app/settings"
        aria-label="Account & Settings"
        aria-current={active ? "page" : undefined}
        title="Account & Settings"
        className={cn(
          "group block overflow-hidden rounded-xl border border-sidebar-border bg-sidebar-accent/35 p-3 outline-none transition-colors hover:border-sidebar-ring hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          active &&
            "border-sidebar-ring bg-sidebar-accent text-sidebar-accent-foreground outline outline-2 outline-solid outline-sidebar-ring outline-offset-2",
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar className="size-10 shrink-0">
            {user?.imageUrl ? <AvatarImage src={user.imageUrl} alt="" /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-sidebar-foreground/65">
              {email ?? " "}
            </p>
          </div>
        </div>
        <div className="mt-3 flex min-h-10 items-center justify-between border-t border-sidebar-border/80 pt-3 text-sm font-semibold">
          <span>Account &amp; Settings</span>
          <ChevronRight
            className={cn(
              "size-4 transition-transform group-hover:translate-x-0.5",
              active
                ? "text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60",
            )}
            aria-hidden="true"
          />
        </div>
      </Link>
    </SidebarMenuItem>
  );
}

function SidebarThemeControl() {
  const { state } = useSidebar();

  if (state === "collapsed") return <ModeToggle className="size-8!" />;

  return (
    <div className="w-full">
      <p className="px-2 text-xs font-medium text-sidebar-foreground/70">
        Appearance
      </p>
      <ThemeChoice className="mt-1 rounded-lg border-sidebar-border bg-sidebar-accent/40 dark:bg-sidebar-accent/70" />
    </div>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const activePath = resolveDestination(pathname)?.path;
  const settingsActive = activePath === "/app/settings";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3 pb-2 group-data-[collapsible=icon]:p-2">
        <Link
          to="/app/dashboard"
          aria-label="Dashboard"
          title="Dashboard"
          className="flex min-h-10 w-full items-center gap-3 rounded-lg px-1.5 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span className="flex h-9 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sidebar-accent group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
            <img
              src="/logos/dgl-logo.png"
              alt="Disc Golf Labs"
              className="h-full w-full object-contain px-1 [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)]"
            />
          </span>
          <span className="truncate text-sm font-semibold tracking-wide group-data-[collapsible=icon]:hidden">
            Disc Golf Labs
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2 pt-1">
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAVIGATION.map((item) => (
                <NavigationItem
                  key={item.label}
                  {...item}
                  activePath={activePath}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <CourseDayNav />
      </SidebarContent>

      <SidebarFooter className="gap-1 border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu className="gap-5 group-data-[collapsible=icon]:gap-1">
          <AccountSummary active={settingsActive} />
          <SidebarMenuItem>
            <SidebarThemeControl />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SignOutButton redirectUrl="/">
              <SidebarMenuButton
                variant="outline"
                tooltip="Sign Out"
                aria-label="Sign Out"
                className="h-10 rounded-lg px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
              >
                <LogOut aria-hidden="true" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign Out
                </span>
              </SidebarMenuButton>
            </SignOutButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
