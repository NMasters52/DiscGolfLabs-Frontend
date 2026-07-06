# Feature: Methodology Page Redesign

> Status: Active — V3 Protocol shipped; 4 refinements queued (see handoff below)
> Repo: frontend
> Branch: `feature/methodologyPage` (off `dev`)
> Created: 2026-07-03 · V3 shipped: 2026-07-03 · Refinements queued: 2026-07-04

## 🧭 NEXT SESSION — Handoff: 4 V3 Protocol refinements — DONE (2026-07-04)

All four refinements landed: blinking terminal cursor, Motion migration (CSS entrances + `useEffect` progress hack removed), 4 distinct card treatments for A/B, and outcome card straddling the spine at `lg:`. Verify below passes. **Awaiting stakeholder card pick** (follow-up).

**Goal:** Four refinements to the shipped V3 Protocol timeline (`Methodology.tsx`): (1) a blinking terminal cursor after "Phases: 4", (2) migrate CSS entrance animations to the `motion` library and drop the `useEffect`-driven progress bar, (3) simplify the step cards (remove badges + Deliverable line; lean on hierarchy + accent), and (4) make the "outcome" card span the full bottom width, straddling the center spine at desktop widths.

**Repo / state**

- Repo: `DiscGolfLabs-Frontend`. Branch: `feature/methodologyPage` (off `dev`). V3 is committed and live at `/methodology`.
- `motion` / `framer-motion` are **not yet installed** — animation today is CSS-only (`m-rise` / `m-fade` / `m-grow-y` in `app/app.css`, used **only** by `Methodology.tsx`).
- 4-pillar content lives in `app/components/landing/methodology/data.ts`. Each `Pillar` has: `id, index, code, icon, title, tagline, description, practice, metricLabel, metricValue, tags`. Note `metricLabel`/`metricValue` exist but are **currently unused** by V3.
- Tailwind v4, CSS-first (`@theme inline` in `app/app.css`). No custom breakpoints → defaults: `sm 640 / md 768 / lg 1024 / xl 1280`.

### Decisions locked (2026-07-04, with stakeholder)

1. **Cursor → CSS keyframe** (not Motion, not Tailwind animate). Cheapest on mobile (zero JS/bundle, compositor-driven), authentic hard on/off terminal blink, and matches the "keep ambient/continuous effects in CSS" rule from edit 2.
2. **Cards → 4 distinct treatments, one per pillar** — A/B test, pick a winner (same pattern as V1/V2/V3). Winner gets applied to all four cards in a follow-up; losers deleted.
3. **`variants.ts` lives at `app/lib/motion/variants.ts`** so it is reusable app-wide (`MotionConfig` is added at the root, not just for this page).
4. **Outcome straddle uses `lg:` (1024px)**, not an arbitrary `min-[1020px]:`. The timeline grid is already `lg:`-based; mixing in a 1020 cutoff would break the 1020–1024px band. 4px is imperceptible. *(Override only if exactly-1020 is truly required — would need to also retarget the whole timeline grid to `min-[1020px]:`.)*

### Edit 1 — Blinking terminal cursor (CSS)

In `Methodology.tsx`, after `<span>Phases: 4</span>` add `<span aria-hidden className="terminal-cursor" />`.

In `app/app.css` add:

```css
@keyframes blink { 0%, 50% { opacity: 1 } 50.01%, 100% { opacity: 0 } }
.terminal-cursor {
  display: inline-block; width: 0.6ch; height: 1em; margin-left: 0.25ch;
  background: var(--primary); transform: translateY(0.12em);
  animation: blink 1.05s steps(1, end) infinite;
}
```

`steps(1,end)` = crisp on/off. Add `.terminal-cursor` to the reduced-motion guard (freeze visible).

### Edit 2 — Motion migration (replaces CSS entrances + the `useEffect`)

- `npm install motion` → `import { motion, MotionConfig } from "motion/react"`.
- **New** `app/lib/motion/variants.ts` — plain `Variants` objects (no component code):
  - `fadeUp`: `opacity 0 + y 16` → `opacity 1 + y 0`, `easeOut`, `duration ~0.45`
  - `fadeIn`: `opacity 0` → `opacity 1`
  - `staggerContainer`: `staggerChildren: 0.1`
