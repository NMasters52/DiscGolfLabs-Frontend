# Architecture — Frontend

> Status: **stub** — fill in as we build. Captures what's known from the codebase today.

## High level
React Router v7 app. `root.tsx` mounts global providers (theme, Clerk, TanStack Query). Routing is file-based, declared in `app/routes.ts`, with the route tree under `app/routes/`.

## Request / data flow
- **Reads:** React Router `loader`s fetch data on navigation; TanStack Query caches server state and refetches in the background.
- **Writes:** React Router `action`s handle mutations; game/UI state via custom hooks (`app/game/puttingLadder/`).
- **Server-side handlers:** `app/api/` resource routes shape/proxy calls to the backend API.

## Layers
| Folder | Responsibility |
|---|---|
| `app/routes/` | route components + loaders/actions, split by domain (`_landing`, `app`, `courses`, `checkout`) |
| `app/components/` | UI: `landing/`, `dashboard/`, `games/`, `ui/` (shadcn) |
| `app/game/` | game logic + state (e.g. Putting Ladder) |
| `app/queries/` | TanStack Query hooks |
| `app/api/` | server-side resource routes |
| `app/hooks/`, `app/lib/` | shared hooks + utilities |

## Open questions to document
- When is a loader used vs a TanStack Query hook for a given read?
- Where does the API base URL / Clerk token wiring live?
- Game-state persistence shape (see `app/game/puttingLadder/`).
