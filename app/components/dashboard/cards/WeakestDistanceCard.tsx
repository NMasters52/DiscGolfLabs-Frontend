import { Card, CardContent } from "~/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const hoverVariants = {
  hover: { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
};

interface WeakestDistanceCardProps {
  weakestDistanceValue: number;
  weakestDistanceRate: number;
}

export function WeakestDistanceCard({
  weakestDistanceValue,
  weakestDistanceRate,
}: WeakestDistanceCardProps) {
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
        <Card className="relative h-full overflow-hidden hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
          <DiscGolfLabBackground variant="lab" density={18} />
          <div className="relative z-10 flex h-full items-center justify-center">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-3 p-6">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/20"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </motion.div>
              <p className="text-2xl font-bold text-card-foreground">
                {weakestDistanceValue}ft
              </p>
              <p className="text-sm font-medium text-card-foreground">
                Weakest Distance
              </p>
              <p className="text-xs text-card-foreground">
                {Math.round(weakestDistanceRate)}% make rate
              </p>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
