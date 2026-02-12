import {
  useOutletContext,
  Navigate,
  useParams,
  useNavigate,
} from "react-router";
import useCompleteDay from "../../../queries/useCompleteDay";
import { PuttingLadderGame } from "../../../components/games/PuttingLadderGame";
import { PuttingProgressView } from "../../../components/games/PuttingProgressView";

export default function LearnDay() {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
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

  if (Number.isNaN(day) || day < 1 || day > course.days.length) {
    return <Navigate to=".." replace />;
  }

  if (day > enrollment.currentDay) {
    return <Navigate to=".." replace />;
  }

  const lesson = course.days.find((d) => d.dayNumber === day);

  const handleComplete = () => {
    completeDay(day, {
      onSuccess: () => {
        navigate(`/courses/${course.slug}/learn`, { replace: true });
      },
    });
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

      <PuttingLadderGame />

      <PuttingProgressView gamSlug={course.gameSlug} courseId={course._id} />

      {isError && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}
