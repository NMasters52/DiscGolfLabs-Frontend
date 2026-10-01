import { useOutletContext, Navigate } from "react-router";
import { getLearnIndexDestination } from "./redirect";

export default function LearnIndex() {
  const { course, enrollment } = useOutletContext();

  const destination = getLearnIndexDestination({
    courseSlug: course.slug,
    currentDay: enrollment.currentDay,
    // Same derivation the day route uses, so the two can't disagree.
    totalDays: course.days?.length ?? course.totalDays ?? enrollment.totalDays,
  });

  return <Navigate to={destination} replace />;
}
