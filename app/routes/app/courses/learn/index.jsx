import { useOutletContext, Navigate } from "react-router";
import { getLearnIndexDestination } from "./redirect";

export default function LearnIndex() {
  const { course, enrollment } = useOutletContext();

  const destination = getLearnIndexDestination({
    courseSlug: course.slug,
    currentDay: enrollment.currentDay,
    totalDays: course.days.length,
  });

  return <Navigate to={destination} replace />;
}
