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
  if (currentDay > totalDays) {
    return "/app/dashboard";
  }

  const day = Math.max(1, currentDay);

  return `/app/courses/${courseSlug}/learn/day/${day}`;
}
