export interface StatsPeriod {
  days: number;
  start: string;
  end: string;
}

/** Period windows the dashboard offers for the make-rate card. */
export const STATS_PERIOD_DAYS = [7, 30, 90] as const;

/** Period shown until the player picks another one. */
export const DEFAULT_STATS_PERIOD_DAYS: number = 30;

export function formatStatsPeriod(
  period: StatsPeriod | undefined,
  days: number,
): string {
  const fallback = `Last ${days} days`;
  if (!period || period.days !== days) return fallback;
  const start = new Date(period.start);
  const end = new Date(period.end);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return fallback;
  const lastIncludedDay = new Date(end.getTime() - 86_400_000);
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
  const startFormat = start.getUTCFullYear() === lastIncludedDay.getUTCFullYear()
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    : format;
  return `${startFormat.format(start)} – ${format.format(lastIncludedDay)}`;
}
