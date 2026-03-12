# Dashboard Architecture Analysis

**Generated:** 2026-03-12  
**Project:** Disc Golf Labs (DGL)  
**Stack:** React Router v7, React Query, Tailwind, shadcn/ui

---

## 1. File Structure

### Dashboard Routes

```
app/routes/app/dashboard/
├── index.tsx                    # Main dashboard route with data fetching
└── testPage.jsx                 # Test page (likely unused)
```

### Dashboard Layout Components

```
app/components/dashboard/
├── LayoutShell.tsx              # Main layout wrapper with sidebar
├── AppSidebar.tsx               # Sidebar navigation
├── InCourseLayout.tsx            # Layout for active course state
├── CourseCompleteLayout.tsx      # Layout for completed course state
├── MobileDashboard.tsx           # Mobile-specific dashboard view
├── DesktopDashboard.tsx          # Desktop-specific dashboard view
└── data.ts                      # Mock data and type definitions
```

### Dashboard Card Components

```
app/components/dashboard/cards/
├── index.ts                     # Barrel export for all cards
├── CourseHeroCard.tsx           # Hero card with progress and CTA
├── LastSessionCard.tsx          # Last session stats (uses mock data)
├── SessionProgressChart.tsx     # Bar chart for make rate by distance
├── MakeRateCard.tsx             # Overall make rate display
├── TotalPuttsCard.tsx           # Total putts made counter
├── StreakCard.tsx               # Current/longest streak display
├── WeakestDistanceCard.tsx      # Weakest distance insight
├── FocusInsightCard.tsx         # AI/personalized insight (hardcoded)
├── PracticeModeCard.tsx         # Extra practice mode CTA
├── CourseCompleteHeroCard.tsx   # Hero card for completed state
├── NewGoalCard.tsx              # New goal setting card
├── OverallStatsCard.tsx         # Overall statistics summary
├── EmailSignupSection.tsx        # Email signup CTA
└── DiscGolfLabBackground.tsx    # Reusable background component
```

### React Query Hooks (used by dashboard)

```
app/queries/
├── usePuttingGameStats.js       # Fetches /api/stats
├── useCourse.js                 # Fetches course by slug
├── useEnrollment.js             # Fetches enrollment status
└── keys.js                      # Query key definitions
```

### API Functions (used by dashboard)

```
app/api/
├── games.js                     # fetchGameSession, fetchPuttingGameStats
├── course.js                    # fetchCourses, fetchCourse
└── enrollment.js                # fetchEnrollment, completeDay
```

---

## 2. Component Hierarchy

```
DashboardRoute (index.tsx)
└─ usePuttingGameStats()
└─ useCourse("putting-course")
└─ useEnrollment(courseId)
└─ LayoutShell
   ├─ AppSidebar
   │  └─ [HARDCODED] streak: 3
   └─ InCourseLayout OR CourseCompleteLayout
      ├─ MobileDashboard
      │  ├─ CourseHeroCard
      │  ├─ LastSessionCard → [MOCK DATA]
      │  ├─ FocusInsightCard → [HARDCODED TEXT]
      │  └─ PracticeModeCard
      └─ DesktopDashboard
         ├─ CourseHeroCard
         ├─ MakeRateCard
         ├─ TotalPuttsCard
         ├─ StreakCard
         ├─ WeakestDistanceCard
         └─ SessionProgressChart
```

---

## 3. Data Flow

### Data Source 1: Putting Game Stats

**Origin:** `usePuttingGameStats()` hook in dashboard/index.tsx  
**API:** `GET /api/stats` via `fetchPuttingGameStats()`  
**Path:**

```
dashboard/index.tsx (usePuttingGameStats)
  ↓ stats prop
InCourseLayout(stats)
  ↓ stats prop
MobileDashboard(stats) OR DesktopDashboard(stats)
  ↓ destructured stats
├─ MakeRateCard(makeRate={stats?.overall?.makeRate})
├─ TotalPuttsCard(totalPuttsMade, sessionCount)
├─ StreakCard(currentStreak, longestStreak)
├─ WeakestDistanceCard(weakestDistanceValue, weakestDistanceRate)
└─ SessionProgressChart(stats)
```

### Data Source 2: Course Information

**Origin:** `useCourse("putting-course")` hook in dashboard/index.tsx  
**API:** `GET /api/courses/putting-course` via `fetchCourse()`  
**Path:**

```
dashboard/index.tsx (useCourse)
  ↓ course._id passed to useEnrollment
  ↓ course object not passed to layouts (unused)
```

