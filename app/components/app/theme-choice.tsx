import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
import {
  THEME_OPTIONS,
  type ThemePreference,
} from "~/components/app/theme-options";

const THEME_ICONS: Record<ThemePreference, LucideIcon> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

// Shared System/Light/Dark selection backed by next-themes' setTheme, so the
// Settings screen and future navigation surfaces (sidebar, More sheet) all
// drive the same single root theme provider. Highlighting follows the stored
// preference, so "System" stays selected while it follows the OS.
export function ThemeChoice() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-label="Theme" className="flex gap-2">
      {THEME_OPTIONS.map(({ value, label }) => {
        const Icon = THEME_ICONS[value];
        const isActive = theme === value;

        return (
          <Button
            key={value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            aria-pressed={isActive}
            onClick={() => setTheme(value)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        );
      })}
    </div>
  );
}
