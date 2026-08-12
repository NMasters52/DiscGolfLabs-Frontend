# Masters Disc Golf — Frontend

Entry point for AI-assisted work on this repo. Concise by design — it points into `docs/` instead of duplicating detail.

## What this is

A data-driven disc golf **putting improvement** platform: interactive training games, performance analytics, and an adaptive course system. This is the **frontend**; the durable backend lives in `DiscGolfLabs-api`.

## Stack

- **React Router v7** (7.12.0, file-based routing) on **React 19** + **TypeScript 5.9**
- **Vite 7** — dev / build / serve
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives) + `tw-animate-css`
- **TanStack Query v5** for server state; React Router loaders/actions for route data
- **Clerk** (`@clerk/react-router`) for auth
- **Recharts** (charts), **Embla** (carousel), **lucide-react** (icons), **next-themes** (dark mode)

## Commands

```bash
npm run dev        # react-router dev — dev server
npm run build      # react-router build
npm run start      # serve the production build
npm run typecheck  # react-router typegen && tsc
```

## Layout (see docs/architecture.md for detail)

```
app/
  routes.ts            # route config; tree under routes/
  root.tsx             # root layout + providers
  routes/_landing/     # public marketing pages
  routes/app/          # authenticated app (incl. dashboard)
  routes/courses/      # course learning pages
  routes/checkout/     # Stripe checkout flow
  components/{landing,dashboard,games,ui}
  game/puttingLadder/  # game logic + state
  queries/             # TanStack Query hooks
  api/                 # server-side resource routes
  hooks/  lib/
```

Note: TypeScript-first, but some modules (game logic, queries, api handlers) are still `.js/.jsx`.