- `app/root.tsx`: wrap `<main>` inside `ClerkThemeWrapper` with `<MotionConfig reducedMotion="user">`.
- `Methodology.tsx`:
  - Delete `const rise = …` and the `useState`/`useEffect` progress hack.
  - Header trio → `motion` elements driven by `staggerContainer` + `fadeUp`.
  - Progress block → replace `<Progress value={progress}/>` with a `motion.div` track+fill: `initial={{ width: "0%" }} whileInView={{ width: "100%" }} transition={{ duration: 1, ease: "easeOut" }}`. **No state, no effect.**
  - Step `<li>` cards + spine → `whileInView` + `fadeUp` / scaleY reveal (`viewport={{ once: true, margin: "-80px" }}`).
  - CTA button → `whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}`.
- `app/app.css`: **delete** `m-rise` / `m-fade` / `m-grow-y` `@keyframes` + utilities + their `prefers-reduced-motion` block (grep confirms only `Methodology.tsx` used them). **Keep** the new `blink` / `.terminal-cursor`.

**Scope guard:** apply Motion **only** to methodology entrance/reveal/CTA + the root `MotionConfig`. Do **not** retrofit `features.tsx` / `hero.tsx` / mobile menu / modals, and do **not** put decorative atmospherics on Motion.

### Edit 3 — Simplified cards, 4 treatments (one per pillar)

Remove from **every** card: the `Badge` tags cluster and the "Deliverable —" `practice` line. Then render four distinct styles so the user can pick a winner:

| Pillar | Style | Focal element | Data used |
|---|---|---|---|
| **p01 Foundations** | Metric stat | Oversized accent-colored `metricValue` ("06") + `metricLabel` ("Form factors") | existing `metricValue` / `metricLabel` |
| **p02 Data Feedback** | Inline bold highlights | `description` with key phrases bolded in `foreground` / `accent` | **new** optional `highlights?: string[]` on `Pillar` |
| **p03 Tournament Translation** | Pure typography | No stat, no bold — tightened hierarchy (phase eyebrow → title → italic primary tagline → muted body) | existing fields only |
| **p04 The Why** | Tenets list | `tags` as a clean vertical accent list (`▸` / `Check` markers), **not** pill badges | existing `tags` |

Only data change: add optional `highlights?: string[]` to the `Pillar` interface in `data.ts` and populate for p02. Everything else reuses existing fields.

### Edit 4 — Outcome card straddles the spine (`lg:`)

In `Methodology.tsx`, keep the outcome as the last `<li>` in the `<ol>`, but change it from `lg:col-start-2 lg:ml-12` (right-side) to **`lg:col-span-2`**. It now spans both columns = full width, centered, with the spine (`lg:left-1/2`) running through its middle and the existing centered node marker sitting on top. Mobile (`<lg`) stays a normal `pl-14` stacked card. Grid-native — no negative margins or absolute hacks.

### Files to change

- `app/components/landing/methodology/Methodology.tsx` — edits 1, 2, 3, 4
- `app/components/landing/methodology/data.ts` — add optional `highlights?: string[]` (edit 3, p02)
- `app/lib/motion/variants.ts` — **new** (edit 2)
- `app/root.tsx` — `<MotionConfig reducedMotion="user">` around `<main>` (edit 2)
- `app/app.css` — add `blink` / `.terminal-cursor` (edit 1); delete `m-rise` / `m-fade` / `m-grow-y` + reduced-motion block (edit 2)
- `package.json` — `motion` dependency (edit 2)

### Verify

```bash
npm run build      # expect exit 0
npm run typecheck  # 0 new errors (67 pre-existing TS7016 baseline unchanged)
grep -rn "m-rise\|m-fade\|m-grow-y" app/   # expect NO matches after migration
```

- Visual: dark + light; mobile + desktop.
- Cursor blinks, and freezes (visible) under `prefers-reduced-motion`.
- Four card treatments render distinctly so they can be A/B compared.
- Outcome card straddles the spine at ≥1024px; stacks normally below `lg`.

