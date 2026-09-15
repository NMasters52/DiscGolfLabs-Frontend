import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";

import {
  THEME_OPTIONS,
  type ThemePreference,
} from "~/components/app/theme-options";
import { cn } from "~/lib/utils";

const THEME_ICONS: Record<ThemePreference, LucideIcon> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

// Shared System/Light/Dark segmented control backed by next-themes' setTheme.
// Settings, the mobile More sheet, and the expanded desktop sidebar all use
// the same control so the preference behaves the same in each surface.
export function ThemeChoice({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const currentAppearance = resolvedTheme === "dark" ? "Dark" : "Light";
  const preference =
    THEME_OPTIONS.find((option) => option.value === theme)?.label ?? "System";

  return (
    <div
      role="group"
      aria-label="Theme"
      aria-description={`Current appearance: ${currentAppearance}. Preference: ${preference}.`}
      className={cn(
        "grid grid-cols-3 gap-1 rounded-full border bg-muted p-1 dark:border-border dark:bg-card",
        className,
      )}
    >
      {THEME_OPTIONS.map(({ value, label }) => {
        const Icon = THEME_ICONS[value];
        const isActive = theme === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            className={cn(
              "flex min-h-12 cursor-pointer items-center justify-center rounded-full px-0 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-background text-foreground shadow-sm hover:bg-background"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
            onClick={() => setTheme(value)}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
