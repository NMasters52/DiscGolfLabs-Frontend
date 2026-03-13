import { cn } from "~/lib/utils";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const TAG_THRESHOLDS = {
  HOT: 85,
  GOOD: 70,
  OK: 55,
  WORK: 40,
} as const;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ZoneTag = "HOT" | "GOOD" | "OK" | "WORK" | "DRILL";

export interface DistanceZone {
  /** Display label — e.g. "15ft" or "15'" */
  distance: string;
  /** 0–100 integer representing make percentage */
  makePercent: number;
  /**
   * Optional override tag. If omitted the component auto-assigns
   * based on makePercent thresholds:
   *   ≥85 → HOT | ≥70 → GOOD | ≥55 → OK | ≥40 → WORK | <40 → DRILL
   */
  tag?: ZoneTag;
}

export interface DistanceZonesProps {
  zones: DistanceZone[];
  /** Section title */
  title?: string;
  /** Caption beneath title */
  subtitle?: string;
  /** Highlight the weakest zone in the badge — auto-detected if omitted */
  weakestLabel?: string;
  /** Footer CTA text */
  ctaLabel?: string;
  /** Fires when the CTA button is pressed */
  onCtaPress?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function autoTag(pct: number): ZoneTag {
  if (pct >= TAG_THRESHOLDS.HOT) return "HOT";
  if (pct >= TAG_THRESHOLDS.GOOD) return "GOOD";
  if (pct >= TAG_THRESHOLDS.OK) return "OK";
  if (pct >= TAG_THRESHOLDS.WORK) return "WORK";
  return "DRILL";
}

interface ZoneColors {
  fill: string; // CSS gradient string for the bar fill
  text: string; // Tailwind text color class
  tagBg: string; // Tailwind bg class
  tagText: string; // Tailwind text color class
}

function zoneColors(tag: ZoneTag): ZoneColors {
  switch (tag) {
    case "HOT":
    case "GOOD":
      return {
        fill: "linear-gradient(90deg, hsl(142, 76%, 36%), hsl(142, 71%, 45%))",
        text: "text-accent",
        tagBg: "bg-accent/10",
        tagText: "text-accent",
      };
    case "OK":
      return {
        fill: "linear-gradient(90deg, hsl(35, 92%, 50%), hsl(45, 93%, 47%))",
        text: "text-yellow-500",
        tagBg: "bg-yellow-500/10",
        tagText: "text-yellow-500",
      };
    case "WORK":
      return {
        fill: "linear-gradient(90deg, hsl(15, 90%, 50%), hsl(25, 95%, 53%))",
        text: "text-orange-500",
        tagBg: "bg-orange-500/10",
        tagText: "text-orange-500",
      };
    case "DRILL":
      return {
        fill: "linear-gradient(90deg, hsl(0, 84%, 60%), hsl(0, 90%, 50%))",
        text: "text-destructive",
        tagBg: "bg-destructive/10",
        tagText: "text-destructive",
      };
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function DistanceZones({
  zones,
  title = "Distance Zones",
  subtitle,
  weakestLabel,
  ctaLabel = "Full Report →",
  onCtaPress,
  className,
}: DistanceZonesProps) {
  // Resolve tags
  const resolved = zones.map((z) => ({
    ...z,
    resolvedTag: z.tag ?? autoTag(z.makePercent),
  }));

  // Auto-detect weakest zone for badge
  const weakest =
    weakestLabel ??
    (resolved.length > 0
      ? resolved.reduce((min, z) => (z.makePercent < min.makePercent ? z : min))
          .distance
      : "N/A");

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        "bg-card border border-border",
        "relative cursor-pointer",
        className,
      )}
    >
      {/* Primary accent glow */}
      <div className="pointer-events-none absolute bottom-[-30px] left-[-30px] w-[120px] h-[120px] rounded-full bg-primary/5 blur-[30px]" />

      {/* Header */}
      <div className="flex justify-between items-start px-4 pt-4 pb-3">
        <div>
          <p className="text-lg font-bold text-foreground tracking-wide mb-1">
            {title}
          </p>
          {subtitle && (
            <p className="text-[10px] font-mono text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Weakest zone badge */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-2 py-1.5 text-center">
          <p className="text-xl font-bold text-destructive leading-none">
            {weakest}
          </p>
          <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
            Weakest
          </p>
        </div>
      </div>

      {/* Zone rows */}
      <div className="flex flex-col gap-2 px-4 pb-3">
        {resolved.length === 0 ? (
          <p className="text-[10px] text-muted-foreground text-center py-4">
            No distance data available for this period
          </p>
        ) : (
          resolved.map((zone) => {
            const colors = zoneColors(zone.resolvedTag);
            return (
              <div key={zone.distance} className="flex items-center gap-2">
                {/* Distance label */}
                <span className="text-[10px] font-mono text-muted-foreground w-[28px] text-right shrink-0">
                  {zone.distance}
                </span>

                {/* Bar track */}
                <div className="flex-1 h-[7px] bg-muted rounded-[4px] overflow-hidden">
                  <div
                    className="h-full rounded-[4px]"
                    style={{
                      width: `${zone.makePercent}%`,
                      background: colors.fill,
                    }}
                  />
                </div>

                {/* Percentage */}
                <span
                  className={cn(
                    "text-[10px] font-mono font-medium w-[30px] text-right shrink-0",
                    colors.text,
                  )}
                >
                  {zone.makePercent}%
                </span>

                {/* Tag pill */}
                <span
                  className={cn(
                    "text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded-[3px] w-[28px] text-center shrink-0",
                    colors.tagBg,
                    colors.tagText,
                  )}
                >
                  {zone.resolvedTag}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* CTA footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <span className="text-[11px] text-muted-foreground">
          Tap to see full analysis
        </span>
        <button
          onClick={onCtaPress}
          className={cn(
            "flex items-center gap-1.5",
            "border border-primary text-primary",
            "text-[11px] font-bold tracking-wider",
            "px-3 py-1.5 rounded-lg",
            "bg-transparent hover:bg-primary/10 transition-colors",
          )}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
