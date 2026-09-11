import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import {
  nextToggleTheme,
  themeControlLabel,
} from "~/components/app/theme-options";
import { cn } from "~/lib/utils";

export function ModeToggle({
  showLabel = false,
  className,
}: {
  showLabel?: boolean;
  className?: string;
}) {
  // Toggle from the resolved theme so it flips even while the preference is
  // "system" — otherwise a dark-OS machine could never toggle out of dark.
  const { theme, resolvedTheme, setTheme } = useTheme();
  const currentAppearance = resolvedTheme === "dark" ? "Dark" : "Light";
  const label = themeControlLabel(theme, resolvedTheme);

  return (
    <Button
      variant="green-hover"
      size={showLabel ? "default" : "icon"}
      aria-label={label}
      title={label}
      className={cn(
        showLabel &&
          "w-full justify-start px-3 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-2!",
        className,
      )}
      onClick={() => setTheme(nextToggleTheme(resolvedTheme))}
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      {showLabel && (
        <span className="group-data-[collapsible=icon]:hidden">
          {currentAppearance}
        </span>
      )}
    </Button>
  );
}
