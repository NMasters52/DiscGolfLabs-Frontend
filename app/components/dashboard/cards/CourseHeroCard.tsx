import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";

interface CourseHeroCardProps {
  currentDay?: number;
  totalDays?: number;
  state?: "inCourse" | "courseComplete";
  stats?: any;
}

// Canvas-based reticle grid component
function ReticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
      ctx.lineWidth = 1;

      // Draw concentric circles
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      for (let i = 1; i <= 5; i++) {
        const radius = (maxRadius / 5) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Animated segments
        const segmentCount = 8;
        for (let j = 0; j < segmentCount; j++) {
          const startAngle = (j * Math.PI * 2) / segmentCount + time * 0.002;
          const segmentLength = 0.15;
          ctx.beginPath();
          ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            startAngle + segmentLength,
          );
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.5 + 0.3 * Math.sin(time * 0.003 + j)})`;
          ctx.stroke();
        }
      }

      // Draw radial lines
      const lineCount = 12;
      for (let i = 0; i < lineCount; i++) {
        const angle = (i * Math.PI * 2) / lineCount + time * 0.001;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * maxRadius,
          centerY + Math.sin(angle) * maxRadius,
        );
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 + 0.1 * Math.sin(time * 0.002 + i)})`;
        ctx.stroke();
      }

      // Draw crosshair
      ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
      ctx.lineWidth = 1.5;

      // Horizontal
      ctx.beginPath();
      ctx.moveTo(centerX - 40, centerY);
      ctx.lineTo(centerX - 10, centerY);
      ctx.moveTo(centerX + 10, centerY);
      ctx.lineTo(centerX + 40, centerY);
      ctx.stroke();

      // Vertical
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 40);
      ctx.lineTo(centerX, centerY - 10);
      ctx.moveTo(centerX, centerY + 10);
      ctx.lineTo(centerX, centerY + 40);
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
      ctx.fill();

      time++;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// Animated scan beam component
function ScanBeam() {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const animate = () => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 0.5));
    };

    const interval = setInterval(animate, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute w-full h-0.5 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8),0_0_40px_rgba(34,211,238,0.4)]"
        animate={{ top: `${scanPosition}%` }}
        style={{ filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))" }}
      />

      {/* Gradient trail */}
      <motion.div
        className="absolute w-full h-32 bg-gradient-to-b from-cyan-500/20 via-cyan-400/10 to-transparent pointer-events-none"
        animate={{ top: `${scanPosition}%` }}
        style={{ marginTop: "-128px" }}
      />

      {/* Horizontal scan bars */}
      {[0, 20, 40, 60, 80].map((y) => (
        <motion.div
          key={y}
          className="absolute w-full h-px bg-cyan-500/20"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: y * 0.1,
          }}
          style={{ top: `${y}%` }}
        />
      ))}
    </motion.div>
  );
}

export function CourseHeroCard({
  currentDay = 1,
  totalDays = 5,
  state = "inCourse",
  stats,
}: CourseHeroCardProps) {
  const progress = Math.round(((currentDay - 1) / totalDays) * 100);

  // Only render new design for inCourse state
  if (state === "inCourse") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Main card container */}
        <div className="relative overflow-hidden rounded-lg border border-cyan-500/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
          {/* Canvas reticle grid */}
          <ReticleCanvas />

          {/* Scan beam overlay */}
          <ScanBeam />

          {/* Content overlay */}
          <div className="relative z-10 p-6 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/50">
                  Day {currentDay}
                </div>
                <span className="text-sm text-cyan-300/80 font-mono">
                  DISC GOLF LABS
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Circle 1 Confidence
              </h2>
              <p className="text-sm text-cyan-100/70">
                Continue your putting training
              </p>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-100/80">
                  {currentDay - 1} of {totalDays} days completed
                </span>
                <span className="font-mono font-semibold text-cyan-400">
                  {progress}%
                </span>
              </div>

              {/* Progress bar with glow */}
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800/80 border border-cyan-500/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400 rounded-full relative"
                  style={{
                    boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
                  }}
                >
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Button */}
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
                  className="w-full text-base font-semibold bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border border-cyan-400/50 shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Start Day {currentDay}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      </motion.div>
    );
  }

  // Original design for courseComplete state (unchanged)
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
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/90 via-primary/70 to-accent/30 shadow-lg">
        <motion.div className="p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/35 text-white backdrop-blur-sm">
                Completed
              </div>
              <span className="text-sm text-white">Putting Course</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Course Complete!
              </h2>
              <p className="text-sm text-white">
                You've improved your putting skills
              </p>
            </div>
          </motion.div>

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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="w-full text-base font-semibold bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl transition-all"
              >
                View Results
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
