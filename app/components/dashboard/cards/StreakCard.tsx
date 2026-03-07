import { Card, CardContent } from "~/components/ui/card";
import { Flame } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const hoverVariants = {
  hover: { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
};

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link to="#" className="block h-full">
        <Card className="h-full bg-gradient-to-br from-[#FE6B36]/10 to-[#FE6B36]/20 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
          <CardContent className="flex h-full flex-col items-center justify-center space-y-3 p-6">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FE6B36]/20"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Flame className="h-6 w-6 text-[#FE6B36]" />
            </motion.div>
            <p className="text-2xl font-bold text-[#FE6B36]">{currentStreak}</p>
            <p className="text-sm font-medium">Current Streak</p>
            <p className="text-xs text-muted-foreground">
              Best: {longestStreak}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
