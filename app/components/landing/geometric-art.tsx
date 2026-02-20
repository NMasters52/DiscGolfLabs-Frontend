import { useEffect, useRef } from "react";

interface GeometricArtProps {
  side: "left" | "right";
}

export const GeometricArt = ({ side }: GeometricArtProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      const isDark = document.documentElement.classList.contains("dark");
      draw(ctx, rect.width, rect.height, side, isDark);
    };

    resize();
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => {
      resize();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [side]);

  return (
    <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
  );
};

/* ---- Color definitions ---- */

// Dark mode colors (brighter on dark background)
const DARK_COLORS = {
  CYAN: "#6deaf9",
  CYAN_DIM: "rgba(109,234,249,0.4)",
  CYAN_MID: "rgba(109,234,249,0.6)",
  CYAN_BRIGHT: "rgba(109,234,249,0.9)",
  CYAN_GLOW: "rgba(109,234,249,0.15)",
  BLUE: "rgba(28,81,129,0.5)",
  BLUE_DIM: "rgba(28,81,129,0.3)",
  GREEN_MID: "rgba(47,212,99,0.5)",
  GRID_SMALL: "rgba(109,234,249,0.025)",
  GRID_LARGE: "rgba(109,234,249,0.05)",
  NODE_LINE: (a: number) => `rgba(109,234,249,${a})`,
  LABEL: "rgba(109,234,249,0.2)",
  TARGET: "rgba(109,234,249,0.15)",
  DISC_INNER: "rgba(47,212,99,0.18)",
  CROSSHAIR: "rgba(232,236,244,0.08)",
  CROSSHAIR_CIRCLE: "rgba(232,236,244,0.06)",
};

// Light mode colors (darker for visibility on light background)
const LIGHT_COLORS = {
  CYAN: "#0891b2",
  CYAN_DIM: "rgba(8,145,178,0.55)",
  CYAN_MID: "rgba(8,145,178,0.7)",
  CYAN_BRIGHT: "rgba(8,145,178,0.95)",
  CYAN_GLOW: "rgba(8,145,178,0.2)",
  BLUE: "rgba(28,81,129,0.55)",
  BLUE_DIM: "rgba(28,81,129,0.4)",
  GREEN_MID: "rgba(22,163,74,0.55)",
  GRID_SMALL: "rgba(8,145,178,0.08)",
  GRID_LARGE: "rgba(8,145,178,0.12)",
  NODE_LINE: (a: number) => `rgba(8,145,178,${a + 0.15})`,
  LABEL: "rgba(8,145,178,0.35)",
  TARGET: "rgba(8,145,178,0.3)",
  DISC_INNER: "rgba(22,163,74,0.25)",
  CROSSHAIR: "rgba(8,145,178,0.15)",
  CROSSHAIR_CIRCLE: "rgba(8,145,178,0.1)",
};

