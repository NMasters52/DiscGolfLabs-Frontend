# Auth — Frontend

> Status: **stub**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-09-01

## Why

How Clerk auth is wired on the frontend and which routes are protected. Stub — a few details still being filled in.

## Wiring

- **Provider:** Clerk via `@clerk/react-router` (themed with `@clerk/themes`).
- Mount `<ClerkProvider>` in `root.tsx`; sign-in / sign-up components live in routes.
- `/app/*` is the authenticated product boundary: `routes/app/_layout.jsx` wraps every authenticated route in `RequireAuth` (`app/components/require-auth.jsx`, redirects to `/sign-in?redirect_url=…`). The nested course learning layout (`routes/app/courses/learn/_layout.jsx`) authorizes on top of that boundary — it loads course + enrollment and redirects signed-in-but-unenrolled users to the public course page (`/courses/:slug`). The two layers are split by design (see `PAGES.md` → Route Guards). The backend verifies the Clerk JWT via `requireAuth` middleware in the API repo.
- The frontend obtains the Clerk JWT and sends it as `Authorization: Bearer <jwt>` to the API.

## To document

- Where the token is read/stored and attached to API calls.
- Which routes are public vs protected.
- Admin detection on the client (if any).

## See also

- `PAGES.md` — Route Guards (the two mechanisms)
- `project-overview.md` — auth as a core capability
