import { useEffect, useMemo, useState } from "react";
import { CoursesView } from "~/components/courses/CoursesView";
import {
  createCoursesViewModel,
  reconcileSheetCourseId,
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

  // The course whose access sheet is open; null when no sheet is open. The
  // sheet renders the live card view model, so a retry that recovers flips
  // the sheet (or closes it, once the card is enrolled) instead of sitting
  // on a stale error.
  const [sheetCourseId, setSheetCourseId] = useState<string | null>(null);
  useEffect(() => {
    const reconciledCourseId = reconcileSheetCourseId(
      viewModel,
      sheetCourseId,
    );
    if (reconciledCourseId !== sheetCourseId) {
      setSheetCourseId(reconciledCourseId);
    }
  }, [viewModel, sheetCourseId]);

  const sheetCard =
    viewModel.cards.find((card) => card.courseId === sheetCourseId) ?? null;
  const enrollmentQueriesByCourseId = new Map(
    courseIds.map((courseId, index) => [courseId, enrollmentQueries[index]]),
  );
  const sheetEnrollmentQuery = sheetCourseId
    ? enrollmentQueriesByCourseId.get(sheetCourseId)
    : undefined;

  const handleRetry = () => {
    void coursesQuery.refetch();
  };

  const handleSheetRetry = () => {
    void sheetEnrollmentQuery?.refetch();
  };

  return (
    <CoursesView
      viewModel={viewModel}
      onRetry={handleRetry}
      isRetrying={coursesQuery.isFetching}
      sheetCard={sheetCard}
      onOpenSheet={setSheetCourseId}
      onSheetRetry={handleSheetRetry}
      isSheetRetrying={Boolean(sheetEnrollmentQuery?.isFetching)}
    />
  );
}
