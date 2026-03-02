import { useState } from "react";
import { LayoutShell } from "~/components/dashboard/LayoutShell";
import { InCourseLayout } from "~/components/dashboard/InCourseLayout";
import { CourseCompleteLayout } from "~/components/dashboard/CourseCompleteLayout";
import type { DashboardState } from "~/components/dashboard/data";
import { usePuttingGameStats } from "~/queries/usePuttingGameStats";

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>("inCourse");
  const { data: stats } = usePuttingGameStats();

  return (
    <LayoutShell>
      {state === "inCourse" && <InCourseLayout stats={stats} />}
      {state === "courseComplete" && <CourseCompleteLayout />}

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
