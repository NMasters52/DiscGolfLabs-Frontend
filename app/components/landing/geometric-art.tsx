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

const DARK_COLORS = {
  CYAN: "#6deaf9",
  CYAN_DIM: "rgba(109,234,249,0.4)",
  CYAN_MID: "rgba(109,234,249,0.8)", // Increased opacity for solidity
  CYAN_BRIGHT: "rgba(109,234,249,0.9)",
  CYAN_GLOW: "rgba(109,234,249,0.25)",
  BLUE: "rgba(28,81,129,0.5)",
  BLUE_DIM: "rgba(28,81,129,0.3)",
  GREEN_MID: "rgba(47,212,99,0.5)",
  GRID_SMALL: "rgba(109,234,249,0.025)",
  GRID_LARGE: "rgba(109,234,249,0.05)",
  NODE_LINE: (a: number) => `rgba(109,234,249,${a})`,
  LABEL: "rgba(109,234,249,0.3)",
  TARGET: "rgba(109,234,249,0.2)",
  DISC_INNER: "rgba(47,212,99,0.18)",
  CROSSHAIR: "rgba(232,236,244,0.08)",
  CROSSHAIR_CIRCLE: "rgba(232,236,244,0.06)",
  BG_MASK: "#090c10", // Used to hide lines behind the band
};

