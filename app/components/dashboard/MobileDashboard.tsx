import {
  CourseHeroCard,
  LastSessionCard,
  FocusInsightCard,
  PracticeModeCard,
  CourseCompleteHeroCard,
  NewGoalCard,
  OverallStatsCard,
  EmailSignupSection,
} from "./cards";

interface MobileDashboardProps {
  state: "inCourse" | "courseComplete";
  stats?: any;
  currentDay?: number;
  totalDays?: number;
  lastSession?: {
    maxDistance: number;
    makeRate: number;
    attempts: number;
    date: string;
  } | null;
}

export function MobileDashboard({
  state,
  stats,
  currentDay,
  totalDays,
  lastSession,
}: MobileDashboardProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6 pb-20">
        {state === "inCourse" && (
          <>
            <CourseHeroCard currentDay={currentDay} totalDays={totalDays} />
            <LastSessionCard lastSession={lastSession} />
            <FocusInsightCard />
            <PracticeModeCard />
          </>
        )}

        {state === "courseComplete" && (
          <>
            <CourseCompleteHeroCard />
            <NewGoalCard />
            <OverallStatsCard />
            <EmailSignupSection />
          </>
        )}
      </div>
    </div>
  );
}
