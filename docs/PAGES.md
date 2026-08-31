# Pages & Routes

> Status: **reference**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-08-29

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

### `/app`

**File:** `routes/app/_index.jsx`

Protected app entry point. Redirects to dashboard.

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

## Course Learning Routes

### `/courses/learn/_layout.jsx`

**File:** `routes/courses/learn/_layout.jsx`

Pathless parent of `/courses/:slug/learn` and `/courses/:slug/learn/day/:dayNumber` (`routes.ts:17`).
Loads `course` via `useCourse(slug)` and `enrollment` via `useEnrollment(course._id)`, gates access
(redirects to `/courses/:slug` if not signed in or `enrollment.enrolled` is false), and passes
`{ course, enrollment }` to children through `<Outlet context={...} />` — the source of the
outlet-context data the day route consumes.

---

### `/courses/:slug/learn`

**File:** `routes/courses/learn/index.jsx`

Course overview/root. Redirects to current day.

---

### `/courses/:slug/learn/day/:dayNumber`

**File:** `routes/courses/learn/day.jsx`

Individual day content and game. Protected — user must be enrolled and day must be ≤ currentDay.

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

- Invalid day number → `/courses/:slug/learn`
- Day > currentDay → `/courses/:slug/learn`

---

## Checkout Routes

### `/checkout/success`

**File:** `routes/checkout/success.jsx`

Post-payment success page. Shown after successful enrollment purchase.

---

## Route Guards

### `RequireAuth`

**File:** `app/components/require-auth.jsx`

Reusable auth-only wrapper. Checks Clerk's `isSignedIn`; if not authenticated, redirects to `/sign-in?redirect_url=<current path>` so the user returns after signing in. Data-free — it gates on identity only and knows nothing about resources or enrollment.

Used in:

- `/app/*` (via `routes/app/_layout.jsx:6`) — the only consumer.

---

### Learn route guard (inline, not `RequireAuth`)

**File:** `routes/courses/learn/_layout.jsx:15-33`

The `/courses/:slug/learn/*` routes do **not** use `RequireAuth` — they guard inline (behavior documented under the `/courses/learn/_layout.jsx` entry in Course Learning Routes above). The divergence is load-bearing, not an oversight:

1. **Different failure destination.** `RequireAuth` redirects to `/sign-in`; the learn guard redirects to `/courses/:slug` (the public course page). A signed-in-but-not-enrolled user should land on the course page to enroll, not on a sign-in form they don't need.
2. **Authorization, not just authentication.** `RequireAuth` answers "are you logged in?" The learn guard answers "are you logged in **and enrolled in this course**?" Enrollment is per-resource data that must be fetched — a data-free gate can't express it.
3. **The guard owns the data loading anyway.** The layout loads `course` + `enrollment` and passes them to children via `<Outlet context>`; the enrollment check runs against that same fetched data, so wrapping in `RequireAuth` would split one coherent gate into two.

---

## See also

- `architecture.md` — layers & data flow
- `auth.md` — auth wiring
- `COMPONENTS.md` — components rendered by these routes
