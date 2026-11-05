import { SessionsView } from "~/components/sessions/SessionsView";
import { createSessionsViewModel } from "~/components/sessions/view-model";
import { defaultQueryOptions } from "~/queries/query-options";
import useCourse from "~/queries/useCourse";
import useEnrollment from "~/queries/useEnrollment";
import { useGameSessions } from "~/queries/useGameSession";

// Same course/gslug pairing the dashboard uses; sessions are recorded
// per course, and this page shows the full history for the putting course.
const COURSE_SLUG = "putting-course";

export default function Sessions() {
  const courseQuery = useCourse(COURSE_SLUG, defaultQueryOptions);
  const enrollmentQuery = useEnrollment(
    courseQuery.data?._id,
    defaultQueryOptions,
  );
  const isEnrolled = enrollmentQuery.data?.enrolled === true;
  const sessionsQuery = useGameSessions(
    COURSE_SLUG,
    courseQuery.data?._id,
    { ...defaultQueryOptions, enabled: isEnrolled },
  );

  const viewModel = createSessionsViewModel({
    enrollmentPending: enrollmentQuery.isPending,
    isEnrolled,
    sessions: sessionsQuery.data,
    sessionsLoading: sessionsQuery.isPending,
    sessionsError: sessionsQuery.error,
    courseSlug: COURSE_SLUG,
  });

  // The shared shell comes from routes/app/_layout.jsx — no wrapper here.
  return <SessionsView viewModel={viewModel} />;
}