### Data Source 3: Enrollment Status

**Origin:** `useEnrollment(courseId)` hook in dashboard/index.tsx  
**API:** `GET /api/enrollments/check/{courseId}` via `fetchEnrollment()`  
**Path:**

```
dashboard/index.tsx (useEnrollment)
  ↓ currentDay, totalDays props
InCourseLayout(currentDay, totalDays)
  ↓ props
MobileDashboard(currentDay, totalDays) OR DesktopDashboard(currentDay, totalDays)
  ↓ props
CourseHeroCard(currentDay, totalDays)
```

### Data Source 4: Mock User Data (PROBLEM)

**Origin:** `data.ts` - `mockUser` export  
**Path:**

```
LastSessionCard → imports mockUser directly (no props)
```

### Data Source 5: Hardcoded Text (INTENTIONAL)

**Origin:** Hardcoded strings in component  
**Path:**

```
FocusInsightCard → "You struggle most at 30ft..." (intentional, will be planned later)
AppSidebar → streak: 3 (being removed)
```

---

## 4. API Endpoints

| Endpoint                                | Hook/Function                                       | Consumer       | Notes                                                         |
| --------------------------------------- | --------------------------------------------------- | -------------- | ------------------------------------------------------------- |
| `GET /api/stats`                        | `usePuttingGameStats()` / `fetchPuttingGameStats()` | DashboardRoute | Returns overall stats, streaks, highlights, distanceBreakdown |
| `GET /api/courses/putting-course`       | `useCourse()` / `fetchCourse()`                     | DashboardRoute | Course metadata (currently unused in layouts)                 |
| `GET /api/enrollments/check/{courseId}` | `useEnrollment()` / `fetchEnrollment()`             | DashboardRoute | Returns currentDay, totalDays, enrollment status              |

---

## 5. Mock / Hardcoded Data

### `app/components/dashboard/data.ts`

```typescript
export const mockUser = {
  streak: 3, // ← Should come from API
  courseProgress: 0.6, // ← Not used
  lastSession: {
    maxDistance: 30,
    makeRate: 0.42,
    attempts: 35,
    date: "Feb 25", // ← Should come from API
  },
  improvement: {
    // ← Not used
    startDistance: 20,
    currentDistance: 30,
  },
  overallMakeRate: 0.58, // ← Duplicates API data
  personalBest: 35, // ← Not used
};

export const mockChartData = [
  // ← Not used (real data from API)
  { session: "Day 1", makeRate: 30 },
  // ...
];
```

### `app/components/dashboard/cards/LastSessionCard.tsx`

- Imports `mockUser` directly
- Renders `mockUser.lastSession` data
- **Problem:** No props interface, cannot receive real data

### `app/components/dashboard/cards/FocusInsightCard.tsx`

```typescript
<p className="text-sm text-muted-foreground">
  You struggle most at 30ft. Focus on consistency at 25ft before
  advancing.
</p>
```

- **Problem:** Hardcoded text that should be dynamic based on stats

### `app/components/dashboard/AppSidebar.tsx`

```typescript
<SidebarFooter>
  <div className="..."> {/* streak display */}
    <Flame className="h-4 w-4 text-[#FE6B36]" />
    <p className="text-sm font-bold text-[#FE6B36]">3</p> {/* ← HARDCODED */}
    <p className="text-sm font-medium text-[#FE6B36]">Day Streak</p>
  </div>
</SidebarFooter>
```

- **Problem:** Hardcoded "3" instead of using stats?.streaks?.currentStreak

---

## 6. Problems

### 6.1 Components Bypass Props Pattern

**Problem:** Some cards fetch/display data independently instead of receiving props

| Component         | Issue                       | Should Be                 |
| ----------------- | --------------------------- | ------------------------- |
| `LastSessionCard` | Imports `mockUser` directly | Accept `lastSession` prop |

**Impact:** Breaks single-source-of-truth principle, difficult to test

---

### 6.2 Inconsistent Data Flow Patterns

**Problem:** Mixed patterns across the codebase

**Good Pattern** (Desktop cards):

```typescript
// Dashboard passes stats down
<MakeRateCard makeRate={makeRate} />
<TotalPuttsCard totalPuttsMade={totalPuttsMade} sessionCount={sessionCount} />
```

**Bad Pattern** (Mobile cards):

```typescript
// Cards import mock data directly
<LastSessionCard />  // ← Imports mockUser internally
```

**Impact:** Developer confusion, inconsistent architecture

---

### 6.3 Dependent Query Loading Delays

**Problem:** Dependent queries create loading gaps

