# Components

> Status: **reference**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-08-29

## Why

Reusable, domain-specific components with props + usage, ordered foundation-first (providers/guards → games → layouts → content). shadcn/ui primitives in `ui/` aren't cataloged here — see [shadcn/ui docs](https://ui.shadcn.com).

---

## App Foundation

Cross-cutting providers and route guards. Wrapped once around the app or individual routes.

### ThemeProvider

Wraps app with `next-themes` for dark/light mode.

```tsx
<ThemeProvider>{children}</ThemeProvider>
```

---

### ModeToggle

Toggle button for switching themes.

```tsx
<ModeToggle />
```

---

### RequireAuth

Route guard that redirects unauthenticated users.

```tsx
<RequireAuth>
  <ProtectedContent />
</RequireAuth>
```

---

## Game Components

Core interactive practice games and their progress views.

### PuttingLadderGame

Interactive putting practice game with make/miss buttons.

| Prop      | Type   | Required | Description                 |
| --------- | ------ | -------- | --------------------------- |
| courseId  | string | yes      | MongoDB ObjectId of course  |
| dayNumber | number | yes      | Current day being practiced |

> Untyped `.jsx` — types reflect runtime usage, not declared/enforced props.

```tsx
<PuttingLadderGame courseId="abc123" dayNumber={1} />
```

Auto-saves session to API on completion via `useCreateGameSession`.

---

### PuttingProgressView

Shows progress visualization for putting game sessions.

| Prop     | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| gameSlug | string | yes      | Slug of the game type      |
| courseId | string | yes      | MongoDB ObjectId of course |

> Untyped `.jsx` — types reflect runtime usage, not declared/enforced props.

```tsx
<PuttingProgressView gameSlug="putting-course" courseId="abc123" />
```

---

## Layouts & Navigation

Structural shells and nav — pages compose content inside these.

### LayoutShell

Wrapper component providing consistent dashboard layout structure.

```tsx
<LayoutShell>{children}</LayoutShell>
```

---

### AppSidebar

Sidebar navigation for authenticated app.

```tsx
<AppSidebar />
```

---

### DashboardView

The single responsive dashboard composition (issue #27): one Command Center layout that
adapts from mobile to desktop. Renders the course summary, the make-rate ring with
per-distance periods, and the last-session card. Cards are internal functions in the
same file driven by the view model — there are no separate card components.

| Prop       | Type                 | Required | Description                                    |
| ---------- | -------------------- | -------- | ---------------------------------------------- |
| viewModel  | `DashboardViewModel` | yes      | Output of `createDashboardViewModel`           |
| onRetry    | `() => void`         | yes      | Refetches errored dashboard queries (or all)   |
| isRetrying | `boolean`            | no       | True while a retry refetch is in flight        |

```tsx
<DashboardView viewModel={viewModel} onRetry={handleRetry} isRetrying={isRetrying} />
```

All dashboard UI states (`loading`, `loadError`, `notEnrolled`, `firstSession`,
`inProgress`, `completed`) derive from `createDashboardViewModel` in
`app/components/dashboard/view-model.ts` — the pure seam covered by
`view-model.test.ts` (`npm run test:dashboard`).

---

## Landing Components

Public marketing page sections.

### Hero

Full-viewport hero section with headline, waitlist form, and video preview.

```tsx
<Hero />
```

---

### WaitlistForm

Email capture form for waitlist.

| Prop      | Type    | Required | Description                    |
| --------- | ------- | -------- | ------------------------------ |
| source    | "hero" \| "cta" \| "footer" | yes      | Signup placement — set by the parent that renders the form (hero/cta/footer) |
| showCount | boolean                      | no (default: true) | Display current waitlist count |

```tsx
<WaitlistForm source="hero" showCount={true} />
```

---

### Features / Stats / CTASection / Footer / Navbar

Standard landing page sections. See `app/components/landing/` for details.

---

## See also

- `STATE.md` — data hooks these components consume
- `PAGES.md` — where components render
- `frontend-patterns.md` — component conventions
