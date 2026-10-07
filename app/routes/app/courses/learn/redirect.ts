interface LearnIndexDestinationInput {
  courseSlug: string;
  currentDay: number;
  totalDays: number;
}

export function getLearnIndexDestination({
  courseSlug,
  currentDay,
  totalDays,
}: LearnIndexDestinationInput) {
  // A completed enrollment has no current day to continue; land on the
  // course home, where every completed day stays open for review.
  if (currentDay > totalDays) {
    return `/app/courses/${courseSlug}`;
  }

  const day = Math.max(1, currentDay);

  return `/app/courses/${courseSlug}/learn/day/${day}`;
}

interface LearnDayRedirectInput {
  dayNumber: string | undefined;
  currentDay: number;
  totalDays: number;
}

export function getLearnDayRedirect({
  dayNumber,
  currentDay,
  totalDays,
}: LearnDayRedirectInput) {
  const day = Number(dayNumber);

  if (
    !Number.isInteger(day) ||
    day < 1 ||
    day > totalDays ||
    day > currentDay
  ) {
    return "..";
  }

  return null;
}
