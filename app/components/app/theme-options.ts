// Pure theme-preference logic shared by the Settings Appearance control and
// the shell header toggle. Deliberately free of React/DOM imports so it runs
// under Node's type-stripped test runner.

export const THEME_OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export type ThemePreference = (typeof THEME_OPTIONS)[number]["value"];

/**
 * Next preference for the header toggle. Reads the *resolved* theme (not the
 * preference) so the toggle still flips while the app is following the
 * operating system (`theme === "system"` on a dark OS must yield "light").
 */
export function nextToggleTheme(resolvedTheme: string | undefined): "light" | "dark" {
  return resolvedTheme === "dark" ? "light" : "dark";
}
