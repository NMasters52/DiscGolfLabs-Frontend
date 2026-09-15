// Single source of truth for authenticated `/app` navigation metadata.
// The desktop sidebar and mobile navigation (later tickets) build on these
// entries so both surfaces resolve destinations, titles, and routing the
// same way and cannot drift.
export interface AppDestination {
  /** Canonical path prefix this destination owns. */
  path: string;
  /** Page title the AppShell header shows for this destination. */
  title: string;
}

export const APP_DESTINATIONS = [
  { path: "/app/dashboard", title: "Dashboard" },
  { path: "/app/courses", title: "Putting Course" },
  { path: "/app/settings", title: "Settings" },
] as const satisfies readonly AppDestination[];

/** Resolves the destination whose path prefix matches the pathname, longest prefix first. */
export function resolveDestination(
  pathname: string,
): AppDestination | undefined {
  return [...APP_DESTINATIONS]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (destination) =>
        pathname === destination.path ||
        pathname.startsWith(`${destination.path}/`),
    );
}

/**
 * Canonical Putting Course route. The app ships one course today, so the
 * mobile Course tab links straight to it; `resolveDestination` still matches
 * the shorter `/app/courses` prefix for titles and active states.
 */
export const COURSE_ROUTE = "/app/courses/putting-course/learn";

/** Public course details and enrollment route. */
export const COURSE_MARKETING_ROUTE = "/courses/putting-course";

export type MobileTab = "dashboard" | "course" | "more";

/**
 * Which bottom-bar tab owns a pathname, resolved from the same destinations
 * the desktop sidebar uses so the two surfaces cannot drift. Returns
 * undefined on paths no tab owns (e.g. the bare /app boundary before its
 * dashboard redirect).
 *
 * `more` owns Settings because the More sheet is Settings' mobile surface;
 * whether the sheet is currently open is not a pathname property, so the
 * bottom bar combines this with the sheet state for More's active styling.
 */
export function resolveMobileTab(pathname: string): MobileTab | undefined {
  switch (resolveDestination(pathname)?.path) {
    case "/app/dashboard":
      return "dashboard";
    case "/app/courses":
      return "course";
    case "/app/settings":
      return "more";
    default:
      return undefined;
  }
}

/** Product name shown in the sidebar header and used for browser tab titles. */
export const APP_NAME = "Disc Golf Labs";

/**
 * Browser tab title for an authenticated `/app` pathname: the destination
 * title followed by the product name, or the bare product name when no
 * destination claims the path.
 *
 * Deliberately a pure string builder rather than a `document.title` writer so
 * it stays unit-testable outside a browser. Callers own the assignment — see
 * `AppShell`, which assigns it for every authenticated `/app` pathname.
 */
export function documentTitle(pathname: string): string {
  const destination = resolveDestination(pathname);
  return destination ? `${destination.title} · ${APP_NAME}` : APP_NAME;
}
