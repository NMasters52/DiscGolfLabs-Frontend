# Feature: Methodology page card UI

> Status: **Completed**
> Repo: frontend
> Created: 2026-07-10 · Completed: 2026-07-10

## Summary
Reworked the Methodology landing section's pillar + outcome cards for a cleaner, more premium light mode: token-based surfaces, strengthened text hierarchy, consistent card structure, and intentional color — without disrupting the already-strong dark mode.

## Why
The cards read as a generic SaaS exploration: hardcoded slate colors, fake hover-lift on non-clickable cards, weak text hierarchy, and color sprayed everywhere. The app is used outdoors in direct sunlight (see memory: outdoor-sunlight-usage), so contrast and a quiet, readable surface matter. The goal was a polished "Disc Golf Labs training protocol" feel.

## Relevant Context
Read before starting:
- `CLAUDE.md`
- `docs/frontend-patterns.md`
- `app/app.css` — design tokens (light `:root` / dark `.dark`)
- Related: `app/components/landing/methodology/` (Methodology.tsx, PillarCard.tsx, data.ts)

## Requirements / Acceptance Criteria
- [x] Remove fake hover-lift on non-clickable pillar cards
- [x] Replace hardcoded slate colors with design tokens
- [x] Quieter card surface (token border/bg, subtle layered shadow, no backdrop-blur)
- [x] Strengthened text hierarchy (title / body / metadata / highlight tiers)
- [x] All four pillar cards follow one consistent structure
- [x] Color used intentionally (cyan = phase/nodes/progress; green = check/outcome)
- [x] Outcome card reads as a clean finish line, not a green-tinted panel
- [x] No major dark-mode changes beyond card structure/hierarchy

## Likely Files to Change
- `app/components/landing/methodology/PillarCard.tsx` — card surface, hierarchy, structure
- `app/components/landing/methodology/Methodology.tsx` — section surfaces, timeline nodes, outcome card

## Plan
Single presentational `PillarCard` carries the shared structure; `Methodology.tsx` owns the section surfaces (Protocol status bar, timeline rail + nodes, outcome card). All theming flows through tokens defined in `app/app.css`.

## Decisions Log
- 2026-07-10 — Used `text-foreground` for card titles instead of the spec's suggested `text-heading` token; no `text-heading` token exists in `app/app.css`, and `text-foreground` is the established heading color across the app.
- 2026-07-10 — Outcome card uses `bg-card` + `border-accent/35` rather than a green-tinted panel; the optional green top-accent line was skipped to keep the card quiet and let the green node carry the "finish" cue.
- 2026-07-10 — Kept the "Protocol" status bar as an additional card surface using the same card style for visual consistency with the pillar cards.
- 2026-07-10 — Dark mode left intact except for card structure/hierarchy, per the directive that dark mode was already strong.

## QA
- [x] `npm run typecheck` — the `app/components/landing/methodology/` component files (`.tsx`/`.ts`) produce no errors. The run does surface pre-existing repo-wide TS7016 "could not find declaration file" errors for `.jsx`/`.js` route + query modules (e.g. `routes/_landing/methodology.jsx`, `pricing.jsx`, `useWaitlist.js`) — unrelated to this feature and documented in `CLAUDE.md` ("some modules are still .js/.jsx").
- [x] Light-mode visual: clean white cards on off-white, strong headings, muted metadata only
- [x] Dark-mode visual: structure/hierarchy consistent, colors unchanged
- [x] No `slate-*` or hover-lift classes remain on non-clickable cards

## Files Changed
- `app/components/landing/methodology/PillarCard.tsx` — presentational card: removed hover-lift, token-only colors, layered shadow dropped in dark mode (`dark:shadow-none`), consistent phase/title/tagline/description/tags order, accent-tinted tag badges.
- `app/components/landing/methodology/Methodology.tsx` — section rebuilt with token-based card surfaces, strengthened text hierarchy, decorative grid + cyan glow retained, Protocol status bar, timeline rail with cyan nodes, and a clean outcome card (`border-2 border-accent/35 bg-card`) with CTA to `/pricing`.

## Follow-ups / Remaining
- `data.ts` `methodologyMeta.intro` has a typo: "diagnos" → "diagnose".
- `Pillar.practice`, `metricLabel`, and `metricValue` are defined and populated but unused by `PillarCard` — either render a metric/practice strip or remove the dead fields.
- `methodologyMeta.documentId` (`"DGL-METHOD-V1"`) is defined but not rendered anywhere in the section.
