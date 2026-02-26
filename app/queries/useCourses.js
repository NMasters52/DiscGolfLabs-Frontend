import { fetchCourses } from "../api/course";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export default function useCourses() {
  const key = queryKeys.course.all();

  return useQuery({
    queryKey: key,
    queryFn: () => fetchCourses(),
  });
}
