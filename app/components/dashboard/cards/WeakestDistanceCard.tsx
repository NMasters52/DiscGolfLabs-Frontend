import { Card, CardContent } from "~/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

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
        <Card
          className="h-full bg-gradient-to-br from-destructive/5 to-destructive/10 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%),
              repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239, 68, 68, 0.03) 10px, rgba(239, 68, 68, 0.03) 20px)
            `,
          }}
        >
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
            <p className="text-2xl font-bold text-destructive">
              {weakestDistanceValue}ft
            </p>
            <p className="text-sm font-medium">Weakest Distance</p>
            <p className="text-xs text-muted-foreground">
              {Math.round(weakestDistanceRate)}% make rate
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
