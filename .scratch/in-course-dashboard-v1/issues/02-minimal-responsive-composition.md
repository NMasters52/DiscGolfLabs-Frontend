Type: prototype
Status: resolved

## Question

What is the smallest responsive card composition that supports the dashboard's primary job: a dynamic course card, course progress, overall make rate, and last-session summary, while keeping the completed card minimal and unactionable?

Blocked by: 01

## Comments

- Prototype added at `/app/test` (authenticated app test route), with shareable variants: `?variant=a`, `?variant=b`, and `?variant=c`.
- A — Command center: hero-first hierarchy with metrics below.
- B — Split focus: strong next-action panel beside supporting context.
- C — Progress journal: one vertical record with progress and session details grouped together.
- Includes a bottom slider, previous/next controls, arrow-key navigation, and in-memory First session / In progress / Completed previews.
- `npm run build` passes. Ticket remains open pending the user's composition choice.

## Answer

Prototype A — **Command center** — is the selected composition. It leads with the dynamic course card, then places the overall make rate and last-session summary beneath it in a responsive two-column arrangement that collapses naturally on smaller screens.

This preserves the dashboard's primary job and keeps the hierarchy stable across viewports. Prototype B's split-focus treatment and Prototype C's journal treatment remain reference material only.

Prototype evidence: local branch `prototype/dashboard-v1-compositions`, with the full A/B/C switcher preserved in `app/routes/app/dashboard/testPage.jsx`.