```typescript
// dashboard/index.tsx
const { data: course } = useCourse(COURSE_SLUG);
const { data: enrollment } = useEnrollment(course?._id); // ← Depends on course
```

- `useEnrollment` waits for `course` to load before starting
- Creates cascading loading states (course → enrollment → UI ready)
- Components receive undefined values temporarily

**Impact:** Progress bar shows 0% or "NaN of undefined days" until both queries complete

---

### 6.4 Missing Error Handling

**Problem:** No error states shown to user

- No error boundaries
- No loading indicators
- No retry mechanisms

**Impact:** Poor UX when API fails

---

## 7. Refactor Plan

### Target Architecture Goal

Single data source at route level, all data flows down via props, no component fetches its own data.

---

### 7.1 Ideal Data Flow Diagram

```
app/routes/app/dashboard/index.tsx
│
├─ usePuttingGameStats() → stats
├─ useCourse("putting-course") → course
├─ useEnrollment(courseId) → enrollment
└─ useGameSessions("putting-course", courseId) → sessions
   └─ Extract most recent → lastSession
│
├─ Combine loading/error states
└─ Pass to LayoutShell
│
LayoutShell
│
└─ InCourseLayout / CourseCompleteLayout
   │
   └─ MobileDashboard / DesktopDashboard
      │
      ├─ CourseHeroCard(currentDay, totalDays)
      ├─ LastSessionCard(lastSession)
      ├─ FocusInsightCard → [HARDCODED - keeping as-is]
      ├─ PracticeModeCard()
      ├─ MakeRateCard(makeRate)
      ├─ TotalPuttsCard(totalPuttsMade, sessionCount)
      ├─ StreakCard(currentStreak, longestStreak)
      ├─ WeakestDistanceCard(weakestDistanceValue, weakestDistanceRate)
      └─ SessionProgressChart(stats)
```

---

### 7.2 Step-by-Step Refactor

#### Step 1: Create useGameSessions Hook

**File:** `app/queries/useGameSessions.js` (new)

```typescript
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react-router";
import { fetchGameSession } from "../api/games";
import { queryKeys } from "./keys";

export function useGameSessions(gameSlug, courseId) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.game.sessions(gameSlug, courseId),
    queryFn: async () => {
      const token = await getToken();
      return fetchGameSession(gameSlug, courseId, token);
    },
    enabled: !!gameSlug && !!courseId,
  });
}
```

#### Step 2: Update Dashboard Route

**File:** `app/routes/app/dashboard/index.tsx`

```typescript
// Add useGameSessions hook
const { data: sessions } = useGameSessions("putting-course", course?._id);

// Extract and format most recent session
const lastSession = sessions?.length > 0
  ? {
      maxDistance: sessions[sessions.length - 1].maxDistanceFt,
      makeRate: sessions[sessions.length - 1].overall.percentage / 100,
      attempts: sessions[sessions.length - 1].overall.attempted,
      date: new Date(sessions[sessions.length - 1].createdAt).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      ),
    }
  : null;

// Pass to MobileDashboard
<MobileDashboard state="inCourse" currentDay={currentDay} totalDays={totalDays} lastSession={lastSession} />
```

#### Step 3: Update LastSessionCard

**File:** `app/components/dashboard/cards/LastSessionCard.tsx`

```typescript
interface LastSessionCardProps {
  lastSession?: {
    maxDistance: number;
    makeRate: number;
    attempts: number;
    date: string;
  };
}

export function LastSessionCard({ lastSession }: LastSessionCardProps) {
  // Remove import of mockUser
  if (!lastSession) {
    return (
      <Card className="relative overflow-hidden">
        <DiscGolfLabBackground variant="training" density={6} />
        <div className="relative z-10">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Last Session</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              No recent sessions. Start a putting session to add one!
            </p>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    // Render with lastSession data
    <Card className="relative overflow-hidden">
      <DiscGolfLabBackground variant="training" density={6} />
      <div className="relative z-10">
        <CardContent>
          {/* Display lastSession.maxDistance, makeRate, attempts, date */}
        </CardContent>
      </div>
    </Card>
  );
}
```

#### Step 4: Update MobileDashboard

**File:** `app/components/dashboard/MobileDashboard.tsx`

