import { Outlet, Navigate, useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import useCourse from "../../../../queries/useCourse";
import useEnrollment from "../../../../queries/useEnrollment";
import { getEnrollmentDestination } from "./enrollment-redirect";

function LearnLoadError({ onRetry, isRetrying }) {
  return (
    <Card role="alert" className="mx-auto w-full max-w-5xl">
      <CardHeader>
        <CardTitle>We couldn't check this course</CardTitle>
        <CardDescription>
          Try again and we'll fetch the course details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="min-h-11" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? "Retrying…" : "Retry"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Nested inside `/app`, so authentication is already handled by
// routes/app/_layout.jsx. This layout owns course + enrollment data:
// it rejects unenrolled users and shares the data through outlet context.
export default function LearnLayout() {
  const { slug } = useParams();

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
    isFetching: courseFetching,
    refetch: refetchCourse,
  } = useCourse(slug);
  const {
    data: enrollment,
    isLoading: enrollmentLoading,
    error: enrollmentError,
    isFetching: enrollmentFetching,
    refetch: refetchEnrollment,
  } = useEnrollment(course?._id);

  // A settled error keeps `data` undefined, so each error branch must come
  // before its loading branch or the failure renders as loading forever.
  if (courseError) {
    return (
      <LearnLoadError
        onRetry={() => refetchCourse()}
        isRetrying={courseFetching}
      />
    );
  }

  if (courseLoading || !course?._id) {
    return <p>Loading course…</p>;
  }

  if (enrollmentError) {
    return (
      <LearnLoadError
        onRetry={() => refetchEnrollment()}
        isRetrying={enrollmentFetching}
      />
    );
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
