import { useMemo } from "react";
import { motion } from "framer-motion";
import { Disc, Target, FlaskConical, Beaker, Atom, Orbit } from "lucide-react";

interface DiscGolfLabBackgroundProps {
  variant: "putting" | "accuracy" | "lab" | "training";
  density?: number;
}

interface IconPosition {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  x: number;
  y: number;
  size: number;
  rotate: number;
  delay: number;
}

type Variant = {
  icons: React.ComponentType<{ size?: number; strokeWidth?: number }>[];
  glow: string;
};

const VARIANTS: Record<string, Variant> = {
  putting: {
    icons: [Disc, Target],
    glow: "#22c55e",
  },
  accuracy: {
    icons: [Target, Orbit],
    glow: "#38bdf8",
  },
  lab: {
    icons: [FlaskConical, Beaker, Atom],
    glow: "#a78bfa",
  },
  training: {
    icons: [Disc, Target, FlaskConical],
    glow: "#f59e0b",
  },
};

export function DiscGolfLabBackground({
  variant,
  density = 12,
}: DiscGolfLabBackgroundProps) {
  const variantConfig = VARIANTS[variant];

  const iconPositions = useMemo(() => {
    const positions: IconPosition[] = [];

    for (let i = 0; i < density; i++) {
      const Icon = variantConfig.icons[i % variantConfig.icons.length];
      positions.push({
        Icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 16 + Math.random() * 24,
        rotate: Math.random() * 360,
        delay: Math.random() * 2,
      });
    }

    return positions;
  }, [variantConfig.icons, density]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${variantConfig.glow}30 0%, transparent 70%)`,
        }}
      />

      {/* Lab grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]">
        <defs>
          <pattern
            id="lab-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lab-grid)" />
      </svg>

      {/* Floating icons */}
      <div className="absolute inset-0">
        {iconPositions.map((position, index) => (
          <motion.div
            key={`${variant}-${index}`}
            className="absolute opacity-60"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: position.size,
              height: position.size,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.6, 0.5],
              scale: [0, 1, 0.8],
              rotate: [0, position.rotate, position.rotate * 1.5],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: position.delay,
            }}
          >
            <div style={{ color: variantConfig.glow }}>
              <position.Icon size={position.size} strokeWidth={1.5} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edge fade mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
    </div>
  );
}
