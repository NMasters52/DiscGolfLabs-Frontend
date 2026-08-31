import { LayoutShell } from "~/components/dashboard/LayoutShell";
import { DashboardView } from "~/components/dashboard/DashboardView";
import { createDashboardViewModel } from "~/components/dashboard/view-model";
import { dashboardQueryOptions } from "~/queries/dashboard-options";
import useCourse from "~/queries/useCourse";
import useEnrollment from "~/queries/useEnrollment";
import { useGameSessions } from "~/queries/useGameSession";
import { usePuttingGameStats } from "~/queries/usePuttingGameStats";

const COURSE_SLUG = "putting-course";
const GAME_SLUG = "putting-course";

export default function Dashboard() {
  const courseQuery = useCourse(COURSE_SLUG, dashboardQueryOptions);
  const enrollmentQuery = useEnrollment(
    courseQuery.data?._id,
    dashboardQueryOptions,
  );
  const isEnrolled = enrollmentQuery.data?.enrolled === true;
  const statsQuery = usePuttingGameStats({
    ...dashboardQueryOptions,
    enabled: isEnrolled,
  });
  const sessionsQuery = useGameSessions(
    GAME_SLUG,
    courseQuery.data?._id,
    { ...dashboardQueryOptions, enabled: isEnrolled },
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

  const dashboardQueries = [
    courseQuery,
    enrollmentQuery,
    statsQuery,
    sessionsQuery,
  ];

  const handleRetry = () => {
    const errored = dashboardQueries.filter((query) => query.isError);
    const targets = errored.length > 0 ? errored : dashboardQueries;
    void Promise.all(targets.map((query) => query.refetch()));
  };

  const isRetrying =
    viewModel.state === "loadError" &&
    dashboardQueries.some((query) => query.isFetching);

  return (
    <LayoutShell>
      <DashboardView
        viewModel={viewModel}
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    </LayoutShell>
  );
}
