# Project Overview — Frontend

> Status: **reference**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-08-29
> Frontend repo for **Disc Golf Labs**. Pair with the API (`DiscGolfLabs-api`).

## Why

What the Disc Golf Labs frontend is, its core capabilities, and where this repo fits. Start here.

## Product

Starting as disc golf **putting improvement** platform. Players get a scientific approach to better their game: root-cause form analysis, data feedback via interactive games, pressure-practice simulators, and adaptive training that evolves with their stats.

Tagline: _Stop guessing. Start improving._

## Core capabilities

- **Putting Ladder Game** — progressive putting practice that scales distance to performance, with session save/resume.
- **Analytics dashboard** — make rate overall and by distance period, last-session summary, and course progress in one responsive composition.
- **Course system** — multi-day structured courses with enrollment and completion tracking.
- **Auth & accounts** — Clerk sign-in, protected routes.
- **Marketing / onboarding** — landing pages, theming (dark/light), waitlist capture.

## Where this repo fits

This is the client. It renders UI, manages game + UI state (TanStack Query, React Router loaders/actions), and calls the API for persistence. Some server-side handlers also live here under `app/api/` (React Router resource routes); the durable backend is the separate API repo.

## Tech at a glance

React Router v7 · React 19 · TypeScript · Vite · Tailwind v4 · shadcn/ui · TanStack Query v5 · Clerk.

## See also

- `architecture.md` — layers & data flow
- `frontend-patterns.md` — code & styling conventions
- `PAGES.md` — routes & guards
- `auth.md` — auth wiring
