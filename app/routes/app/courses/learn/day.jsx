import {
  useOutletContext,
  Navigate,
  useParams,
} from "react-router";
import useCompleteDay from "../../../../queries/useCompleteDay";
import { PuttingLadderGame } from "../../../../components/games/PuttingLadderGame";
import { PuttingProgressView } from "../../../../components/games/PuttingProgressView";
import { getLearnDayRedirect } from "./redirect";

export default function LearnDay() {
  const { dayNumber } = useParams();
  const { course, enrollment } = useOutletContext();

  if (!course || !enrollment) {
    return null;
  }

  const day = Number(dayNumber);

  const {
    mutate: completeDay,
    isPending,
    error,
    isError,
  } = useCompleteDay(course._id);

  const redirectDestination = getLearnDayRedirect({
    dayNumber,
    currentDay: enrollment.currentDay,
    totalDays: course.days.length,
  });

  if (redirectDestination) {
    return <Navigate to={redirectDestination} replace />;
  }

  const lesson = course.days.find((d) => d.dayNumber === day);

  const handleComplete = () => {
    completeDay(day);
  };

  return (
    <div>
      <h1>
        Day {lesson.dayNumber}: {lesson.title}
      </h1>

      <p>{lesson.description}</p>

      <button onClick={handleComplete} disabled={isPending}>
        {isPending ? "Completing…" : "Complete Day"}
      </button>

      <PuttingLadderGame courseId={course._id} dayNumber={day} />

      <PuttingProgressView gameSlug={course.slug} courseId={course._id} />

      {isError && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}
