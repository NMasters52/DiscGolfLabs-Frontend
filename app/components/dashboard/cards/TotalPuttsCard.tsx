import { Card, CardContent } from "~/components/ui/card";
import { Link } from "react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

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
        <Card className="h-full hover:shadow-lg hover:shadow-accent/20 transition-all duration-300">
          <CardContent className="flex h-full flex-col items-center justify-center space-y-3 p-6">
            <motion.p className="text-3xl font-bold text-accent">
              {rounded}
            </motion.p>
            <p className="text-sm font-medium">Putts Made</p>
            <p className="text-xs text-muted-foreground">
              {sessionCount} sessions
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
