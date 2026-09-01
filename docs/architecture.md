# Architecture — Frontend

> Status: **stub** · Part of: `docs/README.md` · Last verified: 2026-08-29

## Why

High-level frontend layers and the request/data flow. Stub — captured from the codebase. Open questions tracked at [Go there](#open-questions-to-document).

## High level

React Router v7 app. `root.tsx` mounts global providers (theme, Clerk, TanStack Query). Routing is file-based, declared in `app/routes.ts`, with the route tree under `app/routes/`.

## Request / data flow

- **Reads:** React Router `loader`s fetch data on navigation; TanStack Query caches server state and refetches in the background.
- **Writes:** React Router `action`s handle mutations; game/UI state via custom hooks (`app/game/puttingLadder/`).
- **Server-side handlers:** `app/api/` resource routes shape/proxy calls to the backend API.

## Layers

| Folder                   | Responsibility                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `app/routes/`            | route components + loaders/actions, split by domain (`_landing`, `app`, `checkout`)                                            |
| `app/components/`        | UI: `landing/`, `app/` (shell + nav), `dashboard/`, `games/`, `ui/` (shadcn) + top-level `mode-toggle.tsx`, `require-auth.jsx` |
| `app/game/`              | game logic + state (e.g. Putting Ladder)                                                                                       |
| `app/queries/`           | TanStack Query hooks                                                                                                           |
| `app/api/`               | server-side resource routes                                                                                                    |
| `app/hooks/`, `app/lib/` | shared hooks + utilities                                                                                                       |

## Structure

```text
app/
├── api/                    # API route handlers (server-side)
│   ├── checkout.js
│   ├── course.js
│   ├── enrollment.js
│   ├── games.js
│   └── waitlist.js
├── components/
│   ├── app/                # Authenticated app shell + navigation
│   │   ├── AppShell.tsx    # The shared shell (rendered by routes/app/_layout.jsx)
│   │   ├── AppSidebar.tsx  # Sidebar nav (rendered by AppShell)
│   │   ├── navigation.ts   # Typed /app destination + page-title config
│   │   └── theme-choice.tsx  # Reusable System/Light/Dark control
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── DashboardView.tsx  # The single responsive dashboard composition
│   │   ├── view-model.ts      # createDashboardViewModel: pure state/derivation seam
│   │   └── view-model.test.ts
│   ├── games/              # Interactive training games
│   │   ├── PuttingLadderGame.jsx
│   │   └── PuttingProgressView.jsx
│   ├── landing/            # Marketing/landing page components
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── stats.tsx
│   │   ├── session-logs.tsx
│   │   ├── cta-section.tsx
│   │   ├── waitlist-form.tsx
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── geometric-art.tsx
│   │   ├── index.ts
│   │   └── methodology/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── mode-toggle.tsx     # Dark/light theme toggle
│   └── require-auth.jsx    # Auth guard wrapper (theme lives in root.tsx's next-themes provider)
├── game/                   # Game logic and state management
│   └── puttingLadder/
│       ├── usePuttingLadderGame.js
│       ├── state.js
│       └── rules.js
├── hooks/                  # Custom React hooks
│   └── use-mobile.ts
├── lib/                    # Utility functions
│   ├── utils.ts
│   └── motion/
│       └── variants.ts
├── queries/                # React Query hooks for data fetching
│   ├── keys.js             # Centralized query-key factory
│   ├── dashboard-options.ts  # Shared query options preset for the dashboard
│   ├── useCourse.js
│   ├── useEnrollment.js
│   ├── useCompleteDay.js
│   ├── useGameSession.js
│   ├── useCreateGameSession.js
│   ├── usePuttingGameStats.js
│   └── useWaitlist.js
├── routes/                 # File-based routing
│   ├── _landing/           # Public landing pages
│   ├── app/                # Authenticated app routes (`/app` = auth boundary + AppShell)
│   │   ├── courses/learn/  # Course learning pages (enrollment-gated)
│   │   ├── dashboard/      # Dashboard implementation
│   │   └── settings/       # Settings (Appearance + Clerk Account/Security, `settings/*` splat)
│   └── checkout/           # Payment flows
└── root.tsx                # Root layout with providers
```

## Open questions to document

- When is a loader used vs a TanStack Query hook for a given read?
- Where does the API base URL / Clerk token wiring live?
- Game-state persistence shape (see `app/game/puttingLadder/`).

## See also

- `PAGES.md` — routes
- `STATE.md` — the data layer
- `frontend-patterns.md` — code style
