import { cn } from "~/lib/utils";

export type CourseDayNavRowState = {
  /** Row points at the route the user is on (parent owns route matching). */
  selected: boolean;
  /** Day not reachable yet — rendered inert by the parent. */
  locked: boolean;
};

/**
 * Shared row style for the course-day list in the sidebar.
 *
 * Keeps all three row flavors (selected / unlocked / locked) on one spacing,
 * radius, and icon grid so the group reads as a single menu:
 * - full-width h-8 rows, rounded-lg, consistent px-3/gap-2
 * - sidebar tokens for text and hover (no raw colors)
 * - selected: primary tint, semibold, and the same left indicator bar the
 *   primary navigation uses
 * - locked: dimmed text, cursor-not-allowed, and a restrained grey hover so
 *   the row still reads as non-interactive
 * - `[&>svg]` rules align parent-supplied icons (Lock/Check) with text
 */
export function courseDayNavClassName({ selected, locked }: CourseDayNavRowState): string {
  return cn(
    "relative flex w-full items-center gap-2 rounded-lg px-3 text-sm transition-colors outline-none [&>svg]:size-4 [&>svg]:shrink-0",
    selected
      ? cn(
          "h-8 bg-primary/10 font-semibold text-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          // Left indicator bar, matching navigationButtonClassName in AppSidebar.
          "before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-r-full before:bg-primary",
        )
      : locked
        ? "h-8 cursor-not-allowed text-sidebar-foreground/40 hover:bg-sidebar-accent/40"
        : "h-8 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
  );
}
