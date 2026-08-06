import { LayoutShell } from "~/components/dashboard/LayoutShell";
import { DashboardView } from "~/components/dashboard/DashboardView";
import { createDashboardViewModel } from "~/components/dashboard/view-model";
import useCourse from "~/queries/useCourse";
import useEnrollment from "~/queries/useEnrollment";
import { useGameSessions } from "~/queries/useGameSession";
import { usePuttingGameStats } from "~/queries/usePuttingGameStats";

const COURSE_SLUG = "putting-course";
const GAME_SLUG = "putting-course";

export default function Dashboard() {
  const courseQuery = useCourse(COURSE_SLUG, { retry: 1 });
  const enrollmentQuery = useEnrollment(courseQuery.data?._id, { retry: 1 });
  const isEnrolled = enrollmentQuery.data?.enrolled === true;
  const statsQuery = usePuttingGameStats({ enabled: isEnrolled, retry: 1 });
  const sessionsQuery = useGameSessions(
    GAME_SLUG,
    courseQuery.data?._id,
    { enabled: isEnrolled, retry: 1 },
  );

  const viewModel = createDashboardViewModel({
    course: courseQuery.data,
    enrollment: enrollmentQuery.data,
    stats: statsQuery.data,
    sessions: sessionsQuery.data,
    courseLoading: courseQuery.isPending,
    enrollmentLoading: enrollmentQuery.isPending,
    statsLoading: statsQuery.isPending,
    sessionsLoading: sessionsQuery.isPending,
    courseError: courseQuery.error,
    enrollmentError: enrollmentQuery.error,
    statsError: statsQuery.error,
    sessionsError: sessionsQuery.error,
  });

  const handleRetry = () => {
    if (courseQuery.isError) void courseQuery.refetch();
    if (enrollmentQuery.isError) void enrollmentQuery.refetch();
    if (statsQuery.isError) void statsQuery.refetch();
    if (sessionsQuery.isError) void sessionsQuery.refetch();
  };

  return (
    <LayoutShell>
      <DashboardView viewModel={viewModel} onRetry={handleRetry} />
    </LayoutShell>
  );
}
