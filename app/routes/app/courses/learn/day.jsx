import {
  useOutletContext,
  Navigate,
  useParams,
} from "react-router";
import useCompleteDay from "../../../../queries/useCompleteDay";
import { PuttingLadderGame } from "../../../../components/games/PuttingLadderGame";
import { PuttingProgressView } from "../../../../components/games/PuttingProgressView";
import { LessonDayView } from "../../../../components/learn/LessonDayView";
import { buildLessonDayViewModel } from "../../../../components/learn/lesson-day-view-model";
import { getLearnDayRedirect } from "./redirect";

export default function LearnDay() {
  const { dayNumber, slug } = useParams();
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

  const viewModel = buildLessonDayViewModel({
    courseTitle: course.title,
    dayNumber: lesson.dayNumber,
    totalDays: course.days.length,
    title: lesson.title,
    description: lesson.description,
    currentDay: enrollment.currentDay,
    courseSlug: slug,
  });

  return (
    <LessonDayView
      viewModel={viewModel}
      onComplete={handleComplete}
      isPending={isPending}
      errorMessage={isError ? error.message : null}
      gameSlot={
        <PuttingLadderGame
          key={`${course._id}:${day}`}
          courseId={course._id}
          dayNumber={day}
        />
      }
      progressSlot={
        <PuttingProgressView gameSlug={course.slug} courseId={course._id} />
      }
    />
  );
}
