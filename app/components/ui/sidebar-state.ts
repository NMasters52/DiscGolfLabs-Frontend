export const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** Reads the persisted desktop sidebar preference from a cookie string. */
export function readSidebarState(cookieString: string): boolean | undefined {
  const prefix = `${SIDEBAR_COOKIE_NAME}=`;
  const cookie = cookieString
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!cookie) return undefined;

  const value = cookie.slice(prefix.length);
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

/** Serializes the preference with the same seven-day lifetime as the shell. */
export function serializeSidebarState(open: boolean): string {
  return `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
}
