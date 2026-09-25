import { useMemo, useState } from "react";
import { CoursesView } from "~/components/courses/CoursesView";
import {
  createCoursesViewModel,
  type CourseCardViewModel,
} from "~/components/courses/courses-view-model";
import { defaultQueryOptions } from "~/queries/query-options";
import useCourses from "~/queries/useCourses";
import { useEnrollments } from "~/queries/useEnrollments";

export default function Courses() {
  const coursesQuery = useCourses(defaultQueryOptions);
  const courses = coursesQuery.data;

  const courseIds = useMemo(
    () =>
      (courses ?? [])
        .map((course) => String(course._id ?? ""))
        .filter(Boolean),
    [courses],
  );
  const enrollmentQueries = useEnrollments(courseIds, defaultQueryOptions);

  const viewModel = createCoursesViewModel({
    courses,
    coursesLoading: coursesQuery.isPending,
    coursesError: coursesQuery.error,
    enrollmentResults: enrollmentQueries,
  });

  // The card whose access sheet is open; null when no sheet is open.
  const [sheetCard, setSheetCard] = useState<CourseCardViewModel | null>(null);

  const handleRetry = () => {
    void coursesQuery.refetch();
  };

  const handleSheetRetry = () => {
    enrollmentQueries.forEach((query) => void query.refetch());
  };

  return (
    <CoursesView
      viewModel={viewModel}
      onRetry={handleRetry}
      isRetrying={coursesQuery.isFetching}
      sheetCard={sheetCard}
      onOpenSheet={setSheetCard}
      onSheetRetry={handleSheetRetry}
      isSheetRetrying={
        sheetCard != null &&
        enrollmentQueries.some((query) => query.isFetching)
      }
    />
  );
}