type Colors = typeof DARK_COLORS;

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  side: "left" | "right",
  isDark: boolean,
) {
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  ctx.clearRect(0, 0, w, h);

  /* ---- Micro-grid (lab paper) ---- */
  const gridSmall = 24;
  ctx.strokeStyle = colors.GRID_SMALL;
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= w; x += gridSmall) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += gridSmall) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  /* ---- Major grid lines ---- */
  const gridLarge = gridSmall * 4;
  ctx.strokeStyle = colors.GRID_LARGE;
  ctx.lineWidth = 0.7;
  for (let x = 0; x <= w; x += gridLarge) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += gridLarge) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  /* ---- Basket schematics (3 baskets per side, asymmetric) ---- */
  if (side === "left") {
    // Moved first basket down to avoid text overlap
    drawBasket(ctx, w * 0.18, h * 0.28, 0.55, colors);
    drawBasket(ctx, w * 0.45, h * 0.55, 0.65, colors);
    drawBasket(ctx, w * 0.78, h * 0.82, 0.45, colors);
  } else {
    drawBasket(ctx, w * 0.25, h * 0.85, 0.5, colors);
    drawBasket(ctx, w * 0.62, h * 0.22, 0.6, colors);
    drawBasket(ctx, w * 0.88, h * 0.58, 0.52, colors);
  }

  /* ---- Flight trajectory arcs ---- */
  if (side === "left") {
    drawFlightArc(
      ctx,
      w * 0.92,
      h * 0.48,
      w * 0.55,
      h * 0.38,
      w * 0.12,
      h * 0.52,
      colors.CYAN_MID,
      colors.CYAN_GLOW,
    );
    drawFlightArc(
      ctx,
      w * 0.78,
      h * 0.94,
      w * 0.42,
      h * 0.92,
      w * 0.1,
      h * 0.96,
      colors.BLUE,
      "rgba(28,81,129,0.04)",
    );
  } else {
    drawFlightArc(
      ctx,
      w * 0.08,
      h * 0.5,
      w * 0.45,
      h * 0.4,
      w * 0.88,
      h * 0.54,
      colors.CYAN_MID,
      colors.CYAN_GLOW,
    );
    drawFlightArc(
      ctx,
      w * 0.22,
      h * 0.92,
      w * 0.58,
      h * 0.88,
      w * 0.9,
      h * 0.94,
      colors.BLUE,
      "rgba(28,81,129,0.04)",
    );
  }

  /* ---- Measurement dimension lines ---- */
  if (side === "left") {
    drawDimension(
      ctx,
      w * 0.08,
      h * 0.65,
      w * 0.48,
      h * 0.65,
      "342 ft",
      colors,
    );
    drawDimension(
      ctx,
      w * 0.6,
      h * 0.08,
      w * 0.6,
      h * 0.36,
      "12.4°",
      colors,
      true,
    );
  } else {
    drawDimension(
      ctx,
      w * 0.52,
      h * 0.65,
      w * 0.92,
      h * 0.65,
      "287 ft",
      colors,
    );
    drawDimension(
      ctx,
      w * 0.4,
      h * 0.08,
      w * 0.4,
      h * 0.36,
      "8.7°",
      colors,
      true,
    );
  }

  /* ---- Disc profile views (5 discs per side, asymmetric) ---- */
  if (side === "left") {
    drawDiscProfile(ctx, w * 0.08, h * 0.35, 14, 0.25, colors);
    drawDiscProfile(ctx, w * 0.35, h * 0.18, 18, -0.4, colors);
    drawDiscProfile(ctx, w * 0.72, h * 0.42, 12, 0.5, colors);
    drawDiscProfile(ctx, w * 0.55, h * 0.75, 15, -0.15, colors);
    drawDiscProfile(ctx, w * 0.85, h * 0.28, 11, 0.6, colors);
  } else {
    drawDiscProfile(ctx, w * 0.12, h * 0.68, 13, -0.35, colors);
    drawDiscProfile(ctx, w * 0.38, h * 0.42, 16, 0.45, colors);
    drawDiscProfile(ctx, w * 0.65, h * 0.78, 14, -0.55, colors);
    drawDiscProfile(ctx, w * 0.82, h * 0.15, 17, 0.3, colors);
    drawDiscProfile(ctx, w * 0.92, h * 0.55, 12, -0.2, colors);
  }

  /* ---- Data-node scatter ---- */
  const rand = seededRandom(side === "left" ? 42 : 137);
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < 10; i++) {
    nodes.push({
      x: Math.round((rand() * w) / gridSmall) * gridSmall,
      y: Math.round((rand() * h) / gridSmall) * gridSmall,
    });
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140 && dist > 30) {
        const a = (1 - dist / 140) * 0.12;
        ctx.strokeStyle = colors.NODE_LINE(a);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  for (const n of nodes) {
    ctx.fillStyle = colors.CYAN_DIM;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.CYAN_BRIGHT;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---- Crosshair markers ---- */
  if (side === "left") {
    drawCrosshair(ctx, w * 0.42, h * 0.42, colors);
    drawCrosshair(ctx, w * 0.78, h * 0.62, colors);
  } else {
    drawCrosshair(ctx, w * 0.58, h * 0.42, colors);
    drawCrosshair(ctx, w * 0.22, h * 0.6, colors);
  }

  /* ---- Spec labels ---- */
  ctx.font = "700 9px monospace";
  ctx.fillStyle = colors.LABEL;
  if (side === "left") {
    ctx.textAlign = "left";
    ctx.fillText("DGL-001", w * 0.08, h * 0.06);
    ctx.fillText(
      "SPD  13  |  GLI  5  |  TRN  -1  |  FAD  3",
      w * 0.08,
      h * 0.06 + 14,
    );
    ctx.fillText("FLIGHT  PROFILE", w * 0.62, h * 0.42);
  } else {
    ctx.textAlign = "right";
    ctx.fillText("DGL-002", w * 0.92, h * 0.06);
    ctx.fillText(
      "SPD  9  |  GLI  5  |  TRN  -2  |  FAD  1",
      w * 0.92,
      h * 0.06 + 14,
    );
    ctx.textAlign = "left";
    ctx.fillText("RELEASE  DATA", w * 0.1, h * 0.42);
  }
}

/* ---------- ELEMENT DRAWERS ---------- */

function drawBasket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  colors: Colors,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.strokeStyle = colors.CYAN_DIM;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.lineTo(0, 44);
  ctx.stroke();

  ctx.strokeStyle = colors.CYAN_MID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, -38, 24, 7, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.CYAN_DIM;
  ctx.lineWidth = 0.7;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 9, -32);
    ctx.lineTo(i * 6, 4);
    ctx.stroke();
  }

  ctx.strokeStyle = colors.CYAN_MID;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 4, 20, 6, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.CYAN_DIM;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-14, 44);
  ctx.lineTo(14, 44);
  ctx.stroke();

  ctx.fillStyle = colors.TARGET;
  ctx.font = "700 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText("TARGET", 0, 58);

  ctx.restore();
}

