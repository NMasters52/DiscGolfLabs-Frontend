# Feature: Methodology Page Redesign

> Status: Completed — V3 Protocol shipped (V1 & V2 removed, switcher stripped)
> Repo: frontend
> Branch: `feature/methodologyPage` (off `dev`)
> Created: 2026-07-03 · Completed: 2026-07-03

## 🧭 NEXT SESSION — Handoff: ship V3 Protocol (remove V1 & V2)

**Goal:** Three methodology-page variations were built and are switchable on `/methodology` via `?v=1|2|3`. **V3 Protocol was chosen.** Remove V1 & V2, strip the switcher, rename the winner `MethodologyProtocol.tsx` → `Methodology.tsx`, then commit + open a PR into `dev`.

**Repo / state**
- Repo: `DiscGolfLabs-Frontend`. Branch: `feature/methodologyPage` (off `dev`). All methodology work is **uncommitted** in the working tree.
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
  .m-rise, .m-fade, .m-grow-y { animation: none; }
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
- Confirm final copy with stakeholder.
- Cross-link from Features/Hero/CTA.
- Visual QA: dark/light + mobile/desktop sign-off.
