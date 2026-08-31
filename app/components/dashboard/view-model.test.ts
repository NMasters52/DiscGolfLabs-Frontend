import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { createDashboardViewModel } from "./view-model.ts";

const course = {
  _id: "course-1",
  slug: "putting-course",
  title: "Putting Fundamentals",
  totalDays: 5,
};

const enrolled = {
  enrolled: true,
  currentDay: 1,
  totalDays: 5,
};

const stats = {
  overall: { makeRate: 42.5 },
};

test("returns loading while required dashboard data is pending", () => {
  const viewModel = createDashboardViewModel({
    courseLoading: true,
  });

  assert.equal(viewModel.state, "loading");
  assert.equal(viewModel.makeRate, null);
  assert.equal(viewModel.latestSession, null);
});

test("returns firstSession without fake performance values", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: enrolled,
    stats,
    sessions: [],
  });

  assert.equal(viewModel.state, "firstSession");
  assert.equal(viewModel.headline, "Start Day 1");
  assert.equal(viewModel.progress.percent, 0);
  assert.equal(viewModel.makeRate, null);
  assert.equal(viewModel.latestSession, null);
});

test("returns loadError after the request has exhausted its retries", () => {
  const viewModel = createDashboardViewModel({
    courseError: new Error("network unavailable"),
  });

  assert.equal(viewModel.state, "loadError");
  assert.equal(viewModel.headline, "We couldn't load your dashboard");
  assert.ok(viewModel.error instanceof Error);
});

test("keeps successful not-enrolled data distinct from a load failure", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { enrolled: false },
  });

  assert.equal(viewModel.state, "notEnrolled");
  assert.equal(viewModel.headline, "Enroll to start");
  assert.equal(viewModel.error, null);
});

test("normalizes progress and the newest session from oldest-first data", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 3 },
    stats,
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: 8, attempted: 20, percentage: 40 },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "session-2",
        dayNumber: 2,
        overall: { made: 12, attempted: 20, percentage: 60 },
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    ],
  });

  assert.equal(viewModel.state, "inProgress");
  assert.equal(viewModel.progress.completedDays, 2);
  assert.equal(viewModel.progress.percent, 40);
  assert.equal(viewModel.makeRate, 42.5);
  assert.equal(viewModel.latestSession?.id, "session-2");
  assert.equal(viewModel.latestSession?.makeRate, 60);
});

test("returns null when the recent make rate is missing", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 2 },
    stats: { overall: {} },
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: 0, attempted: 20, percentage: 0 },
      },
    ],
  });

  assert.equal(viewModel.state, "inProgress");
  assert.equal(viewModel.makeRate, null);
});

test("preserves a legitimate zero percent recent make rate", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 2 },
    stats: { overall: { makeRate: 0, sessionCount: 12 } },
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: 0, attempted: 20, percentage: 0 },
      },
    ],
  });

  assert.equal(viewModel.makeRate, 0);
  assert.equal(viewModel.makeRateStatus, "zero");
  assert.equal(viewModel.recentSessionCount, 12);
  assert.equal(viewModel.latestSession?.made, 0);
  assert.equal(viewModel.latestSession?.attempted, 20);
  assert.equal(viewModel.latestSession?.makeRate, 0);
});

test("marks an empty recent period as no sessions instead of a fake zero", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 2 },
    stats: { overall: { makeRate: 0, sessionCount: 0 } },
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: 0, attempted: 20, percentage: 0 },
      },
    ],
  });

  assert.equal(viewModel.makeRateStatus, "noRecentSessions");
  assert.equal(viewModel.makeRate, null);
  assert.equal(viewModel.recentSessionCount, 0);
});

test("reports no sessions in the recent period from the session count alone", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 2 },
    stats: { overall: { sessionCount: 0 } },
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: 10, attempted: 20, percentage: 50 },
      },
    ],
  });

  assert.equal(viewModel.makeRateStatus, "noRecentSessions");
  assert.equal(viewModel.makeRate, null);
  assert.equal(viewModel.recentSessionCount, 0);
});

