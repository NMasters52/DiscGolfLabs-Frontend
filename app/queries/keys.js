export const queryKeys = {
  user: {
    me: () => ["user", "me"],
  },
  enrollment: {
    check: (courseId) => ["enrollment", "check", courseId],
  },
  course: {
    all: () => ["course", "all"],
    bySlug: (slug) => ["course", slug],
  },
  gameSession: {
    bySlug: (gameSlug, courseId) => ["game-sessions", gameSlug, courseId],
  },
};
