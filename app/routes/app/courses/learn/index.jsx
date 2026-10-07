import { useOutletContext, Navigate } from "react-router";
import { getLearnIndexDestination } from "./redirect";

export default function LearnIndex() {
  const { course, enrollment } = useOutletContext();

  const destination = getLearnIndexDestination({
    courseSlug: course.slug,
    currentDay: enrollment.currentDay,
    // Same derivation the day route uses, so the two can't disagree.
    // fetchCourse normalizes days, so the array is always present.
    totalDays: course.days.length,
  });

  return <Navigate to={destination} replace />;
}
