# Project Overview — Frontend

> Part of **Disc Golf Labs**. Frontend repo. Pair with the API (`DiscGolfLabs-api`).

## Product
A disc golf **putting improvement** platform. Players get a scientific approach to better putting: root-cause form analysis, data feedback via interactive games, pressure-practice simulators, and adaptive training that evolves with their stats.

Tagline: *Stop guessing. Start improving.*

## Core capabilities
- **Putting Ladder Game** — progressive putting practice that scales distance to performance, with session save/resume.
- **Analytics dashboard** — make rate, distance zones, focus insights, session history, progress charts (mobile + desktop layouts).
- **Course system** — multi-day structured courses with enrollment and completion tracking.
- **Auth & accounts** — Clerk sign-in, protected routes, user profile data.
- **Marketing / onboarding** — landing pages, theming (dark/light), waitlist capture.

## Where this repo fits
This is the client. It renders UI, manages game + UI state (TanStack Query, React Router loaders/actions), and calls the API for persistence. Some server-side handlers also live here under `app/api/` (React Router resource routes); the durable backend is the separate API repo.

## Tech at a glance
React Router v7 · React 19 · TypeScript · Vite · Tailwind v4 · shadcn/ui · TanStack Query v5 · Clerk · Recharts.

See also: `architecture.md`, `frontend-patterns.md`, `routes.md`, `auth.md`.
