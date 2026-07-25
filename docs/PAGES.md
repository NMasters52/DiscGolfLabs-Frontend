# Pages & Routes

File-based routing via React Router v7. Route definitions in `app/routes.ts`.

---

## Landing Routes (Public)

**Layout:** `routes/_landing/_layout.jsx`

Pathless layout that wraps every public marketing route. Renders the global `Navbar` above and `Footer` below an `<Outlet />` for the page content. Defined as the parent route in `routes.ts:4`; children: `/`, `/methodology`, `/about`, `/testimonials`, `/faq`, `/pricing`, `/courses/:slug`.

---

### `/`

**File:** `routes/_landing/index.jsx`

Marketing homepage. Renders Hero, Features, Stats, CTA sections.

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

- `usePuttingGameStats()` — fetches user's putting stats
- `useCourse("putting-course")` — fetches course data
- `useEnrollment(courseId)` — fetches enrollment status

**States:**

- `inCourse` — Active course progress view
- `courseComplete` — Completion celebration view

---

### `/app/test`

**File:** `routes/app/dashboard/testPage.jsx`

Test/debug page for dashboard components.

---

## Course Learning Routes

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

Wraps protected routes. Redirects to `/sign-in` if not authenticated.

Used in:

- `/app/*` routes
- `/courses/:slug/learn/*` routes