function drawFlightArc(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  cx: number,
  cy: number,
  ex: number,
  ey: number,
  color: string,
  glow: string,
) {
  ctx.strokeStyle = glow;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const pt of [
    { x: sx, y: sy },
    { x: ex, y: ey },
  ]) {
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDimension(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label: string,
  colors: Colors,
  vertical = false,
) {
  const tk = 5;
  ctx.strokeStyle = colors.BLUE_DIM;
  ctx.lineWidth = 0.7;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  if (vertical) {
    ctx.beginPath();
    ctx.moveTo(x1 - tk, y1);
    ctx.lineTo(x1 + tk, y1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2 - tk, y2);
    ctx.lineTo(x2 + tk, y2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x1, y1 - tk);
    ctx.lineTo(x1, y1 + tk);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2 - tk);
    ctx.lineTo(x2, y2 + tk);
    ctx.stroke();
  }

  ctx.fillStyle = colors.LABEL;
  ctx.font = "700 8px monospace";
  ctx.textAlign = "center";
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  if (vertical) {
    ctx.save();
    ctx.translate(mx - 10, my);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(label, mx, my - 8);
  }
}

function drawDiscProfile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  tilt: number,
  colors: Colors,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.strokeStyle = colors.GREEN_MID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = colors.DISC_INNER;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.55, radius * 0.18, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCrosshair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colors: Colors,
) {
  const len = 12;
  ctx.strokeStyle = colors.CROSSHAIR;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - len, y);
  ctx.lineTo(x + len, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - len);
  ctx.lineTo(x, y + len);
  ctx.stroke();
  ctx.strokeStyle = colors.CROSSHAIR_CIRCLE;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.stroke();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}
