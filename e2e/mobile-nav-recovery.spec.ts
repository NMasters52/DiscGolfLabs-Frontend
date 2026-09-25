import { expect, test } from "@playwright/test";

import {
  COURSES_INDEX_PATH,
  COURSE_HOME_PATH,
  courseCards,
  openMobileWithTheme,
} from "./helpers";

const VIEWPORT = { width: 390, height: 844 };

test("Courses index recovers from a failed course list request", async ({
  page,
}) => {
  test.setTimeout(60_000);
  let failing = true;
  let failures = 0;
  await page.route("**/api/courses", async (route) => {
    if (failing) {
      failures += 1;
      await route.fulfill({ status: 503, body: "Temporarily unavailable" });
    } else {
      await route.continue();
    }
  });

  await openMobileWithTheme(page, COURSES_INDEX_PATH, "light", VIEWPORT);

  // The whole page degrades to one retryable error card — the list is the
  // query that failed, so the failure is page-level, not per-card.
  await expect(page.locator('[data-state="loadError"]')).toBeVisible({
    timeout: 20_000,
  });
  expect(failures).toBeGreaterThan(0);

  failing = false;
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(courseCards(page).first()).toBeVisible({ timeout: 20_000 });
  await expect(courseCards(page).first()).toHaveAttribute(
    "data-state",
    /notEnrolled|inProgress|completed/,
  );
});

test("a failed enrollment check recovers from the card sheet", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  let failing = true;
  await page.route("**/api/enrollments/check/*", async (route) => {
    if (failing) {
      await route.fulfill({ status: 503, body: "Temporarily unavailable" });
    } else {
      await route.continue();
    }
  });

  await openMobileWithTheme(page, COURSES_INDEX_PATH, "light", VIEWPORT);

  const card = courseCards(page).first();
  await expect(card).toBeVisible();
  // The course list resolved; its enrollment check is what failed, so the
  // card carries the error while the page stays navigable.
  await expect(card).toHaveAttribute("data-state", "error", {
    timeout: 20_000,
  });

  await card.click();
  const sheet = page.getByRole("dialog", {
    name: await card.locator('[data-slot="card-title"]').innerText(),
  });
  await expect(
    sheet.getByText("We couldn't check your course access.", {
      exact: false,
    }),
  ).toBeVisible();

  // Dismissal preserves the page and returns focus, even while the check
  // has failed.
  await sheet.getByRole("button", { name: "Stay Here" }).click();
  await expect(sheet).toBeHidden();
  await expect(card).toBeFocused();

  await card.click();
  // A second outage still offers recovery after the retry finishes.
  const retry = sheet.getByRole("button", { name: "Retry", exact: true });
  await retry.click();
  await expect(retry).toBeDisabled();
  await expect(retry).toBeEnabled({ timeout: 20_000 });

  failing = false;
  await retry.click();

  const enrolled = testInfo.project.name === "nicholas";
  if (enrolled) {
    // Recovery closes the sheet on its own: the live card no longer needs a
    // decision, so focus lands back on it and it navigates normally.
    await expect(sheet).toBeHidden({ timeout: 20_000 });
    await expect(card).toBeFocused();
    await expect(card).toHaveAttribute(
      "data-state",
      /inProgress|completed/,
      { timeout: 20_000 },
    );
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${COURSE_HOME_PATH}$`));
  } else {
    // Recovered as not-enrolled: the sheet switches to the enroll path.
    await expect(
      sheet.getByRole("button", { name: "Retry", exact: true }),
    ).toHaveCount(0);
    await expect(
      sheet.getByRole("link", { name: "View Course" }),
    ).toBeVisible({ timeout: 20_000 });
    await sheet.getByRole("button", { name: "Stay Here" }).click();
    await expect(sheet).toBeHidden();
    await expect(card).toBeFocused();
    await expect(card).toHaveAttribute("data-state", "notEnrolled", {
      timeout: 20_000,
    });
  }
});