const LIGHT_COLORS = {
  CYAN: "#0891b2",
  CYAN_DIM: "rgba(8,145,178,0.55)",
  CYAN_MID: "rgba(8,145,178,0.85)", // Increased opacity for solidity
  CYAN_BRIGHT: "rgba(8,145,178,0.95)",
  CYAN_GLOW: "rgba(8,145,178,0.25)",
  BLUE: "rgba(28,81,129,0.55)",
  BLUE_DIM: "rgba(28,81,129,0.4)",
  GREEN_MID: "rgba(22,163,74,0.55)",
  GRID_SMALL: "rgba(8,145,178,0.08)",
  GRID_LARGE: "rgba(8,145,178,0.12)",
  NODE_LINE: (a: number) => `rgba(8,145,178,${a + 0.15})`,
  LABEL: "rgba(8,145,178,0.45)",
  TARGET: "rgba(8,145,178,0.4)",
  DISC_INNER: "rgba(22,163,74,0.25)",
  CROSSHAIR: "rgba(8,145,178,0.15)",
  CROSSHAIR_CIRCLE: "rgba(8,145,178,0.1)",
  BG_MASK: "#ffffff",
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

  /* ---- Radial Gradient to draw eye to center video ---- */
  const innerEdgeX = side === "left" ? w : 0;
  const grad = ctx.createRadialGradient(
    innerEdgeX,
    h / 2,
    0,
    innerEdgeX,
    h / 2,
    w,
  );
  grad.addColorStop(0, colors.CYAN_GLOW);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

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

  /* ---- Basket schematics - Positioned to frame the video ---- */
  if (side === "left") {
    drawBasket(ctx, w * 0.15, h * 0.25, 0.5, colors);
    drawBasket(ctx, w * 0.4, h * 0.8, 0.6, colors);
    drawBasket(ctx, w * 0.85, h * 0.5, 0.7, colors); // Target basket near video
  } else {
    drawBasket(ctx, w * 0.15, h * 0.5, 0.7, colors); // Target basket near video
    drawBasket(ctx, w * 0.6, h * 0.2, 0.6, colors);
    drawBasket(ctx, w * 0.85, h * 0.85, 0.5, colors);
  }

  /* ---- Flight trajectory arcs - Sweeping toward the video ---- */
  if (side === "left") {
    // Main leading line toward video
    drawFlightArc(
      ctx,
      w * 0.05,
      h * 0.65,
      w * 0.4,
      h * 0.35,
      w * 0.85,
      h * 0.5, // Points directly to the inner basket
      colors.CYAN_MID,
      colors.CYAN_GLOW,
    );
  } else {
    // Main leading line toward video
    drawFlightArc(
      ctx,
      w * 0.95,
      h * 0.35,
      w * 0.6,
      h * 0.65,
      w * 0.15,
      h * 0.5, // Points directly to the inner basket
      colors.CYAN_MID,
      colors.CYAN_GLOW,
    );
  }

  /* ---- Measurement dimension lines ---- */
  if (side === "left") {
    drawDimension(ctx, w * 0.1, h * 0.75, w * 0.8, h * 0.75, "412 ft", colors);
    drawDimension(
      ctx,
      w * 0.5,
      h * 0.1,
      w * 0.5,
      h * 0.35,
      "14.2°",
      colors,
      true,
    );
  } else {
    drawDimension(ctx, w * 0.2, h * 0.75, w * 0.9, h * 0.75, "385 ft", colors);
    drawDimension(
      ctx,
      w * 0.5,
      h * 0.1,
      w * 0.5,
      h * 0.35,
      "11.8°",
      colors,
      true,
    );
  }

  /* ---- Disc profile views ---- */
  if (side === "left") {
    drawDiscProfile(ctx, w * 0.1, h * 0.65, 14, 0.2, colors);
    drawDiscProfile(ctx, w * 0.25, h * 0.5, 16, 0.1, colors);
    drawDiscProfile(ctx, w * 0.55, h * 0.4, 18, 0, colors);
    drawDiscProfile(ctx, w * 0.75, h * 0.45, 15, -0.1, colors);
  } else {
    drawDiscProfile(ctx, w * 0.9, h * 0.35, 14, -0.2, colors);
    drawDiscProfile(ctx, w * 0.75, h * 0.5, 16, -0.1, colors);
    drawDiscProfile(ctx, w * 0.45, h * 0.6, 18, 0, colors);
    drawDiscProfile(ctx, w * 0.25, h * 0.55, 15, 0.1, colors);
  }

  /* ---- Data-node scatter ---- */
  const rand = seededRandom(side === "left" ? 42 : 137);
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const xBias = side === "left" ? 0.4 + rand() * 0.6 : rand() * 0.6;
    nodes.push({
      x: Math.round((xBias * w) / gridSmall) * gridSmall,
      y: Math.round((rand() * h) / gridSmall) * gridSmall,
    });
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist > 20) {
        const a = (1 - dist / 150) * 0.15;
        ctx.strokeStyle = colors.NODE_LINE(a);
        ctx.lineWidth = 0.8;
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

  /* ---- Spec labels ---- */
  ctx.font = "700 9px monospace";
  ctx.fillStyle = colors.LABEL;
  if (side === "left") {
    ctx.textAlign = "left";
    ctx.fillText("DGL-001 [MAX DISTANCE]", w * 0.05, h * 0.08);
    ctx.fillText("SPD 13 | GLI 5 | TRN -1 | FAD 3", w * 0.05, h * 0.08 + 14);
  } else {
    ctx.textAlign = "right";
    ctx.fillText("DGL-002 [CONTROL]", w * 0.95, h * 0.08);
    ctx.fillText("SPD 9 | GLI 5 | TRN -2 | FAD 1", w * 0.95, h * 0.08 + 14);
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

  // --- Center Pole ---
  ctx.fillStyle = colors.CYAN_MID;
  ctx.fillRect(-2, -50, 4, 110);

  // --- Chains ---
  ctx.strokeStyle = colors.CYAN_DIM;
  ctx.lineWidth = 1;
  const numChains = 6;
  for (let i = -numChains; i <= numChains; i++) {
    if (i === 0) continue; // Leave center open for pole

    // Outer to inner gathering loop
    const startX = i * (24 / numChains);
    const endX = i * 1.5; // gathers near the pole inside the basket

    ctx.beginPath();
    ctx.moveTo(startX, -38);
    // Draw sweeping chain curve dropping into the basket
    ctx.quadraticCurveTo(startX * 0.8, -10, endX, 10);
    ctx.stroke();
  }

  // --- Top Band (Smaller and Solid) ---
  // Background mask to hide pole/chains behind the band
  ctx.fillStyle = colors.BG_MASK;
  ctx.beginPath();
  ctx.ellipse(0, -50, 26, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-26, -50, 52, 8);

  // Solid colored cylinder fill
  ctx.fillStyle = colors.CYAN_MID;
  ctx.beginPath();
  ctx.ellipse(0, -50, 26, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-26, -50, 52, 8);

  // Cylinder top and bottom rims
  ctx.strokeStyle = colors.CYAN_BRIGHT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, -50, 26, 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -42, 26, 4, 0, 0, Math.PI * 2); // Reduced height from 12 to 8
  ctx.stroke();

  // --- Catching Tray (Cage) ---
  ctx.strokeStyle = colors.CYAN_DIM; // Subdued tray slightly to let top band pop
  ctx.lineWidth = 1.5;

  // Upper Tray Ring
  ctx.beginPath();
  ctx.ellipse(0, 5, 30, 7, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Lower Tray Ring
  ctx.beginPath();
  ctx.ellipse(0, 22, 24, 6, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Tray Vertical Struts (connecting upper and lower rings)
  ctx.lineWidth = 1.2;
  const numStruts = 7;
  for (let i = -numStruts; i <= numStruts; i++) {
    const ratio = i / numStruts;
    const topX = ratio * 30;
    const bottomX = ratio * 24;

    // Add offset for 3D rim curve illusion
    const topY = 5 + Math.sqrt(1 - ratio * ratio) * 7 * (i % 2 === 0 ? 1 : -1);
    const bottomY =
      22 + Math.sqrt(1 - ratio * ratio) * 6 * (i % 2 === 0 ? 1 : -1);

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomX, bottomY);
    ctx.stroke();
  }

  // Inner Spoke Grid (connecting lower tray ring to center pole)
  ctx.strokeStyle = colors.CYAN_DIM;
  ctx.lineWidth = 1;
  for (let i = -numStruts; i <= numStruts; i += 2) {
    const ratio = i / numStruts;
    const rimX = ratio * 24;
    const rimY = 22 + Math.sqrt(1 - ratio * ratio) * 6;

    ctx.beginPath();
    ctx.moveTo(rimX, rimY);
    // Angle down to the central pole connection point
    ctx.lineTo(0, 28);
    ctx.stroke();
  }

  // --- Base ---
  // Circular ground ring
  ctx.strokeStyle = colors.CYAN_MID;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 60, 22, 5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Connecting base spokes (ring to pole)
  ctx.lineWidth = 1;
  const baseSpokes = [-18, -10, 0, 10, 18];
  for (const xOffset of baseSpokes) {
    const ratio = xOffset / 22;
    const yOffset =
      60 + Math.sqrt(1 - ratio * ratio) * 5 * (xOffset === 0 ? -1 : 1);

    ctx.beginPath();
    ctx.moveTo(xOffset, yOffset);
    ctx.lineTo(0, 55); // Connect to pole slightly above ground
    ctx.stroke();
  }

  // Target Label below
  ctx.fillStyle = colors.TARGET;
  ctx.font = "700 8px monospace";
  ctx.textAlign = "center";
  ctx.fillText("TARGET", 0, 78);

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
  // Glow effect
  ctx.strokeStyle = glow;
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.stroke();

  // Solid center line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.stroke();
  ctx.setLineDash([]);

  // Origin & Target markers
  const markers = [
    { x: sx, y: sy, r: 4 },
    { x: ex, y: ey, r: 6 },
  ];
  for (const pt of markers) {
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
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
  ctx.lineWidth = 1;

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
  ctx.font = "700 9px monospace";
  ctx.textAlign = "center";
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  if (vertical) {
    ctx.save();
    ctx.translate(mx - 12, my);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(label, mx, my - 10);
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

  // Outer rim
  ctx.strokeStyle = colors.GREEN_MID;
  ctx.fillStyle = "rgba(47,212,99,0.05)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner dome
  ctx.strokeStyle = colors.DISC_INNER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.55, radius * 0.18, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Center point
  ctx.fillStyle = colors.GREEN_MID;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}
