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
