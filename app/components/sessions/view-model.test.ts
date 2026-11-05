import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { createSessionsViewModel, formatDuration } from "./view-model.ts";

const courseSlug = "putting-course";

const readyInput = {
  enrollmentPending: false,
  isEnrolled: true,
  sessionsLoading: false,
  sessionsError: null,
  courseSlug,
};

function session(overrides = {}) {
  return {
    id: "session-1",
    dayNumber: 1,
    maxDistanceFt: 35,
    durationSeconds: 90,
    createdAt: "2026-10-07T12:00:00Z",
    overall: { made: 30, attempted: 30, percentage: 100 },
    distanceStats: {
      "15": { made: 5, attempted: 5, percentage: 100 },
      "10": { made: 5, attempted: 5, percentage: 100 },
    },
    ...overrides,
  };
}

test("loading wins while enrollment is pending", () => {
  const viewModel = createSessionsViewModel({
    ...readyInput,
    enrollmentPending: true,
    sessions: [session()],
  });

  assert.equal(viewModel.state, "loading");
  assert.equal(viewModel.totalSessionsLabel, null);
});

test("a course or enrollment error wins over pending or unenrolled state", () => {
  for (const enrollmentPending of [true, false]) {
    const viewModel = createSessionsViewModel({
      ...readyInput,
      enrollmentPending,
      isEnrolled: false,
      accessError: new Error("Enrollment check failed"),
    });
    assert.equal(viewModel.state, "loadError");
    assert.equal(viewModel.errorMessage, "Enrollment check failed");
  }
});

test("not-enrolled users get the enroll prompt and no rows", () => {
  const viewModel = createSessionsViewModel({
    ...readyInput,
    isEnrolled: false,
  });

  assert.equal(viewModel.state, "notEnrolled");
  assert.equal(viewModel.courseHref, "/app/courses/putting-course");
  assert.equal(viewModel.rows.length, 0);
});

test("empty state when an enrolled user has no sessions", () => {
  const viewModel = createSessionsViewModel({ ...readyInput, sessions: [] });

  assert.equal(viewModel.state, "empty");
  assert.equal(viewModel.totalSessionsLabel, null);
});

test("loadError surfaces the fetch failure", () => {
  const viewModel = createSessionsViewModel({
    ...readyInput,
    sessionsError: new Error("Failed to fetch game sessions"),
  });

  assert.equal(viewModel.state, "loadError");
  assert.equal(viewModel.errorMessage, "Failed to fetch game sessions");
});

test("ready rows sort newest-first and keep the overall text contract", () => {
  const viewModel = createSessionsViewModel({
    ...readyInput,
    sessions: [
      session({ id: "older", createdAt: "2026-10-01T12:00:00Z", dayNumber: 1 }),
      session({
        id: "newer",
        createdAt: "2026-10-07T12:00:00Z",
        dayNumber: 2,
        overall: { made: 27, attempted: 30, percentage: 90 },
      }),
    ],
  });

  assert.equal(viewModel.state, "ready");
  assert.equal(viewModel.totalSessionsLabel, "Total Sessions: 2");
  assert.deepEqual(
    viewModel.rows.map((row) => row.id),
    ["newer", "older"],
  );
  assert.equal(viewModel.rows[0].heading, "Day 2");
  assert.equal(viewModel.rows[0].overallLabel, "27/30(90%)");
});

test("distance rows sort ascending by feet", () => {
  const viewModel = createSessionsViewModel({
    ...readyInput,
    sessions: [session()],
  });

  assert.deepEqual(
    viewModel.rows[0].distanceRows.map((row) => row.feetLabel),
    ["10ft", "15ft"],
  );
});

test("duration formatting stays minute/second", () => {
  assert.equal(formatDuration(60), "1m 0s");
  assert.equal(formatDuration(65), "1m 5s");
  assert.equal(formatDuration(undefined), "—");
});

test("a session without a day number still renders", () => {
  const viewModel = createSessionsViewModel({
    ...readyInput,
    sessions: [session({ dayNumber: null })],
  });

  assert.equal(viewModel.rows[0].heading, "Session");
});
