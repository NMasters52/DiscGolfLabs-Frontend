import { Outlet, Navigate, useParams } from "react-router";
import useCourse from "../../../../queries/useCourse";
import useEnrollment from "../../../../queries/useEnrollment";
import { getEnrollmentDestination } from "./enrollment-redirect";

// Nested inside `/app`, so authentication is already handled by
// routes/app/_layout.jsx. This layout owns course + enrollment data:
// it rejects unenrolled users and shares the data through outlet context.
export default function LearnLayout() {
  const { slug } = useParams();

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(
    course?._id,
  );

  if (courseLoading || !course?._id) {
    return <p>Loading course…</p>;
  }

  if (enrollmentLoading || !enrollment) {
    return <p>Loading course…</p>;
  }

  const enrollmentDestination = getEnrollmentDestination({
    courseSlug: slug,
    enrolled: enrollment.enrolled,
  });

  if (enrollmentDestination) {
    return <Navigate to={enrollmentDestination} replace />;
  }

  return <Outlet context={{ course, enrollment }} />;
}
