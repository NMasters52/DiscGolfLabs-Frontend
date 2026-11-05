/**
 * The reorganized lesson day page (course → learn → day).
 *
 * Companion to the lesson redesign: the page is a three-card composition
 * (lesson header, practice, progress) in the CourseHomeView design
 * language, with day chips for in-page navigation and a completion control
 * that mirrors the API's exact-match guard — only the current day can
 * complete, done days grey out and offer the next day. Full session
 * history lives on the Sessions page; the progress card shows the
 * latest-session snapshot and links there.
 *
 * Everything here runs on the paid project only: the learn layout gates on
 * enrollment, and the paid account holds the enrolled state (mirroring
 * courses-flow.spec.ts and core-flows.spec.ts). Enrollment and session
 * reads are intercepted so the shared paid account's progress is untouched.
 */
import { expect, test, type Page } from "@playwright/test";

import { openWithTheme, settle } from "./helpers";

const DAY_1_PATH = "/app/courses/putting-course/learn/day/1";
const DAY_2_PATH = "/app/courses/putting-course/learn/day/2";

/** All learn routes authorize enrollment, so paid is the project here. */
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "paid", "the learn layout is enrolled");
});

// Dev-mode double-invoked effects can leave an extra intercepted check in
// flight at test end; ignore those stragglers instead of failing the run.
test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: "ignoreErrors" });
});

const SESSION_FIXTURE = [
  {
    id: "lesson-day-fixture",
    dayNumber: 1,
    maxDistanceFt: 35,
    durationSeconds: 60,
    createdAt: "2026-10-07T12:00:00Z",
    overall: { made: 30, attempted: 30, percentage: 100 },
    distanceStats: Object.fromEntries(
      [10, 15, 20, 25, 30, 35].map((distance) => [
        distance,
        { made: 5, attempted: 5, percentage: 100 },
      ]),
    ),
  },
];

/**
 * Pin the enrollment the redirect gate and day chips read, so tests are
 * independent of the shared paid account's live progress (same control as
 * the future-day redirect spec).
 */
async function pinEnrollment(
  page: Page,
  currentDay: () => number,
  totalDays = 5,
) {
  await page.route("**/api/enrollments/check/*", async (route) => {
    const response = await route.fetch();
    const enrollment = (await response.json()) as {
      enrolled: boolean;
      currentDay: number;
      totalDays: number;
    };
    expect(enrollment.enrolled).toBe(true);
    await route.fulfill({
      response,
      json: { ...enrollment, currentDay: currentDay(), totalDays },
    });
  });
}

function mockSessions(page: Page) {
  return page.route("**/api/games/putting-course/sessions?*", (route) =>
    route.fulfill({ json: SESSION_FIXTURE }),
  );
}

test.describe("lesson day composition", () => {
  test("day 1 renders header, day chips, practice game, and progress summary", async ({
    page,
  }) => {
    await pinEnrollment(page, () => 1);
    await mockSessions(page);
    await openWithTheme(page, DAY_1_PATH, "light");

    // Contract: h1 "Day 1: …", lesson copy, and the three-card layout.
    const header = page.locator('[data-state="lesson-header"]');
    await expect(header).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Day 1:/ }),
    ).toBeVisible();
    await expect(header.locator('[data-slot="card-description"]')).not.toBeEmpty();

    // Sidebar day navigation: day 1 is the current step; the rest are locked.
    const navDays = page.locator('[data-state="nav-days"]');
    await expect(navDays).toBeVisible();
    await expect(
      navDays.locator('[aria-current="page"]'),
    ).toHaveText("Day 1");
    await expect(navDays.locator('[data-state="locked"]')).toHaveCount(4);
    await expect(navDays.locator('[data-state="completed"]')).toHaveCount(0);
    await expect(navDays.locator('[data-state="current"] svg.lucide-circle-dashed')).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Complete Day", exact: true }),
    ).toBeEnabled();

    // Practice card: the ladder game with its make/miss controls.
    await expect(
      page.getByRole("heading", { name: "Putting ladder" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Make/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Miss/ })).toBeVisible();
    await expect(
      page.getByText("Current Distance:", { exact: true }),
    ).toBeVisible();

    // Progress card: latest-session snapshot linking to the sessions page.
    await expect(
      page.getByRole("heading", { name: "Your Putting Progress" }),
    ).toBeVisible();
    await expect(page.getByText("Latest session")).toBeVisible();
    await expect(page.getByText(/Overall:.*30\/30/)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /View all sessions/i }),
    ).toHaveAttribute("href", "/app/sessions");

    // The full session history (and its counter) moved off this page.
    await expect(page.getByText(/Total Sessions/)).toHaveCount(0);
  });
});

