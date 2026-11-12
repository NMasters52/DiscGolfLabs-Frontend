# Masters Disc Golf — Frontend

Entry point for AI-assisted work on this repo. Concise by design — it points into `docs/` instead of duplicating detail.

## Git

Do not create a PR, push code, or commit code without my explicit instructions. If you want to commit, push, or make a PR ask first before doing so.

## What this is

A data-driven disc golf **putting improvement** platform: interactive training games, performance analytics, and an adaptive course system. This is the **frontend**; the durable backend lives in `DiscGolfLabs-api`.

## Stack

- **React Router v7** (7.12.0, file-based routing) on **React 19** + **TypeScript 5.9**
- **Vite 7** — dev / build / serve
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives) + `tw-animate-css`
- **TanStack Query v5** for server state; React Router loaders/actions for route data
- **Clerk** (`@clerk/react-router`) for auth
- **Embla** (carousel), **lucide-react** (icons), **next-themes** (dark mode)

## Commands

```bash
npm run dev        # react-router dev — dev server
npm run build      # react-router build
npm run start      # serve the production build
npm run typecheck  # react-router typegen && tsc
```

## Local development servers

Before starting a dev server, check whether the expected port already has a listener with `ss -ltnp '( sport = :5173 or sport = :8000 )'` and reuse the existing server when appropriate. Start servers only when the user requests them or when needed to verify requested work; do not start them automatically for read-only or documentation tasks. Frontend: run `npm run dev` from `DiscGolfLabs-Frontend`; it binds to `127.0.0.1:5173` with strict port selection. Backend: run `npm run dev` from sibling `DiscGolfLabs-api`; it binds to `127.0.0.1:8000`. With the Mac connected to the same Tailscale network, open `https://masters.tailf8caf3.ts.net:10443`; this uses the existing Tailscale Serve mapping, and the frontend `/api` proxy forwards requests to the backend. Do not stop existing servers without a reason.

## Layout

see docs/architecture.md for detail

## Browser QA

For feature QA, read and apply `.agents/skills/dgl-qa/SKILL.md`. This is the repository's permanent QA workflow: maintain E2E coverage, run free and paid flows, investigate with Playwright CLI, and prove fixes with failing then passing regressions. Playwright MCP is a secondary browser tool for deeper investigation.

Before running browser-based QA on an issue, read docs/browser-qa-protocol.md and follow it — evidence standards, accounts, and issue-sync rules live there.

For local authenticated browser work, open the dedicated Linux account with `./scripts/dgl-browser.sh free` or `./scripts/dgl-browser.sh paid`. Continue CLI commands through that wrapper (for example, `./scripts/dgl-browser.sh paid snapshot`). The account state files are local credentials under ignored `playwright/.auth/` and must not be printed or committed.

Note: TypeScript-first, but some modules (game logic, queries, api handlers) are still `.js/.jsx`.
