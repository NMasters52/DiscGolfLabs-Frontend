import { Outlet, Navigate, useParams } from "react-router";
import useCourse from "../../../queries/useCourse";
import useEnrollment from "../../../queries/useEnrollment";
import { useAuth } from "@clerk/react-router";

export default function LearnLayout() {
  const { slug } = useParams();
  const { isSignedIn, isLoaded } = useAuth();

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(
    course?._id,
  );

  if (!isLoaded) {
    return <p>Loading session…</p>;
  }

  if (!isSignedIn) {
    return <Navigate to={`/courses/${slug}`} replace />;
  }

  if (courseLoading || !course?._id) {
    return <p>Loading course…</p>;
  }

  if (enrollmentLoading || !enrollment) {
    return <p>Loading course…</p>;
  }

  if (!enrollment.enrolled) {
    return <Navigate to={`/courses/${slug}`} replace />;
  }

  return <Outlet context={{ course, enrollment }} />;
}
