import { expect, test, type Page } from "@playwright/test";

async function selectPeriod(page: Page, days: number) {
  await page.getByRole("combobox", { name: "Make rate period" }).click();
  await page.getByRole("option", { name: `Last ${days} days`, exact: true }).click();
}

for (const width of [390, 1440]) {
  test(`make-rate periods use real API metadata at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const initial = info.project.name === "paid" ? page.waitForResponse(r => r.url().includes("/api/stats?days=30") && r.ok()) : null;
    await page.goto("/app/dashboard?variant=C");
    await expect(page.getByRole("region", { name: "Card design preview" })).toHaveCount(0);
    if (info.project.name === "free") {
      await expect(page.getByText("Enroll to start", { exact: true })).toBeVisible();
      await expect(page.getByRole("combobox", { name: "Make rate period" })).toHaveCount(0);
      return;
    }
    const timezoneInfo = page.getByRole("button", { name: "About date timezone" });
    await timezoneInfo.hover();
    await expect(page.getByRole("tooltip")).toHaveText("Date ranges are based on UTC");
    await page.mouse.move(0, 0);
    await timezoneInfo.focus();
    await expect(page.getByRole("tooltip")).toHaveText("Date ranges are based on UTC");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    const first = await (await initial!).json();
    expect(first.period.days).toBe(30);
    for (const days of [7, 90, 30]) {
      const response = page.waitForResponse(r => r.url().includes(`/api/stats?days=${days}`) && r.ok());
      await selectPeriod(page, days);
      const body = await (await response).json();
      expect(body.period.days).toBe(days);
      const start = new Date(body.period.start);
      const last = new Date(new Date(body.period.end).getTime() - 86400000);
      const format = (value: Date, includeYear: boolean) => new Intl.DateTimeFormat("en-US", {
        month: "short", day: "numeric", ...(includeYear ? { year: "numeric" as const } : {}), timeZone: "UTC",
      }).format(value);
      const dates = page.getByText(`${format(start, start.getUTCFullYear() !== last.getUTCFullYear())} – ${format(last, true)}`, { exact: true });
      await expect(dates).toBeVisible();
      await expect(dates).toHaveAccessibleDescription("Date ranges are based on UTC");
      await expect(dates).not.toContainText("UTC");
      await expect(page.getByRole("combobox", { name: "Make rate period" })).toHaveText(`Last ${days} days`);
    }
    const selector = page.getByRole("combobox", { name: "Make rate period" });
    await selector.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(selector).toBeFocused();
    await page.reload();
    await expect(selector).toHaveText("Last 30 days");
    expect(errors).toEqual([]);
  });
}

// Keep geometry and screenshot failures independent of period switching and retry.
for (const width of [390, 1440]) {
  test(`make-rate layout at ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== "paid", "Requires enrollment");
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/app/dashboard");
    const timezoneInfo = page.getByRole("button", { name: "About date timezone" });
    await timezoneInfo.hover();
    await expect(page.getByRole("tooltip")).toHaveText("Date ranges are based on UTC");
    const tooltipBox = await page.locator('[data-slot="tooltip-content"]').boundingBox();
    const dropdownBox = await page.getByRole("combobox", { name: "Make rate period" }).boundingBox();
    expect(tooltipBox).not.toBeNull();
    expect(dropdownBox).not.toBeNull();
    const overlaps = tooltipBox!.x < dropdownBox!.x + dropdownBox!.width && tooltipBox!.x + tooltipBox!.width > dropdownBox!.x && tooltipBox!.y < dropdownBox!.y + dropdownBox!.height && tooltipBox!.y + tooltipBox!.height > dropdownBox!.y;
    expect(overlaps, "Timezone tooltip must not cover the period dropdown").toBe(false);
    await page.mouse.move(0, 0);
    await page.keyboard.press("Escape");
    const group = await page.getByRole("combobox", { name: "Make rate period" }).boundingBox();
    const card = await page.getByRole("combobox", { name: "Make rate period" }).locator('xpath=ancestor::*[@data-slot="card"]').boundingBox();
    expect(Math.abs((group!.x + group!.width / 2) - (card!.x + card!.width / 2))).toBeLessThanOrEqual(1);
    const selector = page.getByRole("combobox", { name: "Make rate period" });
    await selector.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    const menu = await page.getByRole("listbox").boundingBox();
    expect(Math.abs((menu!.x + menu!.width / 2) - (group!.x + group!.width / 2))).toBeLessThanOrEqual(1);
    await page.getByRole("listbox").screenshot({ path: `output/playwright/stats-dropdown-menu-${width}.png` });
    await page.screenshot({ path: `output/playwright/stats-dropdown-${width}.png` });
    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await selector.locator('xpath=ancestor::*[@data-slot="card"]').screenshot({ path: `output/playwright/stats-period-card-${width}.png` });
    await page.screenshot({ path: `output/playwright/stats-period-${width}.png`, fullPage: true });
  });
}