test.describe("complete day", () => {
  test("switching lesson days resets practice for sidebar and Continue navigation", async ({ page }) => {
    await pinEnrollment(page, () => 6);
    await mockSessions(page);
    await openWithTheme(page, DAY_1_PATH, "light");
    for (let putt = 0; putt < 7; putt++) {
      await page.getByRole("button", { name: /Make/ }).click();
    }
    await expect(page.getByTestId("current-distance-value")).toHaveText("15ft");
    await expect(page.getByTestId("putts-remaining-value")).toHaveText("3");
    await page.locator('[data-state="nav-days"]').getByRole("link", { name: "Day 2 (completed)", exact: true }).click();
    await expect(page).toHaveURL(/\/day\/2$/);
    await expect(page.getByTestId("current-distance-value")).toHaveText("10ft");
    await expect(page.getByTestId("putts-remaining-value")).toHaveText("5");
    await page.goBack();
    await expect(page).toHaveURL(/\/day\/1$/);
    await expect(page.getByTestId("putts-remaining-value")).toHaveText("5");
    await page.getByRole("button", { name: /Make/ }).click();
    await page.getByRole("link", { name: "Continue to Day 2", exact: true }).click();
    await expect(page.getByTestId("putts-remaining-value")).toHaveText("5");

    // Capture the save without changing the shared development account.
    const saves: { dayNumber: number; totalPutts: number; madeByDistance: Record<string, { made: number; attempted: number }> }[] = [];
    await page.route("**/api/games/putting-course/session", route => {
      saves.push(route.request().postDataJSON());
      return route.fulfill({ status: 201, json: { id: "day-switch-regression" } });
    });
    page.on("dialog", dialog => dialog.accept());
    for (let putt = 0; putt < 30; putt++) {
      await page.getByRole("button", { name: /Make/ }).click();
    }
    await expect.poll(() => saves.length).toBe(1);
    expect(saves[0].dayNumber).toBe(2);
    expect(saves[0].totalPutts).toBe(30);
    expect(Object.values(saves[0].madeByDistance)).toEqual(
      Array.from({ length: 6 }, () => ({ made: 5, attempted: 5 })),
    );
  });

  test("completing the current day greys out the control and offers the next day", async ({
    page,
  }) => {
    // useCompleteDay → PATCH /api/{courseId}/complete-day with { day }.
    // Intercepted so the shared paid account's progress is untouched; the
    // enrollment check flips to currentDay 2 only after the PATCH lands,
    // which is exactly what the real invalidation refetch would see.
    const completions: { day: number; method: string }[] = [];
    await page.route("**/api/*/complete-day", async (route) => {
      const request = route.request();
      completions.push({
        day: (JSON.parse(request.postData() ?? "{}") as { day?: number }).day ?? -1,
        method: request.method(),
      });
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await pinEnrollment(page, () => (completions.length > 0 ? 2 : 1));
    await mockSessions(page);

    await openWithTheme(page, DAY_1_PATH, "light");

    const completeButton = page.getByRole("button", {
      name: "Complete Day",
      exact: true,
    });
    await expect(completeButton).toBeEnabled();
    await completeButton.click();

    await expect
      .poll(() => completions, { message: "completion request recorded" })
      .toHaveLength(1);
    expect(completions[0]).toEqual({ day: 1, method: "PATCH" });

    // Done days grey out instead of staying clickable, and the forward CTA
    // appears. No error alert renders.
    await expect(
      page.getByRole("button", { name: "Completed ✓" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Complete Day", exact: true }),
    ).toHaveCount(0);
    const continueLink = page.getByRole("link", { name: "Continue to Day 2" });
    await expect(continueLink).toBeVisible();
    await expect(continueLink).toHaveAttribute("href", DAY_2_PATH);
    await expect(page.locator('[data-state="completeError"]')).toHaveCount(0);

    // The sidebar's day list flips with the enrollment: day 1 ✓, day 2 current.
    const navDays = page.locator('[data-state="nav-days"]');
    await expect(navDays.locator('[data-state="completed"]')).toContainText("Day 1");
    await expect(navDays.locator('[data-state="completed"] svg.lucide-check')).toBeVisible();
    await expect(navDays.locator('[data-state="current"] svg.lucide-circle-dashed')).toBeVisible();
    await expect(
      navDays.locator('[data-state="current"]'),
    ).toHaveText("Day 2");
  });

  test("Complete Day and Make operate from the keyboard", async ({ page }) => {
    // Same interception as above: the Enter keypress must reach the same
    // mutation a click would.
    const completions: unknown[] = [];
    await page.route("**/api/*/complete-day", async (route) => {
      completions.push(route.request().postData());
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await pinEnrollment(page, () => 1);
    await mockSessions(page);

    await openWithTheme(page, DAY_1_PATH, "light");

    const completeButton = page.getByRole("button", {
      name: "Complete Day",
      exact: true,
    });
    await completeButton.focus();
    await expect(completeButton).toBeFocused();
    await page.keyboard.press("Enter");
    await expect
      .poll(() => completions, { message: "keyboard-activated completion" })
      .toHaveLength(1);

    // One Make from the keyboard consumes a putt (5 → 4), proving the game
    // control is keyboard-activatable without finishing the round.
    const makeButton = page.getByRole("button", { name: /Make/ });
    await makeButton.focus();
    await expect(makeButton).toBeFocused();
    await page.keyboard.press("Space");
    await expect(page.getByTestId("putts-remaining-value")).toHaveText("4");
  });
});

test.describe("finished course", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`day row styles render rounded hover and selected states in ${theme}`, async ({ page }, testInfo) => {
      await pinEnrollment(page, () => 3);
      await mockSessions(page);
      await openWithTheme(page, DAY_1_PATH, theme);
      const nav = page.locator('[data-state="nav-days"]');
      const selected = nav.locator('[aria-current="page"]');
      const unlocked = nav.locator('[data-state="current"]');
      const locked = nav.locator('[data-state="locked"]').first();
      const styles = async (row: typeof selected) => row.evaluate((el) => {
        const style = getComputedStyle(el);
        return { radius: style.borderRadius, background: style.backgroundColor, cursor: style.cursor,
          width: el.getBoundingClientRect().width, parentWidth: el.parentElement!.getBoundingClientRect().width };
      });
      const activeStyle = await styles(selected);
      expect(parseFloat(activeStyle.radius)).toBeGreaterThanOrEqual(8);
      expect(activeStyle.background).not.toBe("rgba(0, 0, 0, 0)");
      expect(activeStyle.width).toBeCloseTo(activeStyle.parentWidth, 0);
      const resting = await styles(unlocked);
      await unlocked.hover();
      await expect.poll(async () => (await styles(unlocked)).background).not.toBe(resting.background);
      expect(parseFloat((await styles(unlocked)).radius)).toBeGreaterThanOrEqual(8);
      const lockedRest = await styles(locked);
      await locked.hover();
      await expect.poll(async () => (await styles(locked)).background).not.toBe(lockedRest.background);
      expect((await styles(locked)).cursor).toBe("not-allowed");
      expect(parseFloat((await styles(locked)).radius)).toBeGreaterThanOrEqual(8);
      await selected.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(selected).toBeFocused();
      expect(await selected.evaluate(el => getComputedStyle(el).boxShadow)).not.toBe("none");
      await testInfo.attach("row-styles", { body: JSON.stringify({ activeStyle, unlocked: await styles(unlocked), locked: await styles(locked) }), contentType: "application/json" });
      await page.screenshot({ path: testInfo.outputPath(`sidebar-${theme}-full.png`), fullPage: true });
      await nav.screenshot({ path: testInfo.outputPath(`sidebar-${theme}-rows.png`) });
      await page.goto("/app/courses/putting-course");
      const courseRow = page.locator('a[data-status="completed"]').first();
      await courseRow.hover();
      expect(parseFloat((await styles(courseRow)).radius)).toBeGreaterThanOrEqual(8);
      await courseRow.screenshot({ path: testInfo.outputPath(`course-row-${theme}.png`) });
    });
  }

  test("the viewed day stays selected while reviewing a completed course", async ({ page }) => {
    await pinEnrollment(page, () => 6);
    await mockSessions(page);
    await openWithTheme(page, DAY_1_PATH, "light");
    const nav = page.locator('[data-state="nav-days"]');
    await expect(nav.locator('[aria-current="page"]')).toContainText("Day 1");
    await nav.getByRole("link", { name: "Day 3 (completed)", exact: true }).click();
    await expect(page).toHaveURL(/\/day\/3$/);
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(nav.locator('[aria-current="page"]')).toContainText("Day 3");
    await page.reload();
    await expect(nav.locator('[aria-current="page"]')).toContainText("Day 3");
    await page.goBack();
    await expect(nav.locator('[aria-current="page"]')).toContainText("Day 1");
  });

  test("review selection is separate from progress and locked days stay inert", async ({ page }) => {
    await pinEnrollment(page, () => 3);
    await mockSessions(page);
    await openWithTheme(page, DAY_1_PATH, "light");
    const nav = page.locator('[data-state="nav-days"]');
    await expect(nav.locator('[aria-current="page"]')).toContainText("Day 1");
    await expect(nav.locator('[data-state="current"]')).toContainText("Day 3");
    await expect(nav.locator('[data-state="completed"]')).toHaveCount(2);
    const locked = nav.locator('[data-state="locked"]');
    await expect(locked).toHaveCount(2);
    await expect(locked.first()).toHaveAttribute("aria-disabled", "true");
    await expect(locked.first()).not.toHaveAttribute("href");
    await expect(locked.first().locator('svg.lucide-lock')).toBeVisible();
    await locked.first().click();
    await expect(page).toHaveURL(/\/day\/1$/);
    await page.goto("/app/courses/putting-course/learn/day/5");
    await expect(page).toHaveURL(/\/day\/3$/);
    await expect(nav.locator('[aria-current="page"]')).toContainText("Day 3");
  });

  test("a finished account re-opens day 1 for review without a Complete Day control", async ({
    page,
  }) => {
    // Regression pin for the reported bug: an enrollment past the last day
    // (currentDay > totalDays) could open every day but Complete Day always
    // 400'd. Now done days grey out and every chip stays reviewable.
    await pinEnrollment(page, () => 9);
    await mockSessions(page);

    await openWithTheme(page, DAY_1_PATH, "light");

    await expect(
      page.getByRole("heading", { name: /^Day 1:/ }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Completed ✓" })).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Complete Day", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Continue to Day 2" }),
    ).toBeVisible();
    await expect(page.locator('[data-state="completeError"]')).toHaveCount(0);

    const navDays = page.locator('[data-state="nav-days"]');
    await expect(navDays.locator('[data-state="completed"]')).toHaveCount(5);
    await expect(navDays.locator('[data-state="locked"]')).toHaveCount(0);
  });
});

test.describe("future-day redirect", () => {
  test("a locked day redirects to the current day's URL", async ({ page }) => {
    // Pin the enrollment at day 1 so day 5 is locked regardless of the
    // shared account's live progress (same control as feature-61).
    await pinEnrollment(page, () => 1);

    await page.goto("/app/courses/putting-course/learn/day/5");
    await settle(page);

    await expect(page).toHaveURL(/\/app\/courses\/putting-course\/learn\/day\/1$/);
    await expect(
      page.getByRole("heading", { name: /^Day 1:/ }),
    ).toBeVisible();
  });
});

test.describe("compact viewports (intercepted fixture)", () => {
  // Layout-only fixtures, labeled as interception: the fit regression must
  // not depend on the shared account's session history (core-flows owns the
  // persistence proof against the real API).
  async function openWithFixture(page: Page, width: number) {
    await pinEnrollment(page, () => 1);
    await mockSessions(page);
    await page.setViewportSize({ width, height: 700 });
    await page.goto(DAY_1_PATH);
    await expect(
      page.getByRole("heading", { name: "Your Putting Progress" }),
    ).toBeVisible();
  }

  for (const width of [320, 390]) {
    test(`lesson day fits a ${width}px viewport with the progress summary rendered`, async ({
      page,
    }) => {
      await openWithFixture(page, width);

      await expect(page.getByText("Latest session")).toBeVisible();
      await expect(page.getByText(/Overall:.*30\/30/)).toBeVisible();
      await expect(
        page.getByRole("link", { name: /View all sessions/i }),
      ).toBeVisible();

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    });
  }
});
