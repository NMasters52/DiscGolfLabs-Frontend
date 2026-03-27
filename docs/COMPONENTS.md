# Components

Reusable components in `app/components/`. shadcn/ui primitives in `ui/` are not documented here — see [shadcn/ui docs](https://ui.shadcn.com).

---

## Dashboard Cards

### CourseHeroCard

Displays current course progress with continue CTA.

| Prop       | Type   | Required | Default | Description           |
| ---------- | ------ | -------- | ------- | --------------------- |
| currentDay | number | no       | 1       | Current day in course |
| totalDays  | number | no       | 5       | Total days in course  |

```tsx
<CourseHeroCard currentDay={3} totalDays={5} />
```

---

### CourseCompleteHeroCard

Displays course completion summary with improvement stats. Pulls from `mockUser` data (TODO: connect to real API).

```tsx
<CourseCompleteHeroCard />
```

---

### LastSessionCard

Shows last session summary: max distance, make rate, attempts, date. Uses `mockUser` data.

```tsx
<LastSessionCard />
```

---

### OverallStatsCard

Displays overall make % and personal best distance. Uses `mockUser` data.

```tsx
<OverallStatsCard />
```

---

### FocusInsightCard

Static insight card showing area for improvement. Currently hardcoded.

```tsx
<FocusInsightCard />
```

---

### NewGoalCard

Displays next goal with CTA button. Currently hardcoded.

```tsx
<NewGoalCard />
```

---

### PracticeModeCard

Extra practice mode entry point with "Start Putting Game" button.

```tsx
<PracticeModeCard />
```

---

### SessionProgressChart

Bar chart showing make rate by distance using Recharts.

| Prop  | Type   | Required | Description                        |
| ----- | ------ | -------- | ---------------------------------- |
| stats | object | no       | Contains `distanceBreakdown` array |

```tsx
<SessionProgressChart stats={stats} />
```

`stats.distanceBreakdown` format:

```ts
[{ distance: 15, percentage: 85 }, { distance: 20, percentage: 72 }, ...]
```

---

### EmailSignupSection

Email capture section for course complete flow.

```tsx
<EmailSignupSection />
```

---

## Dashboard Layouts

### LayoutShell

Wrapper component providing consistent dashboard layout structure.

```tsx
<LayoutShell>{children}</LayoutShell>
```

---

### InCourseLayout

Layout for active course progress. Renders course hero, stats, and progress chart.

| Prop       | Type   | Required | Description           |
| ---------- | ------ | -------- | --------------------- |
| stats      | object | no       | Game stats for charts |
| currentDay | number | no       | Current day in course |
| totalDays  | number | no       | Total days in course  |

```tsx
<InCourseLayout stats={stats} currentDay={2} totalDays={5} />
```

---

### CourseCompleteLayout

Layout shown when course is completed.

| Prop       | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| currentDay | number | no       | Final day completed  |
| totalDays  | number | no       | Total days in course |

```tsx
<CourseCompleteLayout currentDay={5} totalDays={5} />
```

---

### AppSidebar

Sidebar navigation for authenticated app.

```tsx
<AppSidebar />
```

---

### DesktopDashboard / MobileDashboard

Responsive dashboard layouts. Render appropriate card layouts for viewport.

```tsx
<DesktopDashboard stats={stats} />
<MobileDashboard stats={stats} />
```

---

## Game Components

### PuttingLadderGame

Interactive putting practice game with make/miss buttons.

| Prop      | Type   | Required | Description                 |
| --------- | ------ | -------- | --------------------------- |
| courseId  | string | yes      | MongoDB ObjectId of course  |
| dayNumber | number | yes      | Current day being practiced |

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

```tsx
<PuttingProgressView gameSlug="putting-course" courseId="abc123" />
```

---

## Landing Components

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
| source    | string  | no       | Tracking source (e.g., "hero") |
| showCount | boolean | no       | Display current waitlist count |

```tsx
<WaitlistForm source="hero" showCount={true} />
```

---

### Features / Stats / CTASection / Footer / Navbar

Standard landing page sections. See `app/components/landing/` for details.

---

## Auth Components

### RequireAuth

Route guard that redirects unauthenticated users.

```tsx
<RequireAuth>
  <ProtectedContent />
</RequireAuth>
```

---

## Theme Components

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
