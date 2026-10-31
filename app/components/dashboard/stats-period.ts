export function formatStatsPeriod(
  period: { days: number; start: string; end: string } | undefined,
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