test("treats a malformed recent session count as unknown, not empty", () => {
  for (const sessionCount of ["invalid", -1]) {
    const viewModel = createDashboardViewModel({
      course,
      enrollment: { ...enrolled, currentDay: 2 },
      stats: { overall: { makeRate: 0, sessionCount } },
      sessions: [
        {
          id: "session-1",
          dayNumber: 1,
          overall: { made: 0, attempted: 20, percentage: 0 },
        },
      ],
    });

    assert.equal(viewModel.makeRate, 0);
    assert.equal(viewModel.makeRateStatus, "zero");
    assert.equal(viewModel.recentSessionCount, null);
  }
});

test("reports a populated recent make rate with its normalized session count", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 3 },
    stats: { overall: { makeRate: 42.5, sessionCount: 3 } },
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: 8, attempted: 20, percentage: 40 },
      },
    ],
  });

  assert.equal(viewModel.makeRateStatus, "populated");
  assert.equal(viewModel.makeRate, 42.5);
  assert.equal(viewModel.recentSessionCount, 3);
});

test("keeps the make rate unavailable when the recent period count is unknown", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 2 },
    stats: { overall: {} },
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: 0, attempted: 20, percentage: 0 },
      },
    ],
  });

  assert.equal(viewModel.makeRateStatus, "unavailable");
  assert.equal(viewModel.makeRate, null);
  assert.equal(viewModel.recentSessionCount, null);
});

test("reports the brand-new player make rate status without recent data", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: enrolled,
    stats,
    sessions: [],
  });

  assert.equal(viewModel.makeRateStatus, "firstSession");
  assert.equal(viewModel.makeRate, null);
  assert.equal(viewModel.recentSessionCount, null);
});

test("keeps not-enrolled make rate data unavailable", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { enrolled: false },
  });

  assert.equal(viewModel.makeRateStatus, "unavailable");
  assert.equal(viewModel.recentSessionCount, null);
});

test("rejects zero-like malformed recent make rates", () => {
  for (const makeRate of ["", false, []]) {
    const viewModel = createDashboardViewModel({
      course,
      enrollment: { ...enrolled, currentDay: 2 },
      stats: { overall: { makeRate } },
      sessions: [
        {
          id: "session-1",
          dayNumber: 1,
          overall: { made: 0, attempted: 20, percentage: 0 },
        },
      ],
    });

    assert.equal(viewModel.makeRate, null);
  }
});

test("returns null for invalid recent make-rate values", () => {
  for (const makeRate of [null, "invalid", -1, 101]) {
    const viewModel = createDashboardViewModel({
      course,
      enrollment: { ...enrolled, currentDay: 2 },
      stats: { overall: { makeRate } },
      sessions: [
        {
          id: "session-1",
          dayNumber: 1,
          overall: { made: 10, attempted: 20, percentage: 50 },
        },
      ],
    });

    assert.equal(viewModel.makeRate, null);
  }
});

test("keeps missing latest-session performance unavailable", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 2 },
    stats,
    sessions: [{ id: "session-1", dayNumber: 1, overall: {} }],
  });

  assert.equal(viewModel.latestSession?.made, null);
  assert.equal(viewModel.latestSession?.attempted, null);
  assert.equal(viewModel.latestSession?.makeRate, null);
});

test("keeps malformed latest-session performance unavailable", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 2 },
    stats,
    sessions: [
      {
        id: "session-1",
        dayNumber: 1,
        overall: { made: "invalid", attempted: -1, percentage: 101 },
      },
    ],
  });

  assert.equal(viewModel.latestSession?.made, null);
  assert.equal(viewModel.latestSession?.attempted, null);
  assert.equal(viewModel.latestSession?.makeRate, null);
});

test("clamps completed progress to 100 percent", () => {
  const viewModel = createDashboardViewModel({
    course,
    enrollment: { ...enrolled, currentDay: 6 },
    stats,
    sessions: [],
  });

  assert.equal(viewModel.state, "completed");
  assert.equal(viewModel.progress.percent, 100);
  assert.equal(viewModel.progress.completedDays, 5);
  assert.equal(viewModel.headline, "Course Complete");
});
