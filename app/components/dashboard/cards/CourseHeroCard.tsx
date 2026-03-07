import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";

interface CourseHeroCardProps {
  currentDay?: number;
  totalDays?: number;
  state?: "inCourse" | "courseComplete";
  stats?: any;
}

export function CourseHeroCard({
  currentDay = 1,
  totalDays = 5,
  state = "inCourse",
  stats,
}: CourseHeroCardProps) {
  const progress = Math.round(((currentDay - 1) / totalDays) * 100);

  // Calculate stats for course complete state
  const changePercentage = stats?.comparison?.changePercentage || 0;
  const distanceGained = Math.round(
    changePercentage >= 0 ? changePercentage : 0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="
        relative
        overflow-hidden
        border-l-4
        border-l-primary
        bg-gradient-to-br
        from-primary/90
        via-primary/70
        to-accent/30
        shadow-lg
        "
      >
        <motion.div className="p-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/35 text-white backdrop-blur-sm">
                {state === "inCourse" ? `Day ${currentDay}` : "Completed"}
              </div>
              <span className="text-sm text-white">Putting Course</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                {state === "inCourse"
                  ? "Circle 1 Confidence"
                  : "Course Complete!"}
              </h2>
              <p className="text-sm text-white">
                {state === "inCourse"
                  ? "Continue your putting training"
                  : "You've improved your putting skills"}
              </p>
            </div>
          </motion.div>

          {state === "inCourse" ? (
            <>
              {/* Progress Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mb-6"
              >
                <div className="flex items-center justify-between text-sm text-white">
                  <span>
                    {currentDay - 1} of {totalDays} days completed
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full text-base font-semibold bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Day {currentDay}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          ) : (
            <>
              {/* Completion Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 pt-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Distance Gained</span>
                  <span className="text-lg font-bold text-accent">
                    +{distanceGained}ft
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Consistency</span>
                  <span className="text-lg font-bold text-accent">+18%</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full text-base font-semibold bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    View Results
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}
