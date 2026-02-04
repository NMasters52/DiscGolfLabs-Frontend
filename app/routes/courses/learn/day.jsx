import { useOutletContext, Navigate, useParams } from "react-router";

export default function LearnDay() {
  const { dayNumber } = useParams();
  const { course, enrollment } = useOutletContext();

  const day = Number(dayNumber);

  // invalid day
  if (Number.isNaN(day) || day < 1 || day > course.days.length) {
    return <Navigate to=".." replace />;
  }

  // locked day
  if (day > enrollment.currentDay) {
    return <Navigate to=".." replace />;
  }

  const lesson = course.days.find((d) => d.dayNumber === day);

  return (
    <div>
      <h1>
        Day {lesson.dayNumber}: {lesson.title}
      </h1>

      <p>{lesson.description}</p>

      {/* video */}
      {/* game */}
      {/* complete button (next step) */}
    </div>
  );
}
