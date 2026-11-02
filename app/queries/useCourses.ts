import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api/course";
import { queryKeys } from "./keys";

/** One entry of GET /api/courses — the card-level course summary. */
export type CourseListItem = {
  _id: string;
  slug: string;
  title: string;
  description: string | null;
  priceInCents: number | null;
  totalDays: number;
};

export default function useCourses(
  options: { enabled?: boolean } & Record<string, unknown> = {},
) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryKey: queryKeys.course.list(),
    queryFn: fetchCourses as () => Promise<CourseListItem[]>,
    enabled,
  });
}
