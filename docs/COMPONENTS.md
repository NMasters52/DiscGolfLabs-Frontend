# Components

> Status: **reference**  ·  Part of: `docs/README.md`  ·  Last verified: 2026-09-01

## Why

Reusable, domain-specific components with props + usage, ordered foundation-first (providers/guards → games → layouts → content). shadcn/ui primitives in `ui/` aren't cataloged here — see [shadcn/ui docs](https://ui.shadcn.com).

---

## App Foundation

Cross-cutting shell, route guards, and theme controls. Wrapped once around the app or individual routes. Theming has a **single source of truth**: the `next-themes` provider mounted in `app/root.tsx` (`defaultTheme="system"`) — there is no nested theme provider anywhere in the route tree.

### ModeToggle

Toggle button for switching themes in the AppShell header.

```tsx
<ModeToggle />
```

---

### ThemeChoice

Reusable System/Light/Dark selection backed by next-themes' `setTheme`, used by the Settings screen and reusable by future navigation surfaces.

```tsx
<ThemeChoice />
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

### AppShell

The one authenticated application shell for `/app/*` (`app/components/app/AppShell.tsx`). Rendered once by `routes/app/_layout.jsx` around its `<Outlet />` — pages never wrap themselves in a shell. Owns the sidebar layout, the sticky header with a dynamic page title resolved from `app/components/app/navigation.ts`, `ModeToggle`, and `SidebarTrigger`.

```tsx
// routes/app/_layout.jsx
<RequireAuth>
  <AppShell />
</RequireAuth>
```

---

### AppSidebar

Sidebar navigation for authenticated app (`app/components/app/AppSidebar.tsx`), rendered by `AppShell`.

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
