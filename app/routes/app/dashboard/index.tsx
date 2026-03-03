import { useState } from "react";
import { LayoutShell } from "~/components/dashboard/LayoutShell";
import { InCourseLayout } from "~/components/dashboard/InCourseLayout";
import { CourseCompleteLayout } from "~/components/dashboard/CourseCompleteLayout";
import type { DashboardState } from "~/components/dashboard/data";
import { usePuttingGameStats } from "~/queries/usePuttingGameStats";
import useCourse from "~/queries/useCourse";
import useEnrollment from "~/queries/useEnrollment";

const COURSE_SLUG = "putting-course";

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>("inCourse");
  const { data: stats } = usePuttingGameStats();
  const { data: course } = useCourse(COURSE_SLUG);
  const { data: enrollment } = useEnrollment(course?._id);

  const currentDay = enrollment?.currentDay;
  const totalDays = enrollment?.totalDays;

  return (
    <LayoutShell>
      {state === "inCourse" && (
        <InCourseLayout
          stats={stats}
          currentDay={currentDay}
          totalDays={totalDays}
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
