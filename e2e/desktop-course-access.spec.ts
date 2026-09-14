import { expect, test } from "@playwright/test";

import { openWithTheme, sidebar } from "./helpers";

test.describe("desktop Course access", () => {
  test("unenrolled account stays in the app and opens the access sheet", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick holds the unpaid/unenrolled account",
    );

    await openWithTheme(page, "/app/dashboard", "light");

    const courseLink = sidebar(page).getByRole("link", {
      name: "Course",
      exact: true,
    });
    await expect(courseLink).toHaveAttribute(
      "data-access",
      "enrollment-required",
    );
    await courseLink.click();

    const accessSheet = page.getByRole("dialog", { name: "Putting Course" });
    await expect(page).toHaveURL(/\/app\/dashboard$/);
    await expect(accessSheet).toBeVisible();
    await expect(
      accessSheet.getByRole("button", { name: "Stay Here" }),
    ).toBeVisible();
    await expect(
      accessSheet.getByRole("link", { name: "View Course" }),
    ).toBeVisible();
  });

  test("clears the desktop access sheet when resizing through mobile", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick holds the unpaid/unenrolled account",
    );

    await openWithTheme(page, "/app/dashboard", "light");

    const courseLink = sidebar(page).getByRole("link", {
      name: "Course",
      exact: true,
    });
    await expect(courseLink).toHaveAttribute(
      "data-access",
      "enrollment-required",
    );
    await courseLink.click();

    const accessSheet = page.getByRole("dialog", { name: "Putting Course" });
    await expect(accessSheet).toBeVisible();

    await page.setViewportSize({ width: 735, height: 900 });
    await expect(accessSheet).toBeHidden();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(accessSheet).toBeHidden();
  });
});
