import { useState } from "react";
import { DashboardView } from "~/components/dashboard/DashboardView";
import { createDashboardViewModel } from "~/components/dashboard/view-model";
import { defaultQueryOptions } from "~/queries/query-options";
import useCourse from "~/queries/useCourse";
import useEnrollment from "~/queries/useEnrollment";
import { useGameSessions } from "~/queries/useGameSession";
import { usePuttingGameStats } from "~/queries/usePuttingGameStats";

const COURSE_SLUG = "putting-course";
const GAME_SLUG = "putting-course";

export default function Dashboard() {
  const [statsDays, setStatsDays] = useState(30);
  const courseQuery = useCourse(COURSE_SLUG, defaultQueryOptions);
  const enrollmentQuery = useEnrollment(
    courseQuery.data?._id,
    defaultQueryOptions,
  );
  const isEnrolled = enrollmentQuery.data?.enrolled === true;
  const statsQuery = usePuttingGameStats({
    ...defaultQueryOptions,
    enabled: isEnrolled,
    days: statsDays,
  });
  const sessionsQuery = useGameSessions(
    GAME_SLUG,
    courseQuery.data?._id,
    { ...defaultQueryOptions, enabled: isEnrolled },
  );

  const viewModel = createDashboardViewModel({
    course: courseQuery.data,
    enrollment: enrollmentQuery.data,
    stats: statsQuery.data,
    sessions: sessionsQuery.data,
    courseLoading: courseQuery.isPending,
    enrollmentLoading: enrollmentQuery.isPending,
    sessionsLoading: sessionsQuery.isPending,
    courseError: courseQuery.error,
    enrollmentError: enrollmentQuery.error,
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

  // The shared shell comes from routes/app/_layout.jsx — no wrapper here.
  return (
    <DashboardView
      statsDays={statsDays}
      onStatsDaysChange={setStatsDays}
      statsPeriod={statsQuery.data?.period}
      statsLoading={isEnrolled && statsQuery.isPending}
      statsError={isEnrolled && statsQuery.isError}
      onStatsRetry={() => { void statsQuery.refetch(); }}
      statsRetrying={statsQuery.isFetching}
      viewModel={viewModel}
      onRetry={handleRetry}
      isRetrying={isRetrying}
    />
  );
}
