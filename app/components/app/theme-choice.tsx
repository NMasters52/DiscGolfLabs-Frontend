import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";

const THEME_OPTIONS = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

// Shared System/Light/Dark selection backed by next-themes' setTheme, so the
// Settings screen and future navigation surfaces (sidebar, More sheet) all
// drive the same single root theme provider.
export function ThemeChoice() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-label="Theme" className="flex gap-2">
      {THEME_OPTIONS.map(({ value, label, Icon }) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "outline"}
          size="sm"
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
