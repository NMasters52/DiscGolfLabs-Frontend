import { expect, test } from "@playwright/test";

import { bottomBar, openMobileWithTheme } from "./helpers";

const VIEWPORT = { width: 390, height: 844 };

for (const request of [
  { name: "course", url: "**/api/courses/putting-course" },
  { name: "enrollment", url: "**/api/enrollments/check/*" },
]) {
  test(`Course recovers from a failed ${request.name} request on Settings`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(60_000);
    let failing = true;
    let failures = 0;
    await page.route(request.url, async (route) => {
      if (failing) {
        failures += 1;
        await route.fulfill({ status: 503, body: "Temporarily unavailable" });
      } else {
        await route.continue();
      }
    });

    await openMobileWithTheme(page, "/app/settings", "light", VIEWPORT);
    const course = bottomBar(page).getByRole("link", { name: "Course" });
    await expect(course).toHaveAttribute("data-access", "error", { timeout: 20_000 });
    expect(failures).toBeGreaterThan(0);
    await course.click();
    const sheet = page.getByRole("dialog", { name: "Putting Course" });
    await expect(sheet.getByText("We couldn't check your course access.", { exact: false })).toBeVisible();
    await expect(page).toHaveURL(/\/app\/settings$/);

    // Dismissal preserves the page and returns focus, even while access failed.
    await sheet.getByRole("button", { name: "Stay Here" }).click();
    await expect(sheet).toBeHidden();
    await expect(course).toBeFocused();
    await course.click();

    // A second outage still offers recovery after the retry finishes.
    await sheet.getByRole("button", { name: "Retry", exact: true }).click();
    await expect(sheet.getByRole("button", { name: "Checking...", exact: true })).toBeDisabled();
    await expect(sheet.getByRole("button", { name: "Retry", exact: true })).toBeEnabled({ timeout: 20_000 });

    failing = false;
    await sheet.getByRole("button", { name: "Retry", exact: true }).click();
    const enrolled = testInfo.project.name === "nicholas";
    await expect(bottomBar(page).locator('a[data-access]')).toHaveAttribute(
      "data-access",
      enrolled ? "enrolled" : "enrollment-required",
      { timeout: 20_000 },
    );
    await expect(page).toHaveURL(/\/app\/settings$/);
    if (enrolled) {
      await expect(sheet).toBeHidden();
      await course.click();
      await expect(page).toHaveURL(/\/app\/courses\/putting-course\/learn\/day\/\d+$/);
    } else {
      await expect(sheet.getByRole("link", { name: "View Course" })).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Retry", exact: true })).toHaveCount(0);
      await sheet.getByRole("button", { name: "Stay Here" }).click();
      await expect(page).toHaveURL(/\/app\/settings$/);
    }
  });
}
