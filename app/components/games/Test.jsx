import { useState } from "react";
import TabsDemo from "./TabsDemo";
import AlertDialogDemo from "./AlertDialogDemo";

export default function ThemeTest() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background transition-colors duration-300 p-6 font-sans">
        {/* Toggle Button with Hover & Active States */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="mb-8 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold 
                     shadow-md transition-all duration-200
                     hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg
                     active:translate-y-0 active:scale-95 cursor-pointer"
        >
          Switch to {isDark ? "Light" : "Dark"} Mode
        </button>

        <div className="flex flex-col gap-12 items-center py-20 bg-background min-h-screen">
          <TabsDemo />
          <AlertDialogDemo />
        </div>

        {/* Test Card */}
        <div className="w-full max-w-md bg-card text-card-foreground rounded-[--radius] border border-border shadow-xl overflow-hidden transition-all">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <span
                className="text-xs font-bold uppercase tracking-widest text-accent 
                             hover:brightness-110 cursor-default transition-all"
              >
                Tailwind v4 Setup
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Design System Test
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Hover over the buttons below to test the{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">
                  transition
                </code>{" "}
                and{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">
                  hover
                </code>{" "}
                logic.
              </p>
            </div>

            <div className="space-y-3">
              {/* Primary Action Button */}
              <button
                className="w-full flex items-center justify-between p-4 rounded-xl border border-transparent
                               bg-primary text-primary-foreground transition-all duration-200
                               hover:shadow-lg hover:shadow-primary/20 hover:brightness-110
                               focus:ring-2 focus:ring-ring focus:ring-offset-2 outline-none"
              >
                <span className="font-bold">Confirm Transaction</span>
                <span className="text-lg">→</span>
              </button>

              {/* Secondary Action Button */}
              <button
                className="w-full flex items-center justify-between p-4 rounded-xl
                               bg-secondary text-secondary-foreground border border-border
                               transition-all duration-200
                               hover:bg-secondary/80 hover:border-primary/30
                               active:bg-secondary/60"
              >
                <span className="font-semibold text-sm">Update Settings</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer with a subtle hover effect */}
          <div className="bg-muted p-4 text-center text-xs text-muted-foreground border-t border-border group transition-colors hover:bg-muted/50">
            Current Radius:{" "}
            <span className="font-mono text-foreground group-hover:text-accent transition-colors">
              0.75rem
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
