# Card UI Improvement Task

## Goal

Improve the Methodology page cards hieharchy and lightmode color choices, more premium, and easier to read. The dark mode is already strong, so avoid major dark-mode changes besides card structure and hieharchy.

## Design Direction

Use an Apple-inspired light mode:

- Soft off-white page background
- Clean white cards
- Strong heading text
- Normal readable body text
- Muted text only for labels, helper text, and metadata
- Subtle shadows instead of heavy/glowy effects
- Color used intentionally, not everywhere

## Changes to Make

### 1. Remove fake card interaction

The pillar cards currently lift on hover, but they are not clickable.

Remove:

```tsx
hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl
```

Only use hover lift if the whole card becomes a real `Link` or button.

### 2. Replace hardcoded slate colors

Avoid hardcoded light-mode values like:

```tsx
border - slate - 200;
bg - slate - 200;
```

Use design tokens instead:

like in app.css use those tokens only

### 3. Improve the card surface

Use a quieter card style:

```tsx
"rounded-xl border border-border/80 bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none";
```

Remove unnecessary `backdrop-blur-sm` unless the card actually has transparency.

### 4. Strengthen text hierarchy

Use this hierarchy inside each card:

- Card title: `text-heading` or `text-foreground`, `font-semibold`
- Main description: `text-foreground/80`
- Metadata / phase / code: `text-muted-foreground`
- Highlighted phrases: `text-primary`
- Checklist icons: `text-accent`

Do not use `text-muted-foreground` for important explanatory body copy.

### 5. Make all pillar cards follow the same structure

Each card should follow this order:

1. Phase / code
2. Title
3. Optional tagline
4. Description
5. All text aligned to the left

This will make the section feel like a finished product system instead of an A/B design exploration.

### 6. Keep color intentional

Use cyan mainly for:

- Phase labels
- Highlighted phrases
- Timeline node icons
- Progress bar

Use green mainly for:

- Checkmarks
- Outcome state
- Success/completion cues

Avoid cyan borders and glow effects on every card in light mode.

### 7. Improve the outcome card

Make the outcome card feel like the finish line, but keep it clean.

Prefer:

```tsx
bg-card border-accent/35
```

instead of a strong green-tinted panel.

Optionally add a subtle green top accent line instead of filling the whole card with green.

## Success Criteria

The final card UI should feel:

- Cleaner
- More readable outdoors
- More consistent across all four pillar cards
- Less like a generic SaaS card
- More like a polished Disc Golf Labs training protocol
