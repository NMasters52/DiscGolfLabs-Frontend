import { Outlet, Navigate, useParams } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import useCourse from "../../../queries/useCourse";
import useEnrollment from "../../../queries/useEnrollment";

export default function LearnLayout() {
  const { slug } = useParams();
  const { isSignedIn } = useAuth();

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(
    course?._id,
  );

  // 1. Auth gate
  if (!isSignedIn) {
    return <Navigate to={`/courses/${slug}`} replace />;
  }

  // 2. Loading state
  if (courseLoading || enrollmentLoading) {
    return <p>Loading course…</p>;
  }

  // 3. Enrollment gate
  if (!enrollment?.enrolled) {
    return <Navigate to={`/courses/${slug}`} replace />;
  }

  // 4. Access granted
  return <Outlet context={{ course, enrollment }} />;
}
