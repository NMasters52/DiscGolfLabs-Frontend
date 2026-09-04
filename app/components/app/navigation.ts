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

/** Product name shown in the sidebar header and used for browser tab titles. */
export const APP_NAME = "Disc Golf Labs";

/**
 * Browser tab title for an authenticated `/app` pathname: the destination
 * title followed by the product name, or the bare product name when no
 * destination claims the path.
 *
 * Deliberately a pure string builder rather than a `document.title` writer so
 * it stays unit-testable outside a browser. Callers own the assignment — see
 * the Settings route, the only route that currently sets a title.
 */
export function documentTitle(pathname: string): string {
  const destination = resolveDestination(pathname);
  return destination ? `${destination.title} · ${APP_NAME}` : APP_NAME;
}
