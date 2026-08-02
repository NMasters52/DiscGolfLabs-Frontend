# Auth — Frontend

> Status: **stub**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-07-29

## Why

How Clerk auth is wired on the frontend and which routes are protected. Stub — a few details still being filled in.

## Wiring

- **Provider:** Clerk via `@clerk/react-router` (themed with `@clerk/themes`).
- Mount `<ClerkProvider>` in `root.tsx`; sign-in / sign-up components live in routes.
- Protected routes are guarded, but by **two different mechanisms** (see `PAGES.md` → Route Guards): `/app/*` wraps in `RequireAuth` (`app/components/require-auth.jsx`, redirects to `/sign-in`); `/courses/:slug/learn/*` uses an inline `useAuth()` + `<Navigate>` guard that also checks enrollment and redirects to the public course page (`/courses/:slug`). The backend verifies the Clerk JWT via `requireAuth` middleware in the API repo.
- The frontend obtains the Clerk JWT and sends it as `Authorization: Bearer <jwt>` to the API.

## To document

- Where the token is read/stored and attached to API calls.
- Which routes are public vs protected.
- Admin detection on the client (if any).

## See also

- `PAGES.md` — Route Guards (the two mechanisms)
- `project-overview.md` — auth as a core capability
