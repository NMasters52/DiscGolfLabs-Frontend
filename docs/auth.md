# Auth — Frontend

> Status: **stub**.

- **Provider:** Clerk via `@clerk/react-router` (themed with `@clerk/themes`).
- Mount `<ClerkProvider>` in `root.tsx`; sign-in / sign-up components live in routes.
- Protected routes are guarded (see route layout); the backend verifies the Clerk JWT via `requireAuth` in the API repo.
- The frontend obtains the Clerk JWT and sends it as `Authorization: Bearer <jwt>` to the API.

## To document
- Where the token is read/stored and attached to API calls.
- Which routes are public vs protected.
- Admin detection on the client (if any).