test("controlled stats outage keeps selector usable and Retry restores real API", async ({ page }, info) => {
  test.skip(info.project.name !== "paid", "Requires enrollment");
  await page.goto("/app/dashboard?variant=C");
    await expect(page.getByRole("region", { name: "Card design preview" })).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "Make rate period" })).toBeVisible();
  await page.route("**/api/stats?days=7", route => route.fulfill({ status: 503, json: { error: "Controlled outage" } }));
  await selectPeriod(page, 7);
  await expect(page.getByRole("button", { name: "Retry", exact: true })).toBeVisible();
  await page.unroute("**/api/stats?days=7");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByText("Unable to load results")).toHaveCount(0);
  await expect(page.getByRole("img", { name: /^Current 7-day make rate/ })).toBeVisible();
});

test("controlled stats outage appearance", async ({ page }, info) => {
  test.skip(info.project.name !== "paid", "Requires enrollment");
  await page.route("**/api/stats?days=30", route => route.fulfill({ status: 503, json: { error: "Controlled outage" } }));
  await page.goto("/app/dashboard");
  await expect(page.getByRole("button", { name: "Retry", exact: true })).toBeVisible();
  const errorCard = page.getByRole("alert");
  await expect(errorCard.locator("svg")).toHaveCount(0);
  await expect(errorCard).toHaveCSS("border-top-width", "0px");
  await page.screenshot({ path: "output/playwright/make-rate-error-page.png", fullPage: true });
  await errorCard.locator('xpath=ancestor::*[@data-slot="card"]').screenshot({ path: "output/playwright/make-rate-error.png" });
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await errorCard.locator('xpath=ancestor::*[@data-slot="card"]').screenshot({ path: "output/playwright/make-rate-error-dark.png" });
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
});

test("controlled slow and empty period does not display another period's rate", async ({ page }, info) => {
  test.skip(info.project.name !== "paid", "Requires enrollment");
  // Controlled, distinct stats make period mix-ups visible without inspecting QueryClient.
  await page.route("**/api/stats?days=30", route => route.fulfill({
    json: { overall: { makeRate: 60, sessionCount: 12 } },
  }));
  let releaseSeven!: () => void;
  const sevenGate = new Promise<void>(resolve => { releaseSeven = resolve; });
  await page.route("**/api/stats?days=7", async route => {
    await sevenGate;
    await route.fulfill({ json: { overall: { makeRate: 40, sessionCount: 3 } } });
  });
  await page.goto("/app/dashboard?variant=C");
  await expect(page.getByRole("region", { name: "Card design preview" })).toHaveCount(0);
  const selector = page.getByRole("combobox", { name: "Make rate period" });
  const card = selector.locator('xpath=ancestor::*[@data-slot="card"]');
  await expect(selector).toHaveText("Last 30 days");
  await expect(card.getByRole("img")).toHaveAccessibleName("Current 30-day make rate: 60%");
  const sevenRequest = page.waitForRequest(request => {
    const url = new URL(request.url());
    return request.method() === "GET" && url.pathname === "/api/stats" && url.searchParams.get("days") === "7";
  });
  try {
    await selectPeriod(page, 7);
    await sevenRequest;
    await expect(selector).toHaveText("Last 7 days");
    await expect(card.getByRole("img")).toHaveAccessibleName("Current 7-day make rate: Loading");
    await expect(card.getByText("60%", { exact: true })).toHaveCount(0);
  } finally { releaseSeven(); }
  await expect(card.getByRole("img")).toHaveAccessibleName("Current 7-day make rate: 40%");
  await expect(card.getByText("40%", { exact: true })).toBeVisible();
  await selectPeriod(page, 30);
  await expect(selector).toHaveText("Last 30 days");
  await expect(card.getByRole("img")).toHaveAccessibleName("Current 30-day make rate: 60%");
  await expect(card.getByText("60%", { exact: true })).toBeVisible();
  await expect(card.getByText("40%", { exact: true })).toHaveCount(0);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/stats?days=90", async route => {
    await gate;
    await route.fulfill({ json: { overall: { makeRate: 0, sessionCount: 0 } } });
  });
  await selectPeriod(page, 90);
  try {
    await expect(page.getByText("Getting your results")).toBeVisible();
    await page.getByRole("combobox", { name: "Make rate period" }).locator('xpath=ancestor::*[@data-slot="card"]').screenshot({ path: "output/playwright/make-rate-loading.png" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.getByRole("img", { name: "Current 90-day make rate: Loading" })).toHaveCSS("animation-name", "none");
    await expect(page.getByRole("combobox", { name: "Make rate period" })).toBeVisible();
    await expect(page.getByRole("img", { name: /^Current 90-day make rate/ })).toHaveAccessibleName("Current 90-day make rate: Loading");
  } finally { release(); }
  await expect(page.getByText("There are no sessions in these 90 days.", { exact: false })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Make rate period" })).toHaveText("Last 90 days");
});

