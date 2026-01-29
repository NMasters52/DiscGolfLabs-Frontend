export const queryKeys = {
  user: {
    me: () => ["user", "me"],
  },
  enrollment: {
    check: (courseId) => ["enrollment", "check", courseId],
  },
};
