import { useState } from "react";
import { Button } from "~/components/ui/button";
import { LayoutShell } from "~/components/dashboard/LayoutShell";
import { InCourseLayout } from "~/components/dashboard/InCourseLayout";
import { CourseCompleteLayout } from "~/components/dashboard/CourseCompleteLayout";
import type { DashboardState } from "~/components/dashboard/data";
import { usePuttingGameStats } from "~/queries/usePuttingGameStats";
import useCourse from "~/queries/useCourse";
import useEnrollment from "~/queries/useEnrollment";
import { useGameSessions } from "~/queries/useGameSession";

const COURSE_SLUG = "putting-course";

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>("inCourse");
  const { data: stats, isLoading: statsLoading } = usePuttingGameStats();
  const { data: course, isLoading: courseLoading } = useCourse(COURSE_SLUG);
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(
    course?._id,
  );
  const { data: sessions, isLoading: sessionsLoading } = useGameSessions(
    COURSE_SLUG,
    course?._id,
  );

  const currentDay = enrollment?.currentDay;
  const totalDays = enrollment?.totalDays;

  // Extract and format most recent session
  const lastSession =
    sessions?.length > 0
      ? {
          makes: sessions[sessions.length - 1].overall.made,
          makeRate: sessions[sessions.length - 1].overall.percentage / 100,
          attempts: sessions[sessions.length - 1].overall.attempted,
          date: new Date(
            sessions[sessions.length - 1].createdAt,
          ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        }
      : null;

  const isLoading =
    statsLoading || courseLoading || enrollmentLoading || sessionsLoading;

  if (isLoading) {
    return (
      <LayoutShell>
        <div className="flex flex-1 items-center justify-center bg-muted/30 p-6">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-sm text-muted-foreground">
              Loading dashboard...
            </p>
          </div>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      {state === "inCourse" && (
        <InCourseLayout
          stats={stats}
          currentDay={currentDay}
          totalDays={totalDays}
          lastSession={lastSession}
        />
      )}
      {state === "courseComplete" && (
        <CourseCompleteLayout currentDay={currentDay} totalDays={totalDays} />
      )}

      {/* Debug controls for switching states */}
      <div className="fixed bottom-4 right-4 flex gap-2 bg-background border rounded-lg p-2 shadow-lg">
        <button
          onClick={() => setState("inCourse")}
          className={`px-3 py-1 text-sm rounded ${
            state === "inCourse"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          In Course
        </button>
        <button
          onClick={() => setState("courseComplete")}
          className={`px-3 py-1 text-sm rounded ${
            state === "courseComplete"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          Complete
        </button>
      </div>
    </LayoutShell>
  );
}
