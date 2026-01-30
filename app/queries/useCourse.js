import { fetchCourse } from "../api/course";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export default function useCourse(slug) {
  const key = queryKeys.course.bySlug(slug);

  return useQuery({
    queryKey: key,
    queryFn: () => fetchCourse(slug),
    enabled: !!slug,
  });
}
