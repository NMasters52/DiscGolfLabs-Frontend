import { useParams } from "react-router";
import { CourseHomeView } from "~/components/courses/CourseHomeView";
import { createCourseHomeViewModel } from "~/components/courses/course-home-view-model";
import { defaultQueryOptions } from "~/queries/query-options";
// @ts-expect-error Legacy JavaScript hooks have no declaration files yet.
import useCourse from "~/queries/useCourse";
// @ts-expect-error Legacy JavaScript hooks have no declaration files yet.
import useEnrollment from "~/queries/useEnrollment";

// Sits outside the learn layout on purpose: course home must render for
// enrolled and unenrolled players alike, so it authorizes nothing and lets
// the view-model choose the unenrolled variant instead of redirecting.
export default function CourseHome() {
  const { slug } = useParams();

  const courseQuery = useCourse(slug, defaultQueryOptions);
  const enrollmentQuery = useEnrollment(
    courseQuery.data?._id,
    defaultQueryOptions,
  );

  const viewModel = createCourseHomeViewModel({
    courseSlug: slug,
    course: courseQuery.data,
    courseLoading: courseQuery.isPending,
    courseError: courseQuery.error,
    enrollment: enrollmentQuery.data,
    enrollmentLoading: enrollmentQuery.isPending,
    enrollmentError: enrollmentQuery.error,
  });

  const handleRetry = () => {
    void Promise.all([
      courseQuery.refetch(),
      // The enrollment check has nothing to fetch until the course id lands.
      courseQuery.data?._id ? enrollmentQuery.refetch() : Promise.resolve(),
    ]);
  };

  const isRetrying = courseQuery.isFetching || enrollmentQuery.isFetching;

  return (
    <CourseHomeView
      viewModel={viewModel}
      onRetry={handleRetry}
      isRetrying={isRetrying}
    />
  );
}
