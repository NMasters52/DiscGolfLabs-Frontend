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
    stats: () => ["putting-game", "stats"],
  },
};
