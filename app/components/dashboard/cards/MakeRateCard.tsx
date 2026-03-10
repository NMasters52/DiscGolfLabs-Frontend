import { Card, CardContent } from "~/components/ui/card";
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

interface MakeRateCardProps {
  makeRate: number;
}

export function MakeRateCard({ makeRate }: MakeRateCardProps) {
  const percentage = Math.round(makeRate);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
          <DiscGolfLabBackground variant="putting" density={12} />
          <div className="relative z-10 flex h-full items-center justify-center">
            <CardContent className="flex h-full flex-col items-center justify-center space-y-3 p-6">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-24 w-24 -rotate-90 transform">
                  <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-green-600/20"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-green-600"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      strokeDasharray: circumference,
                    }}
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-card-foreground">
                  {percentage}%
                </span>
              </div>
              <p className="text-sm font-medium text-card-foreground">
                Make Rate
              </p>
              <p className="text-xs text-card-foreground">Overall</p>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