```typescript
interface MobileDashboardProps {
  state: "inCourse" | "courseComplete";
  currentDay?: number;
  totalDays?: number;
  lastSession?: {
    maxDistance: number;
    makeRate: number;
    attempts: number;
    date: string;
  };
}

export function MobileDashboard({
  state,
  currentDay,
  totalDays,
  lastSession,
}: MobileDashboardProps) {
  return (
    // ...
    {state === "inCourse" && (
      <>
        <CourseHeroCard currentDay={currentDay} totalDays={totalDays} />
        <LastSessionCard lastSession={lastSession} />
        <FocusInsightCard />  {/* No changes - hardcoded stays */}
        <PracticeModeCard />
      </>
    )}
    // ...
  );
}
```

#### Step 5: Remove SidebarFooter

**File:** `app/components/dashboard/AppSidebar.tsx`

```typescript
// Remove entire <SidebarFooter> section
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        {/* ... */}
      </SidebarHeader>
      <SidebarContent>
        {/* ... */}
      </SidebarContent>
      {/* <SidebarFooter> removed */}
      <SidebarRail />
    </Sidebar>
  );
}
```

#### Step 6: Remove All Mock Data

**File:** `app/components/dashboard/data.ts`

```typescript
// Remove all mock data exports
// Keep only type definitions if needed
export type DashboardState = "inCourse" | "courseComplete";
```

#### Step 7: Clean Up Unused Imports

**Files:** All dashboard components

- Verify no remaining imports of `mockUser` or `mockChartData`
- Remove unused imports

#### Step 8: Add Error/Loading States

**File:** `app/routes/app/dashboard/index.tsx`

```typescript
// Combine loading states
const isLoading = statsLoading || courseLoading || enrollmentLoading || sessionsLoading;

// Combine errors
const error = statsError || courseError || enrollmentError || sessionsError;

if (error) {
  return (
    <LayoutShell>
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-destructive mb-2">
          Failed to load dashboard
        </h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    </LayoutShell>
  );
}

if (isLoading) {
  return (
    <LayoutShell>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    </LayoutShell>
  );
}
```

---

### 7.3 Final File Organization

```
app/
├── routes/app/dashboard/
│   └── index.tsx                    # Single source of truth for data
├── components/dashboard/
│   ├── LayoutShell.tsx              # Layout wrapper
│   ├── AppSidebar.tsx               # Navigation (footer removed)
│   ├── InCourseLayout.tsx            # Active course layout
│   ├── CourseCompleteLayout.tsx      # Completed course layout
│   ├── MobileDashboard.tsx           # Mobile view
│   ├── DesktopDashboard.tsx          # Desktop view
│   ├── data.ts                      # Types only (mock data removed)
│   └── cards/
│       ├── index.ts
│       ├── CourseHeroCard.tsx
│       ├── LastSessionCard.tsx       # Accepts lastSession prop
│       ├── FocusInsightCard.tsx      # Hardcoded (no changes)
│       ├── PracticeModeCard.tsx
│       ├── SessionProgressChart.tsx
│       ├── MakeRateCard.tsx
│       ├── TotalPuttsCard.tsx
│       ├── StreakCard.tsx
│       ├── WeakestDistanceCard.tsx
│       ├── CourseCompleteHeroCard.tsx
│       ├── NewGoalCard.tsx
│       ├── OverallStatsCard.tsx
│       ├── EmailSignupSection.tsx
│       └── DiscGolfLabBackground.tsx
├── queries/
│   ├── useGameSessions.js          # ← NEW: Fetch sessions for LastSessionCard
│   ├── usePuttingGameStats.js
│   ├── useCourse.js
│   ├── useEnrollment.js
│   └── keys.js
└── api/
    ├── games.js
    ├── course.js
    └── enrollment.js
```

---

### 7.4 Benefits of Refactor

1. **Single Source of Truth:** All data originates from route level
2. **Consistent Pattern:** All components receive data via props
3. **Testability:** Easy to mock props for testing
4. **Maintainability:** Clear data flow, easy to trace
5. **Performance:** No duplicate API calls
6. **Type Safety:** Full TypeScript coverage
7. **Error Handling:** Centralized error states
8. **Loading States:** Better UX with proper loading indicators

---

## Summary

The dashboard currently has a mixed architecture with some good patterns (props flow from DesktopDashboard to cards) and some anti-patterns (mock data imports). The refactor plan consolidates all data fetching at the route level, ensures all components receive data via props, removes mock data, removes the sidebar footer, and adds proper error/loading states.

**Key Metrics:**

- Current: 2 data sources (API + mock)
- Target: 1 data source (API only)
- Components bypassing props: 1 (LastSessionCard)
- Components with proper props flow: 6 (Desktop cards)
- Mock data locations: 1 file (data.ts)
- Hardcoded values: 1 (FocusInsightCard - intentional, staying as-is)
