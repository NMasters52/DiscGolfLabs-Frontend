# DiscGolfLabBackground Component

## Quick Reference

```tsx
import DiscGolfLabBackground from "@/components/dashboard/cards/DiscGolfLabBackground";

<Card className="relative overflow-hidden">
  <DiscGolfLabBackground variant="putting" density={16} />

  <div className="relative z-10 p-6">{/* Card content goes here */}</div>
</Card>;
```

## Props / API Reference

| Prop      | Type                                             | Default     | Description                                      |
| --------- | ------------------------------------------------ | ----------- | ------------------------------------------------ |
| `variant` | `'putting' \| 'accuracy' \| 'lab' \| 'training'` | `'putting'` | Theme variant determining icons and accent color |
| `density` | `number`                                         | `14`        | Number of floating icons to render               |

## Required Usage Pattern

### Key Rule

`<DiscGolfLabBackground />` **must be the first child inside the card container.**

The card content must then be placed in a wrapper with **z-index: 1**.

```jsx
<Card className="relative overflow-hidden">
  <DiscGolfLabBackground variant="putting" />

  <div className="relative z-10 p-6">{/* Card content goes here */}</div>
</Card>
```

### Why This Is Required

The background component uses `position: absolute; inset: 0;` to fill the entire card and sit behind the content layer. Placing content in a wrapper with `z-index: 1` ensures:

- Text stays readable
- Buttons remain interactive
- The background remains purely decorative

### Container Requirements

The parent card container must include:

- `position: relative`
- `overflow: hidden`

Example: `<div className="relative overflow-hidden rounded-xl">`

## Variants

### `putting`

- **Purpose**: Putting performance metrics
- **Icons**: Disc, Target
- **Glow Color**: `#22c55e` (green)
- **Use Cases**: C1X accuracy, C2 putting percentage, makes vs attempts

### `accuracy`

- **Purpose**: Aiming and consistency metrics
- **Icons**: Target, Orbit
- **Glow Color**: `#38bdf8` (blue)
- **Use Cases**: Left/right miss percentage, aim precision, dispersion analysis

### `lab`

- **Purpose**: Deep analysis or experimental metrics
- **Icons**: FlaskConical, Beaker, Atom
- **Glow Color**: `#a78bfa` (purple)
- **Use Cases**: Release angle, spin rate, form analysis

### `training`

- **Purpose**: Practice progress and improvement tracking
- **Icons**: Disc, Target, FlaskConical
- **Glow Color**: `#f59e0b` (amber)
- **Use Cases**: Practice sessions, weekly progress, training plans

## Component Implementation

```tsx
import { useMemo } from "react";
import { Disc, Target, FlaskConical, Beaker, Orbit, Atom } from "lucide-react";

const VARIANTS = {
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

export default function DiscGolfLabBackground({
  variant = "putting",
  density = 14,
}) {
  const config = VARIANTS[variant];

  const icons = useMemo(() => {
    return Array.from({ length: density }, (_, i) => {
      const Icon = config.icons[i % config.icons.length];

      return {
        Icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 18 + Math.random() * 14,
        rotate: Math.random() * 30 - 15,
        delay: Math.random() * 20,
      };
    });
  }, [density, config]);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${config.glow}33, transparent 60%)`,
        }}
      />

      {/* Lab Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Floating icons */}
      {icons.map(({ Icon, x, y, size, rotate, delay }, i) => (
        <Icon
          key={i}
          size={size}
          strokeWidth={1.5}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            transform: `rotate(${rotate}deg)`,
            color: config.glow,
            opacity: 0.25,
            animation: "float 18s linear infinite",
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* Edge fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage:
            "radial-gradient(circle at center, black 55%, transparent 100%)",
          background: "black",
        }}
      />

      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        `}
      </style>
    </div>
  );
}
```

## Visual Layers

The component renders four layered visual elements:

### 1. Floating Icon Layer

Icons representing disc golf and training are scattered across the card with variations in:

- Size (18-32px)
- Rotation (-15° to +15°)
- Position (random placement)
- Animation timing (random delays)

### 2. Lab Grid Layer

A faint grid pattern (`42px` squares) sits behind icons, reinforcing the data analysis/training lab visual language.

### 3. Radial Glow

A soft radial gradient creates a gentle light source at the card center (50% horizontal, 40% vertical).

### 4. Edge Fade Mask

A fade mask applies `radial-gradient(circle at center, black 55%, transparent 100%)` so background elements disappear near card edges, preventing visual clutter.

## Design Principles

### Subtlety

Background elements must remain low opacity and should never compete with primary content. Icons use `opacity: 0.25` and the glow uses hex + `33` (20% opacity).

### Readability

All text and interactive elements must remain clearly readable above the background. Content should always have `z-index: 10` or higher.

### Consistency

Variants should be used consistently for similar types of metrics throughout the dashboard. This creates a cohesive visual language.

### Performance

Animations are subtle (`18s` duration) and lightweight using CSS transforms. The component uses `useMemo` to optimize icon generation.

## Icon System

All icons come from **lucide-react** for:

- Lightweight and tree-shakable icons
- Consistent stroke styling (`strokeWidth={1.5}`)
- Clean React integration
- Minimal technical aesthetic matching the dashboard

### Available Icons

- `Disc` - Represents disc golf
- `Target` - Represents accuracy/aiming
- `FlaskConical` - Represents laboratory/experimentation
- `Beaker` - Represents analysis/testing
- `Orbit` - Represents precision/measurement
- `Atom` - Represents technical analysis

## Complete Usage Example

```tsx
import Card from "@/components/ui/card";
import DiscGolfLabBackground from "@/components/dashboard/cards/DiscGolfLabBackground";

export default function AccuracyCard() {
  return (
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="putting" density={16} />

      <div className="relative z-10 p-6">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          C1X Accuracy
        </p>

        <p className="text-4xl font-bold">82%</p>

        <p className="text-green-500 text-sm">+4.3% improvement</p>
      </div>
    </Card>
  );
}
```

## Purpose in the Project

The DiscGolfLabBackground system transforms the dashboard from a basic stats display into a **disc golf performance laboratory**. It supports the vision of a putting analysis environment where players can:

- Analyze their putting performance
- Track improvement over time
- Refine their technique through structured data

By combining lucide-react icons, subtle animation, and lab-style visual language, the component creates an interface that feels like a **training laboratory for improvement** rather than a traditional sports stats dashboard.
