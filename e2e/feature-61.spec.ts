import { expect, test, type Page } from "@playwright/test";
import { courseCards, dayRows, openWithTheme, openMobileWithTheme } from "./helpers";

// Real Clerk and API for normal flows; overrides only for explicit failure/state cases.
for (const width of [390, 1440]) {
  test.describe(`Feature 61 at ${width}px`, () => {
    const open = async (page: Page, path: string) => width === 390
      ? openMobileWithTheme(page, path, "light", { width, height: 844 })
      : openWithTheme(page, path, "light");

    for (const slug of ["does-not-exist-qa", "learn"]) {
      test(`unknown slug ${slug} offers a way back without Retry`, async ({ page }) => {
        await open(page, `/app/courses/${slug}`);
        const missing = page.locator('[data-state="notFound"]');
        await expect(missing).toBeVisible();
        await expect(missing.getByRole("button", { name: "Retry" })).toHaveCount(0);
        await missing.getByRole("link").click();
        await expect(page).toHaveURL(/\/app\/courses$/);
        await expect(courseCards(page).first()).toBeVisible();
      });
    }

    test("empty course response renders the empty state", async ({ page }) => {
      await page.route("**/api/courses", route => route.fulfill({ json: [] }));
      await open(page, "/app/courses");
      await expect(page.locator('[data-state="empty"]')).toContainText("No courses yet");
      await expect(courseCards(page)).toHaveCount(0);
    });

    test("course home recovers through Retry after a 503", async ({ page }) => {
      let failing = true;
      await page.route("**/api/courses/putting-course", route => failing
        ? route.fulfill({ status: 503, json: { error: "QA outage" } })
        : route.continue());
      await open(page, "/app/courses/putting-course");
      const error = page.locator('[data-state="loadError"]');
      await expect(error).toBeVisible();
      failing = false;
      await error.getByRole("button", { name: "Retry", exact: true }).click();
      await expect(dayRows(page)).toHaveCount(5);
      await expect(error).toHaveCount(0);
    });

    test("Escape and browser Back dismiss the access sheet and restore card focus", async ({ page }, info) => {
      test.skip(info.project.name !== "free", "Only unenrolled users need the access sheet");
      await open(page, "/app/courses");
      const card = courseCards(page).first();
      await expect(card).toHaveAttribute("data-state", "notEnrolled");
      const sheet = page.getByRole("dialog");
      await card.click();
      await expect(sheet).toBeVisible();
      await expect(page).toHaveURL(/\?course=/);
      await page.keyboard.press("Escape");
      await expect(sheet).toBeHidden();
      await expect(card).toBeFocused();
      await expect(page).toHaveURL(/\/app\/courses$/);
      await card.click();
      await expect(sheet).toBeVisible();
      await page.goBack();
      await expect(sheet).toBeHidden();
      await expect(card).toBeFocused();
      await expect(page).toHaveURL(/\/app\/courses$/);
    });

    test("completed enrollment can re-enter and review every day", async ({ page }, info) => {
      test.skip(info.project.name !== "paid", "Controlled completed state for enrolled account");
      await page.route("**/api/enrollments/check/*", async route => {
        const response = await route.fetch();
        const enrollment = await response.json();
        expect(enrollment.enrolled).toBe(true);
        await route.fulfill({ response, json: { ...enrollment, currentDay: 6, totalDays: 5 } });
      });
      await open(page, "/app/courses/putting-course/learn");
      await expect(page).toHaveURL(/\/app\/courses\/putting-course$/);
      await expect(dayRows(page)).toHaveCount(5);
      for (let index = 0; index < 5; index++) {
        await expect(dayRows(page).nth(index)).toHaveAttribute("data-status", "completed");
      }
      await page.getByRole("link", { name: "Review Day 1" }).click();
      await expect(page.getByRole("heading", { name: /^Day 1:/ })).toBeVisible();
      await page.reload();
      await expect(page.getByRole("button", { name: /Make/ })).toBeVisible();
    });

    test("locked days cannot be opened by a paid account", async ({ page }, info) => {
      test.skip(info.project.name !== "paid", "Controlled new enrollment state");
      await page.route("**/api/enrollments/check/*", async route => {
        const response = await route.fetch();
        const enrollment = await response.json();
        expect(enrollment.enrolled).toBe(true);
        await route.fulfill({ response, json: { ...enrollment, currentDay: 1, totalDays: 5 } });
      });
      await open(page, "/app/courses/putting-course");
      await expect(dayRows(page).nth(0)).toHaveAttribute("data-status", "current");
      for (let index = 1; index < 5; index++) {
        await expect(dayRows(page).nth(index)).toHaveAttribute("data-status", "locked");
        await expect(dayRows(page).nth(index)).not.toHaveAttribute("href");
      }
      await page.goto("/app/courses/putting-course/learn/day/5");
      await expect(page).toHaveURL(/\/learn\/day\/1$/);
      await expect(page.getByRole("heading", { name: /^Day 1:/ })).toBeVisible();
    });

    test("free users cannot open a lesson directly", async ({ page }, info) => {
      test.skip(info.project.name !== "free", "Unenrolled access gate");
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/app/courses/putting-course/learn/day/1");
      await expect(page).toHaveURL(/\/courses\/putting-course$/);
      await expect(page.getByRole("button", { name: /Make/ })).toHaveCount(0);
    });
  });
}
