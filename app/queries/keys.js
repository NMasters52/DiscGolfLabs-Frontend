export const queryKeys = {
  enrollment: {
    check: (courseId) => ["enrollment", "check", courseId],
  },
  course: {
    // "detail" keeps a course with the slug "list" from colliding with the
    // index's cache entry.
    bySlug: (slug) => ["course", "detail", slug],
    list: () => ["course", "list"],
  },
  gameSession: {
    bySlug: (gameSlug, courseId) => ["game-sessions", gameSlug, courseId],
  },
  puttingGame: {
    // Called without a day window, stats() returns the shared prefix key:
    // keys are matched by prefix, so invalidating it marks every cached
    // period (7/30/90 days) stale at once.
    stats: (days) => days === undefined
      ? ["putting-game", "stats"]
      : ["putting-game", "stats", days],
  },
};