### Gotchas (don't relearn these)

- **Relative imports only** in `.jsx` route files (`~` alias doesn't resolve from `.jsx` in this Vite setup). New `.ts`/`.tsx` files may use either, but match landing convention (`../../`).
- **Tailwind v4:** gradients are `bg-linear-to-b`, not `bg-gradient-to-b`.
- **`lg:` = 1024px** chosen over the requested 1020 to stay coherent with the existing timeline grid (see decision 4).
- **Baseline typecheck noise:** 67 TS7016 errors from untyped `.jsx`/`.js` modules exist on `dev` already — not from this work. Don't fix them here.
- **Motion is scoped to methodology only** this session — do not expand to other components.

### Handoff (after this lands)

- Stakeholder picks one card treatment; delete the other three and apply the winner to all four pillars. Re-QA dark/light + mobile/desktop.
- Update this file: trim Files Changed to the final set, move Status → Completed.

---

## ✅ PREVIOUS — Handoff: ship V3 Protocol (remove V1 & V2) — DONE

**Goal:** Three methodology-page variations were built and are switchable on `/methodology` via `?v=1|2|3`. **V3 Protocol was chosen.** Remove V1 & V2, strip the switcher, rename the winner `MethodologyProtocol.tsx` → `Methodology.tsx`, then commit + open a PR into `dev`.

**Repo / state**

- Repo: `DiscGolfLabs-Frontend`. Branch: `feature/methodologyPage` (off `dev`). All methodology work is commited.
- The 4-pillar content lives in `app/components/landing/methodology/data.ts` — **keep as-is**.
- V3 is the **timeline** design (`MethodologyProtocol.tsx`).

**Current files in `app/components/landing/methodology/`**

- `data.ts` — shared content + types (KEEP)
- `MethodologyEditorial.tsx` — V1 (DELETE)
- `MethodologyCardGrid.tsx` — V2 (DELETE)
- `MethodologyProtocol.tsx` — V3, the winner (KEEP → RENAME to `Methodology.tsx`)
- `index.ts` — barrel (UPDATE)

### Execution steps

**1. Delete the two losers**

```bash
rm app/components/landing/methodology/MethodologyEditorial.tsx
rm app/components/landing/methodology/MethodologyCardGrid.tsx
```

**2. Rename the winner + update its export**

```bash
git mv app/components/landing/methodology/MethodologyProtocol.tsx app/components/landing/methodology/Methodology.tsx
```

In `Methodology.tsx`, rename the export: `export function MethodologyProtocol()` → `export function Methodology()`. (Leave the `/** V3 — Protocol … */` comment.)

**3. Simplify the route** — `app/routes/_landing/methodology.jsx` — replace the entire file with:

```jsx
import { Methodology } from "../../components/landing/methodology";

export default function MethodologyPage() {
  return <Methodology />;
}
```

(Route function is named `MethodologyPage` to avoid colliding with the imported `Methodology` component. Keep the file `.jsx` — do **not** touch `routes.ts`.)

**4. Update the barrel** — `app/components/landing/methodology/index.ts` — replace its contents with:

```ts
export { Methodology } from "./Methodology";
export { pillars, methodologyMeta } from "./data";
export type { Pillar } from "./data";
```

**5. Revert `app/components/landing/index.ts`** — delete the methodology re-export block that was added (`export { MethodologyEditorial, MethodologyCardGrid, MethodologyProtocol } from "./methodology";`). The route imports directly from the methodology barrel, so this re-export isn't needed; the file should end at the original `export { GeometricArt } from "./geometric-art";`.

**6. Prune unused CSS** — `app/app.css` — in the "Methodology page — motion utilities" block, delete the `m-grow-x` and `m-drift` `@keyframes` + their `.m-grow-x` / `.m-drift` utility lines, and drop them from the reduced-motion list. **Keep** `m-rise`, `m-fade`, `m-grow-y` (all used by V3). Final guard:

```css
@media (prefers-reduced-motion: reduce) {
  .m-rise,
  .m-fade,
  .m-grow-y {
    animation: none;
  }
}
```

### Verify

```bash
npm run build      # expect exit 0
npm run typecheck  # 0 errors in methodology files (67 pre-existing TS7016 baseline errors are unrelated)
grep -rn "MethodologyEditorial\|MethodologyCardGrid\|MethodologyProtocol" app/   # expect NO matches
```

### Gotchas (don't relearn these)

- **Relative imports only** in these files (`../../ui/...`, `../../../lib/utils`) — the `~` alias does **not** resolve from `.jsx` files in this Vite setup.
- **Tailwind v4:** gradients are `bg-linear-to-b`, not `bg-gradient-to-b`.
- **Motion is CSS-only** (no Motion/Framer installed). Keep the `m-*` utilities.
- **Baseline typecheck noise:** 67 TS7016 errors from untyped `.jsx` routes / `.js` queries exist on `dev` already — not from this work. Don't fix them in this task.

### Finish

- Update this feature file: trim Files Changed to the final set, mark QA, move Status → Completed.
- Commit on `feature/methodologyPage` and open a PR into `dev`.

## Summary

Replace the placeholder `/methodology` page (`<div>Methodology page</div>`) with a real, on-brand methodology page that explains the Disc Golf Labs training philosophy. Deliver **3 distinct design variations** using the existing shadcn/ui components and landing styling so we can pick one to ship.

## Why

The page is a 1-line stub but is linked from the navbar and footer — real visitors hit a dead-end that undermines credibility. A strong methodology page sells the "why" (Foundations → Data Feedback → Tournament Translation → Self-diagnosis) and is core to conversion.

## Relevant Context

- `CLAUDE.md`, `docs/frontend-patterns.md`
- `app/routes/_landing/methodology.jsx` — current stub
- `app/components/landing/features.tsx` — reference pattern (section rhythm, glass cards, mono eyebrow, cyan glow, "Lab 00n" labels)
- `app/app.css` — theme tokens (primary cyan `#6deaf9`/`#0891b2`, accent green, glassmorphism)
- `app/routes/_landing/_layout.jsx` — page is already wrapped in Navbar/Footer; only section content needed
- shadcn primitives available: `card, badge, button, carousel, separator, progress, tooltip` + `cn()`

## Requirements / Acceptance Criteria

- [ ] Lives at `/methodology` (existing route — no router change)
- [ ] 3 distinct, fully-built variations, switchable in dev for comparison
- [ ] Uses existing shadcn primitives + established tokens/patterns (no new design system)
- [ ] On-brand: mono eyebrows, cyan primary, glassmorphism, lucide icons, token-driven (dark/light safe)
- [ ] Covers the 4 pillars (reuse/expand copy from `features.tsx` / hero)
- [ ] Responsive (mobile + desktop); `npm run typecheck` passes

## Likely Files to Change

- `app/routes/_landing/methodology.jsx` — rewrite (route component + variation switcher)
- `app/components/landing/methodology/` — 3 variation components + `index.ts` barrel
- `app/components/landing/index.ts` — exports

## Plan

1. Extract methodology copy (4 pillars + intro/CTA) into a shared data module.
2. Build 3 distinct layouts:
   - **V1 Editorial** — long-form narrative, typography-led, minimal cards
   - **V2 Card grid** — glassmorphism cards + icon tiles (parallel to Features)
   - **V3 Timeline** — vertical stepper of the player journey (Progress/Separator)
3. Wire a simple variation switcher on the route so all 3 are viewable in dev.
4. QA, pick a winner (decisions log), strip the switcher (follow-up).

## Decisions Log

- 2026-07-03 — Deliver 3 variations before committing to one.
- 2026-07-03 — **V3 Protocol chosen** as the winner. V1 Editorial & V2 Specimen to be removed; winner renamed `MethodologyProtocol.tsx` → `Methodology.tsx`. (See the "🧭 NEXT SESSION" handoff plan at the top of this file.)
- 2026-07-03 — Kept route as `.jsx` (avoids changing `routes.ts`); new variation components are `.tsx`.
- 2026-07-03 — Relative imports (not `~` alias) in new files — matches landing convention and avoids a `.jsx` alias-resolution failure in the Vite build.
- 2026-07-03 — CSS-only animation (no Motion/Framer — not installed). Added `m-*` keyframes to `app/app.css` with a `prefers-reduced-motion` guard.
- 2026-07-03 — `bg-gradient-to-b` → `bg-linear-to-b` (Tailwind v4 rename) so the timeline spine gradient renders.
- 2026-07-04 — Queued 4 V3 refinements (cursor, Motion migration, card simplification, outcome straddle). See the "🧭 NEXT SESSION" handoff at the top. Locked: cursor = CSS keyframe; 4 card treatments for A/B; `variants.ts` at `app/lib/motion/`; outcome straddle on `lg:` (1024) not 1020.
- 2026-07-04 — **Stakeholder A/B feedback applied.** Dropped the p01 "metric stat" treatment; the four cards are now a mix of the other three: **p01 + p04 → bullet list** (`tags` as green-`Check` accent list), **p02 → inline highlights** (`highlights[]` bolded), **p03 → pure typography** (no bullets/bold). Green used more sparingly on letters: p02 highlights are now `text-foreground` bold (no green); green remains only on the bullet `Check` **icons** and the cursor. Outcome card reworked — narrowed to `lg:max-w-xl` (≈2/3 width, was full `lg:col-span-2`) and the check-circle node hoisted **above** the card (`lg:static`, in-flow via `lg:flex-col`) so it "hovers above" instead of overlapping the top; mobile unchanged. Progress header stacks on mobile (`flex-col` → `sm:flex-row`) so `Phases: 4` drops below `Protocol //`. **Cursor recolored green** via `app/app.css` (`.terminal-cursor { background: var(--accent) }`) — done in CSS, not JSX, because the cursor's entire appearance is owned by the `.terminal-cursor` class (the JSX span carries no color of its own) and that's also where the `prefers-reduced-motion` freeze guard lives, so it applies to the green cursor automatically. Card hover made more noticeable: `hover:-translate-y-1 hover:border-primary/50 hover:bg-card/70 hover:shadow-lg` (was `hover:border-primary/30` only). Build exit 0; typecheck unchanged at 67-error baseline.

## QA

- [x] `npm run build` passes (exit 0)
- [x] `npm run typecheck`: 0 errors in new files (67 pre-existing TS7016 errors from untyped `.jsx`/`.js` modules are baseline, not from this change — total stays at 67)
- [x] `grep -rn "MethodologyEditorial\|MethodologyCardGrid\|MethodologyProtocol" app/` → no matches
- [ ] Dark + light correct (token-driven — pending visual check)
- [ ] Mobile + desktop responsive (pending visual check)
- [x] Navbar/Footer unchanged (route renders inside existing `_layout`)

## Files Changed

- `app/routes/_landing/methodology.jsx` — renders `<Methodology />` (switcher removed)
- `app/components/landing/methodology/data.ts` — 4-pillar content + types
- `app/components/landing/methodology/Methodology.tsx` — V3 Protocol timeline (renamed from `MethodologyProtocol.tsx`)
- `app/components/landing/methodology/index.ts` — barrel (`Methodology` + data exports)
- `app/app.css` — motion utilities kept: `m-rise`, `m-fade`, `m-grow-y` (reduced-motion guarded; `m-grow-x`/`m-drift` pruned)
- Deleted: `MethodologyEditorial.tsx` (V1), `MethodologyCardGrid.tsx` (V2)
- No net change: `app/components/landing/index.ts` (methodology re-export reverted)

## Follow-ups / Remaining

- ~~Choose winner; remove switcher + losers.~~ ✅ Done — V3 Protocol shipped.
- **Execute the 4 V3 refinements** (cursor, Motion, cards, outcome straddle) — see the "🧭 NEXT SESSION" handoff at the top.
- After card A/B: pick one treatment, delete the other three, apply winner to all four pillars.
- Confirm final copy with stakeholder.
- Cross-link from Features/Hero/CTA.
- Visual QA: dark/light + mobile/desktop sign-off.
