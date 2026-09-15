import { expect, test } from "@playwright/test";
import { bottomBar, moreSheet, openMobileWithTheme } from "./helpers";

const viewport = { width: 390, height: 844 };

test("repeated manual dismissals consume their history entries and restore focus", async ({ page }) => {
  await openMobileWithTheme(page, "/app/settings", "light", viewport);
  await bottomBar(page).getByRole("link", { name: "Dashboard" }).click();
  await expect(page).toHaveURL(/\/app\/dashboard$/);

  for (let count = 0; count < 3; count++) {
    await bottomBar(page).getByRole("button", { name: "More" }).click();
    await expect(moreSheet(page)).toBeVisible();
    await moreSheet(page).getByRole("button", { name: "Close", exact: true }).click();
    await expect(page).toHaveURL(/\/app\/dashboard$/);
    await expect(moreSheet(page)).toBeHidden();
    await expect(bottomBar(page).getByRole("button", { name: "More" })).toBeFocused();
  }

  await page.goBack();
  await expect(page).toHaveURL(/\/app\/settings$/);
  await expect(moreSheet(page)).toBeHidden();
});

test("the Settings destination replaces the sheet entry", async ({ page }) => {
  await openMobileWithTheme(page, "/app/dashboard", "light", viewport);
  await bottomBar(page).getByRole("button", { name: "More" }).click();
  await moreSheet(page).getByRole("link", { name: "Account & Settings" }).click();
  await expect(page).toHaveURL(/\/app\/settings$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/app\/dashboard$/);
  await expect(moreSheet(page)).toBeHidden();
});

test("an opened sheet still consumes its entry after reload with encoded URL context", async ({ page }) => {
  await openMobileWithTheme(page, "/app/settings", "light", viewport);
  await page.goto("/app/dashboard?filter=a%20b#saved");
  await expect(bottomBar(page)).toBeVisible();
  await page.evaluate(() => {
    history.replaceState({ ...history.state, usr: { source: "history-test" } }, "");
  });
  await page.reload();
  await expect(bottomBar(page)).toBeVisible();
  const returnURL = page.url();
  expect(new URL(returnURL).searchParams.get("filter")).toBe("a b");
  expect(new URL(returnURL).hash).toBe("#saved");
  await bottomBar(page).getByRole("button", { name: "More" }).click();
  await expect(moreSheet(page)).toBeVisible();
  expect(await page.evaluate(() => history.state.usr.source)).toBe("history-test");

  await page.reload();
  await expect(moreSheet(page)).toBeVisible();
  await moreSheet(page).getByRole("button", { name: "Close", exact: true }).click();
  await expect(moreSheet(page)).toBeHidden();
  await expect(page).toHaveURL(returnURL);
  expect(await page.evaluate(() => history.state.usr)).toEqual({ source: "history-test" });
  await expect(bottomBar(page).getByRole("button", { name: "More" })).toBeFocused();

  await page.goBack();
  await expect(page).toHaveURL(/\/app\/settings$/);
  await expect(moreSheet(page)).toBeHidden();
});

test("a directly loaded sheet dismisses in place and preserves URL context", async ({ page }) => {
  await openMobileWithTheme(page, "/app/dashboard?filter=a%20b&more=1#saved", "light", viewport);
  await expect(moreSheet(page)).toBeVisible();
  const historyLength = await page.evaluate(() => history.length);
  await moreSheet(page).getByRole("button", { name: "Close", exact: true }).click();
  await expect(moreSheet(page)).toBeHidden();
  await expect(page).toHaveURL(/\/app\/dashboard\?filter=a\+b#saved$/);
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  await expect(bottomBar(page).getByRole("button", { name: "More" })).toBeFocused();

  await bottomBar(page).getByRole("button", { name: "More" }).click();
  await expect(moreSheet(page)).toBeVisible();
  await page.goBack();
  await expect(moreSheet(page)).toBeHidden();
  await expect(page).toHaveURL(/\/app\/dashboard\?filter=a\+b#saved$/);
});
