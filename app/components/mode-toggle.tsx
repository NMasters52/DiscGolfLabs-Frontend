import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import { nextToggleTheme } from "~/components/app/theme-options";

export function ModeToggle() {
  // Toggle from the resolved theme so it flips even while the preference is
  // "system" — otherwise a dark-OS machine could never toggle out of dark.
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="green-hover"
      size="icon"
      onClick={() => setTheme(nextToggleTheme(resolvedTheme))}
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
