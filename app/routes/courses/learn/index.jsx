import { useOutletContext, Navigate } from "react-router";

export default function LearnIndex() {
  const { course, enrollment } = useOutletContext();

  const day = Math.max(1, enrollment.currentDay);

  return <Navigate to={`/courses/${course.slug}/learn/day/${day}`} replace />;
}
