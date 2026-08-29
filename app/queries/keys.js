export const queryKeys = {
  enrollment: {
    check: (courseId) => ["enrollment", "check", courseId],
  },
  course: {
    bySlug: (slug) => ["course", slug],
  },
  gameSession: {
    bySlug: (gameSlug, courseId) => ["game-sessions", gameSlug, courseId],
  },
  puttingGame: {
    stats: () => ["putting-game", "stats"],
  },
};
