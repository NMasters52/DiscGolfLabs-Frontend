# Pages & Routes

> Status: **reference**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-09-01

## Why

Every route — file, params, data, and guards. File-based via React Router v7; route config in `app/routes.ts`.

---

## Landing Routes (Public)

**Layout:** `routes/_landing/_layout.jsx`

Pathless layout that wraps every public marketing route. Renders the global `Navbar` above and `Footer` below an `<Outlet />` for the page content. Defined as the parent route in `routes.ts:4`; children: `/`, `/methodology`, `/about`, `/testimonials`, `/faq`, `/pricing`, `/courses/:slug`.

---

### `/`

**File:** `routes/_landing/index.jsx`

Marketing homepage. Renders Hero, Features, Stats, SessionLogs, CTA sections.

---

### `/methodology`

**File:** `routes/_landing/methodology.jsx`

Explains the DGL training methodology.

---

### `/about`

**File:** `routes/_landing/about.jsx`

Company/team info page.

---

### `/testimonials`

**File:** `routes/_landing/testimonials.jsx`

User testimonials and reviews.

---

### `/faq`

**File:** `routes/_landing/faq.jsx`

Frequently asked questions.

---

### `/pricing`

**File:** `routes/_landing/pricing.jsx`

Pricing plans and features comparison.

---

### `/courses/:slug`

**File:** `routes/_landing/courses.$slug.jsx`

Public course detail page. Shows course info before enrollment.

| Param | Description                              |
| ----- | ---------------------------------------- |
| slug  | Course URL slug (e.g., "putting-course") |

**Data:** Fetches course via `useCourse(slug)`.

---

## Auth Routes

### `/sign-in`

**File:** `routes/sign-in.jsx`

Clerk sign-in page.

---

### `/sign-up`

**File:** `routes/sign-up.jsx`

Clerk sign-up page.

---

## App Routes (Protected)

Everything under `/app` is the authenticated product boundary: `routes/app/_layout.jsx` authenticates the user and renders the shared `AppShell` (`app/components/app/AppShell.tsx`) around its `<Outlet />`, so every nested page inherits the shell. Nested layouts authorize data access and share it through outlet context.

### `/app`

**File:** `routes/app/_index.jsx`

Authenticated app entry point. Redirects to `/app/dashboard`.

---

### `/app/dashboard`

**File:** `routes/app/dashboard/index.tsx`

Main dashboard after login. Shows course progress, stats, and practice options.

**Data:**

- `useCourse("putting-course")` — fetches course data
- `useEnrollment(courseId)` — fetches enrollment status (gates stats/sessions fetches)
- `usePuttingGameStats()` — fetches user's putting stats
- `useGameSessions("putting-course", courseId)` — fetches sessions for the last-session card

All four run through the shared `dashboardQueryOptions` preset (`app/queries/dashboard-options.ts`), and their results are combined by `createDashboardViewModel` into the rendered state.

**States** (from `createDashboardViewModel`):

- `loading` — any required query still pending (skeletons)
- `loadError` — any required query errored (all-or-nothing retry screen)
- `notEnrolled` — signed in but not enrolled
- `firstSession` — enrolled, no sessions yet
- `inProgress` — course underway
- `completed` — all days done

---

### `/app/settings`

**File:** `routes/app/settings/index.tsx`

Full-screen settings inside the shared shell. Currently minimal — Appearance only (System/Light/Dark via `ThemeChoice`, backed by the single root `next-themes` provider). Account & Security (Clerk `UserProfile` with path routing) lands with the dedicated Settings ticket.

---

## Course Learning Routes

Course learning lives inside the `/app` boundary at `/app/courses/:slug/learn*`. The public course page stays at `/courses/:slug`. The former `/courses/:slug/learn/*` URLs were removed without compatibility redirects — this is a new project, and one canonical route structure is worth more than compatibility routes before the URLs become an established contract.

### `/app/courses/:slug/learn` layout

**File:** `routes/app/courses/learn/_layout.jsx`

Layout route for `/app/courses/:slug/learn` (`routes.ts`). Authentication is already handled by the outer `/app` layout; this layout authorizes enrollment: it loads `course` via `useCourse(slug)` and `enrollment` via `useEnrollment(course._id)`, redirects to `/courses/:slug` when `enrollment.enrolled` is false, and passes `{ course, enrollment }` to children through `<Outlet context={...} />` — the source of the outlet-context data the day route consumes.

---

### `/app/courses/:slug/learn`

**File:** `routes/app/courses/learn/index.jsx`

Course overview/root. Redirects to the current day at `/app/courses/:slug/learn/day/:dayNumber`.

---

### `/app/courses/:slug/learn/day/:dayNumber`

**File:** `routes/app/courses/learn/day.jsx`

Individual day content and game. Enrollment required — day must be ≤ currentDay.

| Param     | Description            |
| --------- | ---------------------- |
| slug      | Course URL slug        |
| dayNumber | Day number (1-indexed) |

**Data from outlet context:**

- `course` — Full course object with `days` array
- `enrollment` — Enrollment with `currentDay`, `totalDays`

**Actions:**

- `completeDay(dayNumber)` — Marks day complete, advances enrollment

**Components:**

- Lesson content (title, description)
- `PuttingLadderGame` — Interactive practice
- `PuttingProgressView` — Session stats

**Redirects:**

- Invalid day number → `/app/courses/:slug/learn`
- Day > currentDay → `/app/courses/:slug/learn`

---

## Checkout Routes

### `/checkout/success`

**File:** `routes/checkout/success.jsx`

Post-payment success page. Shown after successful enrollment purchase.

---

## Route Guards

### `RequireAuth` (authentication)

**File:** `app/components/require-auth.jsx`

Reusable auth-only wrapper. Checks Clerk's `isSignedIn`; if not authenticated, redirects to `/sign-in?redirect_url=<current path>` so the user returns after signing in. Data-free — it gates on identity only and knows nothing about resources or enrollment.

Used in:

- `/app/*` (via `routes/app/_layout.jsx`) — the only consumer.

---

### Learn route guard (enrollment authorization)

**File:** `routes/app/courses/learn/_layout.jsx`

Authentication and enrollment authorization are two layers with different failure destinations, split deliberately across the route hierarchy:

1. **The outer `/app` layout authenticates.** `RequireAuth` sends signed-out visitors from any `/app/*` URL (including `/app/courses/:slug/learn/*`) to `/sign-in?redirect_url=…`.
2. **The nested learn layout authorizes.** It answers "are you logged in **and enrolled in this course**?" and redirects signed-in-but-unenrolled users to `/courses/:slug` (the public course page) so they can enroll, rather than to a sign-in form they don't need. Enrollment is per-resource data that must be fetched — a data-free gate can't express it.
3. **The guard owns the data loading anyway.** The layout loads `course` + `enrollment` and passes them to children via `<Outlet context>`; the enrollment check runs against that same fetched data, so splitting authentication (outer) from authorization (nested) keeps each gate coherent.

---

## See also

- `architecture.md` — layers & data flow
- `auth.md` — auth wiring
- `COMPONENTS.md` — components rendered by these routes
