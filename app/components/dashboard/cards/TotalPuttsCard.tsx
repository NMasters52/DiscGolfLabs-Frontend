import { Card, CardContent } from "~/components/ui/card";
import { Crosshair } from "lucide-react";
import { Link } from "react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { DiscGolfLabBackground } from "./DiscGolfLabBackground";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const hoverVariants = {
  hover: { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
};

interface TotalPuttsCardProps {
  totalPuttsMade: number;
  sessionCount: number;
}

export function TotalPuttsCard({
  totalPuttsMade,
  sessionCount,
}: TotalPuttsCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, totalPuttsMade, { duration: 1.5 });
    return animation.stop;
  }, [count, totalPuttsMade]);

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
        <Card className="relative h-full overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
          <DiscGolfLabBackground variant="accuracy" density={14} />
          <div className="relative z-10 flex h-full items-center justify-center">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-3 p-6">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Crosshair className="h-6 w-6 text-primary" />
              </motion.div>
              <motion.p className="text-3xl font-bold text-card-foreground">
                {rounded}
              </motion.p>
              <p className="text-sm font-medium text-card-foreground">
                Putts Made
              </p>
              <p className="text-xs text-card-foreground">
                {sessionCount} sessions
              </p>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