// Controlled /api/stats payloads that make each make-rate card state
// reachable. "firstSession" additionally empties the sessions list.
type MakeRateCardState = "firstSession" | "empty" | "count" | "unknownCount" | "zero";

const MAKE_RATE_STATE_OVERALL: Record<MakeRateCardState, { makeRate: number; sessionCount?: number }> = {
  firstSession: { makeRate: 68, sessionCount: 12 },
  count: { makeRate: 68, sessionCount: 12 },
  zero: { makeRate: 0, sessionCount: 12 },
  empty: { makeRate: 0, sessionCount: 0 },
  unknownCount: { makeRate: 68 },
};

async function stubMakeRateState(page: Page, state: MakeRateCardState) {
  await page.route("**/api/stats?days=*", route => route.fulfill({ json: { overall: MAKE_RATE_STATE_OVERALL[state] } }));
  if (state === "firstSession") {
    await page.route("**/api/games/putting-course/sessions?*", route => route.fulfill({ json: [] }));
  }
}

for (const state of ["firstSession", "empty", "count", "unknownCount", "zero"] as const satisfies readonly MakeRateCardState[]) {
  test(`selected make-rate treatment: ${state}`, async ({ page }, info) => {
    test.skip(info.project.name !== "paid", "Requires enrollment");
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await stubMakeRateState(page, state);
    await page.goto("/app/dashboard");
    const card = page.getByRole("combobox", { name: "Make rate period" }).locator('xpath=ancestor::*[@data-slot="card"]');
    if (state === "firstSession") {
      await expect(card.getByText("Your make rate starts here")).toBeVisible();
      await card.getByRole("link", { name: "Start a session" }).click();
      await expect(page).toHaveURL(/\/app\/courses\/putting-course\/learn\/day\/\d+/);
      await page.goBack();
      await expect(card.getByText("Your make rate starts here")).toBeVisible();
    } else if (state === "empty") {
      await expect(card.getByText("Your history is still there")).toHaveCount(0);
      await expect(card.getByText("There are no sessions in these 30 days. Try a wider range.")).toBeVisible();
      await card.getByRole("button", { name: "View last 90 days" }).click();
      await expect(page.getByRole("combobox", { name: "Make rate period" })).toHaveText("Last 90 days");
      await expect(card.getByRole("button", { name: /View last/ })).toHaveCount(0);
    } else if (state === "unknownCount") {
      await expect(card.getByText("Based on your completed sessions", { exact: true })).toBeVisible();
      await expect(card.getByText("The percentage of attempted putts you made in this period.")).toBeVisible();
    } else {
      await expect(card.getByText("Based on 12 sessions")).toBeVisible();
      await expect(card.getByText("Only completed putting sessions count toward this result.")).toBeVisible();
      if (state === "zero") await expect(card.getByText("0%", { exact: true })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test(`make-rate appearance: ${state}`, async ({ page }, info) => {
    test.skip(info.project.name !== "paid", "Requires enrollment");
    await stubMakeRateState(page, state);
    await page.goto("/app/dashboard");
    const card = page.getByRole("combobox", { name: "Make rate period" }).locator('xpath=ancestor::*[@data-slot="card"]');
    await expect(card.getByRole("img")).not.toHaveAccessibleName(/Loading$/);
    if (state === "empty") {
      const widerButton = card.getByRole("button", { name: "View last 90 days" });
      await expect(widerButton).toHaveCSS("cursor", "pointer");
      await expect(widerButton).toHaveAttribute("data-variant", "outline");
      const restingBackground = await widerButton.evaluate(element => getComputedStyle(element).backgroundColor);
      await widerButton.hover();
      await expect.poll(() => widerButton.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(restingBackground);
    }
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await card.screenshot({ path: `output/playwright/make-rate-${state}-${width}.png` });
      await page.screenshot({ path: `output/playwright/make-rate-${state}-${width}-page.png`, fullPage: true });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });

}
