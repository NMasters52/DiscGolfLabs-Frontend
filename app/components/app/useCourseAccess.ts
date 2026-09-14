// @ts-expect-error Legacy JavaScript hooks have no declaration files yet.
import useCourse from "~/queries/useCourse";
// @ts-expect-error Legacy JavaScript hooks have no declaration files yet.
import useEnrollment from "~/queries/useEnrollment";

export type CourseAccessState =
  | "loading"
  | "error"
  | "enrolled"
  | "enrollment-required";

export function useCourseAccess() {
  const courseQuery = useCourse("putting-course");
  const enrollmentQuery = useEnrollment(courseQuery.data?._id);
  const accessFailed =
    (courseQuery.isError && !courseQuery.data && !courseQuery.isFetching) ||
    (enrollmentQuery.isError && !enrollmentQuery.isFetching);
  const accessState: CourseAccessState =
    enrollmentQuery.data?.enrolled === true
      ? "enrolled"
      : enrollmentQuery.data?.enrolled === false
        ? "enrollment-required"
        : accessFailed
          ? "error"
          : "loading";

  const retry = () => {
    if (!courseQuery.data) {
      void courseQuery.refetch();
    } else {
      void enrollmentQuery.refetch();
    }
  };

  return { accessState, retry };
}
