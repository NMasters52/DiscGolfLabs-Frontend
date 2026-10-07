import { expect, test, type Page } from "@playwright/test";
import { openWithTheme, dayRows } from "./helpers";

process.loadEnvFile(".env");

const diagnostics = new WeakMap<Page, string[]>();

// Observe real app failures. Clerk's development warning is console.warn, not error.
function observeErrors(page: Page, errors: string[]) {
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", response => {
    if (response.url().includes("/api/") && response.status() >= 400) {
      errors.push(`${response.status()} ${new URL(response.url()).pathname}`);
    }
  });
}

test.beforeEach(async ({ page }, info) => {
  const errors: string[] = [];
  observeErrors(page, errors);
  info.annotations.push({ type: "diagnostics", description: "Console, page exceptions, and API failures checked" });
  diagnostics.set(page, errors);
});
test.afterEach(async ({ page }, info) => {
  const errors = diagnostics.get(page) || [];
  await info.attach("browser-errors", { body: JSON.stringify(errors, null, 2), contentType: "application/json" });
  expect(errors, "Unexpected browser or API errors").toEqual([]);
});

test("anonymous users are sent to sign in before entering the app", async ({ browser, page: fixturePage }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  try {
    const page = await context.newPage();
    observeErrors(page, diagnostics.get(fixturePage)!);
    await page.goto("http://localhost:5173/app/courses");
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.locator('input[name="identifier"]')).toBeVisible();
  } finally { await context.close(); }
});

test("development email authentication reaches the correct user's dashboard", async ({ browser, page: fixturePage }, info) => {
  const tier = info.project.name.toUpperCase();
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  try {
    const page = await context.newPage();
    observeErrors(page, diagnostics.get(fixturePage)!);
    await page.goto("http://localhost:5173/sign-in");
    await page.locator('input[name="identifier"]').fill(process.env[`PLAYWRIGHT_${tier}_EMAIL`]!);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.locator('input[autocomplete="one-time-code"]').pressSequentially(process.env.PLAYWRIGHT_CLERK_TEST_CODE || "424242", { delay: 50 });
    await expect(page).toHaveURL(/\/app\/dashboard/, { timeout: 30_000 });
    await expect(page.getByText(info.project.name === "free" ? "John Doe" : "Jane Doe", { exact: true })).toBeVisible();
    const cookie = (await context.cookies()).find(cookie => cookie.name === "__session")!;
    const payload = JSON.parse(Buffer.from(cookie.value.split(".")[1], "base64url").toString());
    expect(payload.sub).toBe(process.env[`PLAYWRIGHT_${tier}_CLERK_USER_ID`]);
  } finally { await context.close(); }
});

test("dashboard enrollment agrees with course home through reload and round trip", async ({ page }, info) => {
  await openWithTheme(page, "/app/dashboard", "light");
  const summary = page.locator('main [data-state]').first();
  await expect(summary).toHaveAttribute("data-state", info.project.name === "free" ? "notEnrolled" : /firstSession|inProgress|completed/);
  const dashboardState = await summary.getAttribute("data-state");
  await page.reload();
  await expect(summary).toHaveAttribute("data-state", dashboardState!);
  await page.goto("/app/courses/putting-course");
  await expect(dayRows(page)).toHaveCount(5);
  await expect(page.locator('main [data-state]').first()).toHaveAttribute("data-state", info.project.name === "free" ? "notEnrolled" : /inProgress|completed/);
  await page.goto("/app/dashboard");
  await expect(summary).toHaveAttribute("data-state", dashboardState!);
});

test("paid user records a putting session that persists in progress and dashboard", async ({ page }, info) => {
  test.skip(info.project.name !== "paid", "Requires real course enrollment");
  test.setTimeout(90_000);
  const initialProgress = page.waitForResponse(response => response.url().includes("/sessions?") && response.ok());
  await openWithTheme(page, "/app/courses/putting-course/learn/day/1", "light");
  await expect(page.getByRole("heading", { name: /^Day 1:/ })).toBeVisible();
  const progressResponse = await initialProgress;
  const before = await progressResponse.json();
  page.on("dialog", dialog => dialog.accept());
  const saved = page.waitForResponse(response => response.request().method() === "POST" && response.url().endsWith("/games/putting-course/session"));
  for (let putt = 0; putt < 30; putt++) {
    await page.getByRole("button", { name: /Make/ }).click();
  }
  const response = await saved;
  expect(response.status()).toBe(201);
  const { id } = await response.json();
  expect(id).toBeTruthy();
  await expect(page.getByText(`Total Sessions: ${before.length + 1}`, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(`Total Sessions: ${before.length + 1}`, { exact: true })).toBeVisible();
  await expect(page.getByText(/Overall:.*30\/30/).last()).toBeVisible();
  await page.goto("/app/dashboard");
  await expect(page.getByText("30/30", { exact: true })).toBeVisible();
  await expect(page.getByText("35ft", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("30/30", { exact: true })).toBeVisible();
  await page.goto("/app/courses/putting-course/learn/day/1");
  await expect(page.getByText(`Total Sessions: ${before.length + 1}`, { exact: true })).toBeVisible();
});

// Regression found during Feature 61 exploration: per-distance progress
// forced a 385px document on a supported 320px phone after a session existed.
test("putting progress fits a 320px phone after sessions exist", async ({ page }, info) => {
  test.skip(info.project.name !== "paid", "Progress is enrollment-gated");
  // Layout-only fixture keeps this regression independent of account history.
  // The recording test above verifies persistence against the real API.
  await page.route("**/api/games/putting-course/sessions?*", route => route.fulfill({ json: [{
    id: "layout-regression", dayNumber: 1, maxDistanceFt: 35, durationSeconds: 60,
    createdAt: "2026-10-07T12:00:00Z", overall: { made: 30, attempted: 30, percentage: 100 },
    distanceStats: Object.fromEntries([10, 15, 20, 25, 30, 35].map(distance => [distance, { made: 5, attempted: 5, percentage: 100 }])),
  }] }));
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/app/courses/putting-course/learn/day/1");
  await expect(page.getByRole("heading", { name: "Your Putting Progress" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Performance by Distance:" }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
