import {
  CourseHeroCard,
  LastSessionCard,
  QuickStats,
  DistanceZones,
  PracticeModeCard,
  CourseCompleteHeroCard,
  NewGoalCard,
  OverallStatsCard,
  EmailSignupSection,
} from "./cards";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatDistanceZones(distanceBreakdown?: any[]): any[] {
  return (
    distanceBreakdown
      ?.filter((zone: any) => zone.distance >= 15 && zone.distance <= 35)
      .map((zone: any) => ({
        distance: `${zone.distance}ft`,
        makePercent: Math.round(zone.percentage),
      })) || []
  );
}

interface MobileDashboardProps {
  state: "inCourse" | "courseComplete";
  stats?: any;
  currentDay?: number;
  totalDays?: number;
  lastSession?: {
    makes: number;
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
  // Extract data for QuickStats
  const overallMakeRate = stats?.overall?.makeRate || 0;
  const currentStreak = stats?.streaks?.currentStreak || 0;
  const totalPuttsMade = stats?.overall?.totalPuttsMade || 0;

  // Filter and format distance zones (15-35ft only)
  const distanceZones = formatDistanceZones(stats?.distanceBreakdown);

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6 pb-20">
        {state === "inCourse" && (
          <>
            <CourseHeroCard currentDay={currentDay} totalDays={totalDays} />
            <QuickStats
              overallMakeRate={overallMakeRate}
              currentStreak={currentStreak}
              totalPuttsMade={totalPuttsMade}
            />
            <LastSessionCard lastSession={lastSession} />
            <DistanceZones
              zones={distanceZones}
              subtitle="15ft – 35ft · Last 30 days"
            />
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
