# State Management

React Query v5 handles all server state. No global client state beyond React hooks and Clerk auth.

---

## Query Keys

Defined in `app/queries/keys.js`:

```js
queryKeys = {
  user: { me: () => ["user", "me"] },
  enrollment: { check: (courseId) => ["enrollment", "check", courseId] },
  course: { all: () => ["course", "all"], bySlug: (slug) => ["course", slug] },
  gameSession: {
    bySlug: (gameSlug, courseId) => ["game-sessions", gameSlug, courseId],
  },
  puttingGame: { stats: () => ["putting-game", "stats"] },
};
```

---

## Query Hooks

### useMe

Fetches current authenticated user.

```js
const { data, isLoading, error } = useMe();
```

**Returns:** User object from `/api/me`

**Auth:** Requires Clerk session token.

---

### useEnrollment(courseId, options?)

Fetches enrollment status for a course.

```js
const { data, isLoading } = useEnrollment(courseId);
```

| Param           | Type    | Required | Default                 | Description |
| --------------- | ------- | -------- | ----------------------- | ----------- |
| courseId        | string  | yes      | MongoDB ObjectId        |
| options.enabled | boolean | no true  | Set to false to disable |

    </section>

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

### useCourses()

Fetches all courses.

```js
const { data, isLoading } = useCourses();
```

**Returns:** Array of course objects

---

### useGameSession(gameSlug, courseId)

Fetches game sessions for a specific game and course.

```js
const { data, isLoading } = useGameSession(gameSlug, courseId);
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

**Returns:** stats object with `distanceBreakdown`, `overallMakeRate`, etc.
**Auth:** Requires Clerk session token.

---

### useCreateGameSession(gameSlug)

Mutation hook for creating a new game session.

```js
const { mutate, isPending, isError } = useCreateGameSession(gameSlug);
```

| Param    | Type   | Required | Description                             |
| -------- | ------ | -------- | --------------------------------------- |
| gameSlug | string | yes      | Game type slug (e.g., "putting-course") |
| courseId | string | yes      | MongoDB ObjectId                        |

````

**Usage:**

```js
mutate({
  gameSlug: "putting-course",
  courseId: "abc123",
  dayNumber: 1,
  putts: [...],
  finalDistance: 25
});
````

**On success:** invalidates `gameSession.bySlug` and `puttingGame.stats` queries.

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

````

### useWaitlist(email)

Mutation hook for waitlist signup.

```js
const { mutate, isPending, isSuccess, error } = useWaitlist(email);
````

**Usage:**

```js
mutate("user@example.com");
`` alert("Email already on waitlist");
    });
  });
});
```
