import { motion } from "framer-motion";
import {
  SessionProgressChart,
  EmailSignupSection,
  CourseHeroCard,
  MakeRateCard,
  TotalPuttsCard,
  StreakCard,
  WeakestDistanceCard,
} from "./cards";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface DesktopDashboardProps {
  state: "inCourse" | "courseComplete";
  stats?: any;
  currentDay?: number;
  totalDays?: number;
}

export function DesktopDashboard({
  state,
  stats,
  currentDay = 1,
  totalDays = 5,
}: DesktopDashboardProps) {
  // Use real stats if available, otherwise use defaults
  const makeRate = stats?.overall?.makeRate || 0;
  const totalPuttsMade = stats?.overall?.totalPuttsMade || 0;
  const sessionCount = stats?.overall?.sessionCount || 0;
  const currentStreak = stats?.streaks?.currentStreak || 0;
  const longestStreak = stats?.streaks?.longestStreak || 0;
  const weakestDistance = stats?.highlights?.weakestDistance;
  const weakestDistanceValue = weakestDistance?.distance || 0;
  const weakestDistanceRate = weakestDistance?.percentage || 0;
  const changePercentage = stats?.comparison?.changePercentage || 0;
  const distanceGained = Math.round(
    changePercentage >= 0 ? changePercentage : 0,
  );

  const progressPercentage = ((currentDay - 1) / totalDays) * 100;

  return (
    <div className="flex flex-1 flex-col bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Hero Tile - spans full width */}
          <div className="md:col-span-4">
            <CourseHeroCard
              state={state}
              currentDay={currentDay}
              totalDays={totalDays}
              stats={stats}
            />
          </div>

          {/* Make Rate Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0, duration: 0.5 }}
            className="h-full"
          >
            <MakeRateCard makeRate={makeRate} />
          </motion.div>

          {/* Total Putts Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15, duration: 0.5 }}
            className="h-full"
          >
            <TotalPuttsCard
              totalPuttsMade={totalPuttsMade}
              sessionCount={sessionCount}
            />
          </motion.div>

          {/* Streak Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-full"
          >
            <StreakCard
              currentStreak={currentStreak}
              longestStreak={longestStreak}
            />
          </motion.div>

          {/* Weakest Distance Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45, duration: 0.5 }}
            className="h-full"
          >
            <WeakestDistanceCard
              weakestDistanceValue={weakestDistanceValue}
              weakestDistanceRate={weakestDistanceRate}
            />
          </motion.div>

          {/* Bottom Full-Width Graph */}
          <div className="md:col-span-4">
            <SessionProgressChart stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
