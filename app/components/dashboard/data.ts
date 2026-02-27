export type DashboardState = "inCourse" | "courseComplete";

export const mockUser = {
  streak: 3,
  courseProgress: 0.6,
  lastSession: {
    maxDistance: 30,
    makeRate: 0.42,
    attempts: 35,
    date: "Feb 25",
  },
  improvement: {
    startDistance: 20,
    currentDistance: 30,
  },
  overallMakeRate: 0.58,
  personalBest: 35,
};

export const mockChartData = [
  { session: "Day 1", makeRate: 30 },
  { session: "Day 2", makeRate: 35 },
  { session: "Day 3", makeRate: 42 },
  { session: "Day 4", makeRate: 38 },
  { session: "Day 5", makeRate: 45 },
  { session: "Day 6", makeRate: 48 },
  { session: "Day 7", makeRate: 52 },
];
