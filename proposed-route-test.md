# Proposed route tests for issue #46

## Goal

Exercise the real React Router boundaries introduced by issue #46. The tests should prove where each visitor lands and that enrolled course data reaches child routes. They should also prevent the completed-enrollment redirect loop from returning.

## Current narrow coverage

`app/routes/app/courses/learn/redirect.test.ts` now protects the destination decision for active and completed enrollments. It is a useful regression test, but it does not satisfy the full route-coverage criterion because it does not render the authentication boundary, enrollment layout, redirects, or outlet context.

## Recommended harness

Add a focused Vitest setup using:

- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom`

Use `createMemoryRouter` with the production route components. Mock only external boundaries:

- Clerk `useAuth`
- `useCourse`
- `useEnrollment`
- game components and mutation hooks that are unrelated to routing

Assert the router location and rendered destination. Do not test `<Navigate>` by inspecting its props, because that would miss route-tree mistakes and redirect cycles.

## Proposed cases

### Authentication boundary

1. Open `/app/dashboard` while Clerk is loaded and signed out.
2. Expect `/sign-in?redirect_url=%2Fapp%2Fdashboard`.
3. Confirm authenticated page content and `AppShell` are not rendered.

### Enrollment boundary

1. Open `/app/courses/putting-course/learn` while signed in.
2. Return a valid course and `{ enrolled: false }` from the query hooks.
3. Expect `/courses/putting-course`.

### Active enrollment

1. Open `/app/courses/putting-course/learn` with five course days and `currentDay: 2`.
2. Expect `/app/courses/putting-course/learn/day/2`.
3. Render a child probe that reads `useOutletContext()` and assert it receives the same course and enrollment values loaded by the learn layout.

### Completed enrollment regression

1. Open `/app/courses/putting-course/learn` with `totalDays: 5` and `currentDay: 6`.
2. Expect the stable completed-course destination, `/app/dashboard`.
3. Record the visited locations and assert the router never returns to the learn index or attempts `/day/6`.

### Day guard

1. Open an invalid or locked day directly.
2. Expect the canonical learn index.
3. For a permitted day, assert the lesson renders and no redirect occurs.

## Suggested files and command

- `app/routes/app/auth-routing.test.tsx`
- `app/routes/app/courses/learn/learn-routing.test.tsx`
- `vitest.config.ts`
- Package script: `test:routes`

Run route tests separately from `test:dashboard` until the repository has one consolidated test command.

## Exit criteria

- Every case passes from a fresh memory-router instance.
- The completed case cannot exceed a small redirect limit or revisit the learn index.
- Tests use the real route components and outlet context.
- Production build and existing dashboard tests still pass.
- Typecheck cleanup remains separate, as requested.
