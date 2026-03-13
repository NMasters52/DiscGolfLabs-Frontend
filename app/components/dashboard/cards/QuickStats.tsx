import { cn } from "~/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type StatVariant = "default" | "accent" | "destructive" | "primary";

interface QuickStat {
  /** Short all-caps label displayed above the value */
  label: string;
  /** The primary display value — string so you can pass "72%" or "7🔥" */
  value: string;
  /** Small caption beneath the value */
  subLabel?: string;
  /** Controls the value text color */
  variant?: StatVariant;
}

export interface QuickStatsProps {
  overallMakeRate: number;
  currentStreak: number;
  totalPuttsMade: number;
  className?: string;
}

// ─────────────────────────────────────────────
// Variant color map (Tailwind classes using shadcn/ui tokens)
// ─────────────────────────────────────────────

const variantClass: Record<StatVariant, string> = {
  default: "text-foreground",
  accent: "text-accent",
  destructive: "text-destructive",
  primary: "text-primary",
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function QuickStats({
  overallMakeRate,
  currentStreak,
  totalPuttsMade,
  className,
}: QuickStatsProps) {
  // Format stats
  const stats: [QuickStat, QuickStat, QuickStat] = [
    {
      label: "MAKE RATE",
      value: `${Math.round(overallMakeRate)}%`,
      subLabel: "Last 30 days",
      variant: overallMakeRate >= 70 ? "accent" : "default",
    },
    {
      label: "STREAK",
      value: currentStreak >= 5 ? `${currentStreak}🔥` : String(currentStreak),
      subLabel: "in a row",
      variant: currentStreak >= 5 ? "accent" : "default",
    },
    {
      label: "PUTTS",
      value: String(totalPuttsMade),
      subLabel: "total made",
      variant: "primary",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-3 rounded-xl overflow-hidden",
        "bg-card border border-border",
        className,
      )}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={cn("px-3 py-3", i < 2 && "border-r border-border")}
        >
          {/* Label */}
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            {stat.label}
          </p>

          {/* Value */}
          <p
            className={cn(
              "text-2xl font-bold leading-none",
              variantClass[stat.variant ?? "default"],
            )}
          >
            {stat.value}
          </p>

          {/* Sub-label */}
          {stat.subLabel && (
            <p className="text-[9px] font-mono text-muted-foreground mt-1">
              {stat.subLabel}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
