import { fetchCourse } from "../api/course";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export default function useCourse(slug, options = {}) {
  const key = queryKeys.course.bySlug(slug);
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryKey: key,
    queryFn: () => fetchCourse(slug),
    enabled: !!slug && enabled,
  });
}
