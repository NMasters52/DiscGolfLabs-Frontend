# State Management

> Status: **reference** · Part of: `docs/README.md` · Last verified: 2026-08-29

## Why

TanStack Query v5 owns all server state; no global client store beyond React hooks + Clerk. Query keys + every hook below.

---

## Query Keys

Query keys are the **array tuples** TanStack Query uses as cache addresses. In this app they live in one place — `app/queries/keys.js` — and every hook imports them. They exist to be **shared**, not defined inline.

```js
queryKeys = {
  enrollment: { check: (courseId) => ["enrollment", "check", courseId] },
  course: { bySlug: (slug) => ["course", slug] },
  gameSession: {
    bySlug: (gameSlug, courseId) => ["game-sessions", gameSlug, courseId],
  },
  puttingGame: { stats: () => ["putting-game", "stats"] },
};
```

### Why one file, why this shape

A query key is referenced from **two places that don't know about each other**:

1. the **query hook** that registers the cache entry (e.g. `useGameSession` → `queryKeys.gameSession.bySlug(...)`), and
2. the **mutation** that later invalidates it (e.g. `useCreateGameSession` calls `invalidateQueries` with the _same_ key — see [useCreateGameSession.js](../app/queries/useCreateGameSession.js)).

If either side inlined the tuple, a typo or reordered argument would silently break invalidation — the mutation succeeds, the refetch never fires, the UI shows stale data with no error. `keys.js` is the contract that keeps producer and consumer in sync; centralizing it also means a rename catches every call site at once.

- **Nested object** → mirrors the cache hierarchy. Keys are matched by prefix, so `["course", slug]` entries share an ancestor and can be invalidated together via `["course"]`. The nesting makes that grouping visible, and `queryKeys.course.` gives autocomplete instead of a magic string.
- **Factory functions** → the array carries runtime args (`courseId`, `slug`), so it can't be a constant. The no-arg key (`stats`) is a function too, for one consistent access shape: every key is a call, never a property read.

### How to use them

Register a query by importing the key and calling it:

```js
import { queryKeys } from "./keys";

useQuery({ queryKey: queryKeys.enrollment.check(courseId), queryFn: ... });
```

Invalidate from a mutation using the **same** key — this is what ties a write back to the read it affects:

```js
queryClient.invalidateQueries({
  queryKey: queryKeys.gameSession.bySlug(gameSlug, courseId),
});
```

**Rule:** never inline a key array. If you're about to write `["course", slug]` by hand, add it to `keys.js` first, it may already be there.

---

## Query Hooks

### useEnrollment(courseId, options?)

Fetches enrollment status for a course.

```js
const { data, isLoading } = useEnrollment(courseId);
```

| Param           | Type    | Required | Default | Description                        |
| --------------- | ------- | -------- | ------- | ---------------------------------- |
| courseId        | string  | yes      | —       | MongoDB ObjectId of the course     |
| options.enabled | boolean | no       | true    | Set to `false` to disable fetching |

**Returns:** `{ enrolled, currentDay, totalDays, courseId }` or null
`data` is undefined.

**Auth:** Requires Clerk session token.

**Stale time:** 5 minutes

---

### useCourse(slug)

Fetches single course by slug.

```js
const { data, isLoading } = useCourse(slug);
```

| Param | Type   | Required | Description     |
| ----- | ------ | -------- | --------------- |
| slug  | string | yes      | Course URL slug |

**Returns:** Course object with `days` array.

**Enabled:** Only runs when `slug` is truthy.

---

### useGameSessions(gameSlug, courseId)

Fetches game sessions for a specific game and course.

```js
const { data, isLoading } = useGameSessions(gameSlug, courseId);
```

| Param    | Type   | Required | Description                             |
| -------- | ------ | -------- | --------------------------------------- |
| gameSlug | string | yes      | Game type slug (e.g., "putting-course") |
| courseId | string | yes      | MongoDB ObjectId                        |

**Returns:** array of game session objects

---

### usePuttingGameStats()

Fetches aggregate putting game statistics for current user.

```js
const { data, isLoading } = usePuttingGameStats();
```

**Returns:** stats object. The dashboard's view model reads the **nested** envelope — `overall.makeRate`, `overall.sessionCount` (and last-session `overall.made` / `overall.attempted` / `overall.percentage`).
**Auth:** Requires Clerk session token.

> **Open item (gated on backend, API #12):** confirm `GET` stats returns the nested
> `overall` envelope (plus any `streaks` / `highlights` / `comparison` siblings) and
> finish documenting the full response shape here. Earlier revisions of this doc
> described a flat `overallMakeRate` field that no live code reads.

---

### useCreateGameSession(gameSlug)

Mutation hook for creating a new game session.

```js
const { mutate, isPending, isError } = useCreateGameSession(gameSlug);
```

| Param    | Type   | Required | Description                             |
| -------- | ------ | -------- | --------------------------------------- |
| gameSlug | string | yes      | Game type slug (e.g., "putting-course") |

`gameSlug` is the hook/path param; everything else belongs to the request payload.

**Usage:**

```js
mutate({
  gameSlug: "putting-course",
  courseId: "abc123",
  dayNumber: 1,
  putts: [...],
  finalDistance: 25
});
```

**On success:** invalidates `gameSession.bySlug` and `puttingGame.stats` queries.

> **Open item (gated on backend, API #13):** the request payload shape (`courseId`,
> `dayNumber`, `putts`, `finalDistance`, and any required fields) is unconfirmed
> against `DiscGolfLabs-api` — verify before relying on the usage example above.

---

### useCompleteDay(courseId)

Mutation hook for marking a course day as complete

```js
const { mutate, isPending, isError } = useCompleteDay(courseId);
```

| Param    | Type   | Required | Description      |
| -------- | ------ | -------- | ---------------- |
| courseId | string | yes      | MongoDB ObjectId |

**Usage:**

```js
mutate(3); // day number
```

**on success:** invalidates `enrollment.check` query for this course

---

### useJoinWaitlist()

Mutation hook for adding an email to the launch waitlist. Defined in `app/queries/useWaitlist.js`; posts to `/api/waitlist/join` via `joinWaitlist` in `app/api/waitlist.js`. Pre-launch only.

```js
const { mutate, isPending, isError, error, data } = useJoinWaitlist();
```

**Usage:**

```js
mutate({ email: "user@example.com", source: "hero" });
```

| Field  | Type                          | Required               | Description                                                                                                      |
| ------ | ----------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| email  | string                        | yes                    | Signup email                                                                                                     |
| source | `"hero" \| "cta" \| "footer"` | no (default: `"hero"`) | Placement the signup came from (set by the parent that renders `WaitlistForm`); stored per-entry for attribution |

**Returns:** API response — includes `alreadyJoined` (true if the email was already on the list).

**On success:** invalidates `["waitlist", "count"]` so `useWaitlistCount()` refreshes.

---

### useWaitlistCount()

Polls the current waitlist signup count. Defined in `app/queries/useWaitlist.js`; fetches `/api/waitlist/count` via `fetchWaitlistCount` in `app/api/waitlist.js`. Pre-launch only.

```js
const { data } = useWaitlistCount();
```

**Refetch:** every 60s (`refetchInterval: 60000`) — keeps the displayed count fresh.

---

## See also

- `PAGES.md` — where each hook is consumed
- `COMPONENTS.md` — components that read this state
- `ENV.md` — the API base URL the queries call
