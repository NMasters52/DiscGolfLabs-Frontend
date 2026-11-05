/**
 * The Sessions page (/app/sessions) — the full practice-session history
 * that moved off the lesson day page.
 *
 * Fixture-intercepted so these specs stay independent of the shared paid
 * account's history; core-flows.spec.ts owns the real-API persistence
 * proof. Paid project only: the page gates its query on enrollment.
 */
import { expect, test, type Page } from "@playwright/test";

import { openWithTheme, settle } from "./helpers";

const SESSIONS_PATH = "/app/sessions";
const DAY_1_PATH = "/app/courses/putting-course/learn/day/1";

/** All sessions reads sit behind the app shell, so paid is the project. */
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "paid", "sessions read enrollment");
});

// Dev-mode double-invoked effects can leave an intercepted check in flight
// at test end; ignore stragglers instead of failing the run.
test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: "ignoreErrors" });
});

const SESSIONS_FIXTURE = [
  {
    id: "sessions-fixture-new",
    dayNumber: 2,
    maxDistanceFt: 30,
    durationSeconds: 125,
    createdAt: "2026-10-08T09:00:00Z",
    overall: { made: 27, attempted: 30, percentage: 90 },
    distanceStats: {
      "20": { made: 4, attempted: 5, percentage: 80 },
      "10": { made: 5, attempted: 5, percentage: 100 },
    },
  },
  {
    id: "sessions-fixture-old",
    dayNumber: 1,
    maxDistanceFt: 35,
    durationSeconds: 60,
    createdAt: "2026-10-07T12:00:00Z",
    overall: { made: 30, attempted: 30, percentage: 100 },
    distanceStats: {},
  },
];

function mockEnrollment(page: Page, enrolled: boolean) {
  return page.route("**/api/enrollments/check/*", (route) =>
    route.fulfill({
      json: { enrolled, currentDay: 1, totalDays: 5 },
    }),
  );
}

function mockSessions(page: Page, sessions: typeof SESSIONS_FIXTURE) {
  return page.route("**/api/games/putting-course/sessions?*", (route) =>
    route.fulfill({ json: sessions }),
  );
}

test.describe("sessions page", () => {
  test("lists history newest-first with the total counter", async ({
    page,
  }) => {
    await mockEnrollment(page, true);
    await mockSessions(page, SESSIONS_FIXTURE);
    await openWithTheme(page, SESSIONS_PATH, "light");

    await expect(
      page.getByRole("heading", { name: "Your practice sessions" }),
    ).toBeVisible();
    await expect(
      page.getByText("Total Sessions: 2", { exact: true }),
    ).toBeVisible();

    // The sidebar carries Sessions as a primary destination and marks it
    // active here (first match = the desktop sidebar's link).
    await expect(
      page.getByRole("link", { name: "Sessions" }).first(),
    ).toHaveAttribute("aria-current", "page");

    const history = page.getByRole("list", { name: "Session history" });
    await expect(history.getByRole("listitem")).toHaveCount(2);
    // Newest first: day 2 leads, and its distance rows render ascending.
    await expect(history.getByRole("heading", { name: "Day 2" })).toBeVisible();
    await expect(history.getByText(/Overall:.*27\/30/)).toBeVisible();
    await expect(history.getByText("10ft", { exact: true })).toBeVisible();

    // No horizontal overflow relative to whatever viewport the helper set.
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize()?.width ?? 1280);
  });

  test("the day page's View all sessions link lands here", async ({
    page,
  }) => {
    await mockEnrollment(page, true);
    await mockSessions(page, SESSIONS_FIXTURE);
    await openWithTheme(page, DAY_1_PATH, "light");

    await page
      .getByRole("link", { name: /View all sessions/i })
      .click();
    await expect(page).toHaveURL(SESSIONS_PATH);
    await expect(
      page.getByRole("heading", { name: "Your practice sessions" }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("list", { name: "Session history" })
        .getByRole("listitem"),
    ).toHaveCount(2);
  });

  test("an enrolled account with no sessions sees the empty state", async ({
    page,
  }) => {
    await mockEnrollment(page, true);
    await mockSessions(page, []);
    await openWithTheme(page, SESSIONS_PATH, "light");
    await settle(page);

    await expect(
      page.getByText("No sessions yet. Play your first game!"),
    ).toBeVisible();
    await expect(
      page.getByRole("list", { name: "Session history" }),
    ).toHaveCount(0);
  });

  test("a non-enrolled account gets the enroll prompt, not a fetch", async ({
    page,
  }) => {
    const sessionRequests: string[] = [];
    await mockEnrollment(page, false);
    await page.route("**/api/games/putting-course/sessions?*", (route) => {
      sessionRequests.push(route.request().url());
      return route.fulfill({ json: [] });
    });

    await openWithTheme(page, SESSIONS_PATH, "light");
    await settle(page);

    await expect(
      page.getByText(/Enroll in the putting course/),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Go to the course/i }),
    ).toHaveAttribute("href", "/app/courses/putting-course");
    // The query is gated on enrollment — the sessions endpoint is never hit.
    await expect
      .poll(() => sessionRequests, { message: "no sessions fetch" })
      .toHaveLength(0);
  });
});
