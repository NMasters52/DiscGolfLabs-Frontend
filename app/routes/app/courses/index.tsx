import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { CoursesView } from "~/components/courses/CoursesView";
import {
  createCoursesViewModel,
} from "~/components/courses/courses-view-model";
import { defaultQueryOptions } from "~/queries/query-options";
import useCourses from "~/queries/useCourses";
import { useEnrollments } from "~/queries/useEnrollments";

/** Search parameter that marks the access sheet as open in the URL. */
const SHEET_PARAM = "course";
const SHEET_HISTORY_STATE = "courseSheetReturnTo";

export default function Courses() {
  const coursesQuery = useCourses(defaultQueryOptions);
  const courses = coursesQuery.data;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const courseIds = useMemo(
    () =>
      (courses ?? [])
        .map((course) => String(course._id ?? ""))
        .filter(Boolean),
    [courses],
  );
  const enrollmentQueries = useEnrollments(courseIds, defaultQueryOptions);

  // Paired by course ID, not list position: one missing ID must not shift
  // later cards' enrollment state.
  const enrollmentByCourseId = new Map(
    courseIds.map((courseId, index) => [courseId, enrollmentQueries[index]]),
  );

  const viewModel = createCoursesViewModel({
    courses,
    coursesLoading: coursesQuery.isPending,
    coursesError: coursesQuery.error,
    enrollmentByCourseId,
  });

  // The course whose access sheet is open lives in the URL (?course=<id>),
  // so the browser/device Back gesture closes the sheet instead of leaving
  // the page — the same pattern as the mobile More sheet's ?more param.
  // A param naming a course that left the list just renders no sheet.
  const sheetCourseId = searchParams.get(SHEET_PARAM);
  const sheetCard = sheetCourseId
    ? (viewModel.cards.find((card) => card.courseId === sheetCourseId) ??
      null)
    : null;
  const sheetEnrollmentQuery = sheetCourseId
    ? enrollmentByCourseId.get(sheetCourseId)
    : undefined;

  const handleRetry = () => {
    void coursesQuery.refetch();
  };

  const handleSheetRetry = () => {
    void sheetEnrollmentQuery?.refetch();
  };

  const handleOpenSheet = (courseId: string) => {
    if (courseId === sheetCourseId) return;
    const params = new URLSearchParams(searchParams);
    params.set(SHEET_PARAM, courseId);
    navigate(
      {
        pathname: location.pathname,
        search: `?${params}`,
        hash: location.hash,
      },
      {
        state: {
          ...location.state,
          [SHEET_HISTORY_STATE]: `${location.pathname}${searchParams.size ? `?${searchParams}` : ""}${location.hash}`,
        },
        preventScrollReset: true,
      },
    );
  };

  const handleCloseSheet = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(SHEET_PARAM);
    const search = params.size ? `?${params}` : "";
    const destination = `${location.pathname}${search}${location.hash}`;
    // Consuming the pushed entry keeps Back from needing a second press to
    // leave the page; a directly loaded sheet URL closes in place instead.
    if (location.state?.[SHEET_HISTORY_STATE] === destination) {
      navigate(-1);
      return;
    }
    navigate(
      { pathname: location.pathname, search, hash: location.hash },
      { replace: true, state: location.state, preventScrollReset: true },
    );
  };

  return (
    <CoursesView
      viewModel={viewModel}
      onRetry={handleRetry}
      isRetrying={coursesQuery.isFetching}
      sheetCard={sheetCard}
      onOpenSheet={(courseId) =>
        courseId ? handleOpenSheet(courseId) : handleCloseSheet()
      }
      onSheetRetry={handleSheetRetry}
      isSheetRetrying={Boolean(sheetEnrollmentQuery?.isFetching)}
    />
  );
}
