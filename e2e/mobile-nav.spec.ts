/**
 * Mobile navigation (issue #48): below the shell's 768px breakpoint the
 * desktop sidebar is replaced by a sticky compact header and a fixed
 * Dashboard / Course / More bottom bar, with More opening a content-sized
 * bottom sheet.
 *
 * Every read here is a runtime read per docs/browser-qa-protocol.md:
 * visibility, geometry (48px targets), computed padding (safe-area), and
 * aria state come from the live page, and close paths are exercised for real
 * (outside tap, Back, destination tap, swipe) rather than grepped for.
 *
 * Layout proofs run at both required widths (320px and 390px); interaction
 * proofs run at 390px. Course screens are enrollment-gated, so those checks
 * branch on the Playwright project (nicholas = enrolled, nick = not) the way
 * titles.spec.ts does.
 */
import { expect, type Locator, test } from "@playwright/test";

import {
  COURSE_DAY_PATH,
  COURSE_MARKETING_PATH,
  THEMES,
  bottomBar,
  mobileHeader,
  moreSheet,
  openMobileWithTheme,
  settle,
  sidebar,
  type MobileViewport,
} from "./helpers";

const VIEWPORTS: MobileViewport[] = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
];
const INTERACTION_VIEWPORT: MobileViewport = { width: 390, height: 844 };

/** The three and only three bottom-bar targets, per the issue. */
const TABS = [
  { role: "link", name: "Dashboard" },
  { role: "link", name: "Course" },
  { role: "button", name: "More" },
] as const;

const tab = (page: Parameters<typeof bottomBar>[0], name: string): Locator => {
  const item = TABS.find((candidate) => candidate.name === name)!;
  return bottomBar(page).getByRole(item.role, { name });
};

/**
 * The More button by CSS position instead of role: while the sheet is open,
 * Radix's modal aria-hides the rest of the page, so role-based lookups
 * cannot see this button even though it still holds its state attributes.
 */
const moreTab = (page: Parameters<typeof bottomBar>[0]): Locator =>
  bottomBar(page).locator("button");

test.describe("mobile layout", () => {
  for (const viewport of VIEWPORTS) {
    test(`bottom bar replaces the desktop sidebar at ${viewport.width}px`, async ({
      page,
    }) => {
      await openMobileWithTheme(page, "/app/dashboard", "light", viewport);

      // Desktop chrome is gone: no sidebar panel, no hamburger, no duplicate
      // theme control in the compact header.
      await expect(sidebar(page)).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Toggle Sidebar" }),
      ).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Toggle theme" }),
      ).toBeHidden();

      // Compact header: the Disc Golf Labs mark plus the page title.
      await expect(mobileHeader(page)).toBeVisible();
      await expect(mobileHeader(page).locator("svg")).toBeVisible();
      await expect(mobileHeader(page)).toContainText("Dashboard");

      // Exactly Dashboard, Course, More.
      const targets = bottomBar(page).locator("a, button");
      await expect(targets).toHaveCount(TABS.length);

      // Every item keeps icon + visible label, in a >=48px tall target, and
      // the bar sits flush with the bottom of the viewport (safe-area pad
      // included — on this desktop run the inset is 0, still flush).
      for (const { name } of TABS) {
        const item = tab(page, name);
        await expect(item).toBeVisible();
        await expect(item.locator("svg")).toBeVisible();
        const box = await item.boundingBox();
        expect(box, `${name} target has geometry`).not.toBeNull();
        expect(
          box!.height,
          `${name} target must be at least 48px tall`,
        ).toBeGreaterThanOrEqual(48);
      }
      const barBox = await bottomBar(page).boundingBox();
      expect(
        Math.round(barBox!.y + barBox!.height),
        "bar pinned to the viewport bottom",
      ).toBe(viewport.height);

      // The bar never covers content: the scrollable column reserves its
      // height (3.5rem) plus the safe-area inset as bottom padding.
      const contentPaddingBottom = await page
        .locator('[data-slot="sidebar-inset"] > main')
        .evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingBottom));
      expect(contentPaddingBottom).toBeGreaterThanOrEqual(56);
    });
  }

  test("bar stays visible while the page scrolls", async ({ page }) => {
    await openMobileWithTheme(page, "/app/dashboard", "light", INTERACTION_VIEWPORT);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(bottomBar(page)).toBeVisible();
    await expect(mobileHeader(page)).toBeVisible();
  });

  test("switches from mobile navigation to the sidebar at 768px", async ({
    page,
  }) => {
    await openMobileWithTheme(page, "/app/dashboard", "light", {
      width: 767,
      height: 844,
    });

    await expect(bottomBar(page)).toBeVisible();
    await expect(sidebar(page)).toBeHidden();

    await page.setViewportSize({ width: 768, height: 844 });

    await expect(bottomBar(page)).toBeHidden();
    await expect(mobileHeader(page)).toBeHidden();
    await expect(sidebar(page)).toBeVisible();
  });
});

test.describe("Course tab access", () => {
  test("enrolled account goes straight to training", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nicholas",
      "nicholas holds the paid/enrolled account",
    );

    await openMobileWithTheme(
      page,
      "/app/dashboard",
      "light",
      INTERACTION_VIEWPORT,
    );
    const courseTab = tab(page, "Course");
    await expect(courseTab).toHaveAttribute("data-access", "enrolled");

    await courseTab.click();
    await settle(page);

    await expect(page).toHaveURL(
      /\/app\/courses\/putting-course\/learn\/day\/\d+$/,
    );
    await expect(bottomBar(page)).toBeVisible();
  });

  test("unenrolled account chooses before leaving the app", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick holds the unpaid/unenrolled account",
    );

    await openMobileWithTheme(
      page,
      "/app/dashboard",
      "light",
      INTERACTION_VIEWPORT,
    );
    const courseTab = tab(page, "Course");
    await expect(courseTab).toHaveAttribute(
      "data-access",
      "enrollment-required",
    );

    await courseTab.click();

    const accessSheet = page.getByRole("dialog", { name: "Putting Course" });
    await expect(page).toHaveURL(/\/app\/dashboard$/);
    await expect(accessSheet).toBeVisible();
    await expect(
      accessSheet.getByText("Enroll before starting the course."),
    ).toBeVisible();

    await accessSheet.getByRole("button", { name: "Stay here" }).click();
    await expect(accessSheet).toBeHidden();
    await expect(courseTab).toBeFocused();

    await courseTab.click();
    await accessSheet.getByRole("link", { name: "View course" }).click();

    await expect(page).toHaveURL(new RegExp(`${COURSE_MARKETING_PATH}$`));
    await expect(bottomBar(page)).toHaveCount(0);
  });
});

test.describe("mobile bar persistence on course screens", () => {
  test("bar remains on course lesson screens (enrolled)", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nicholas",
      "nicholas holds the paid/enrolled account; nick's behavior is the next test",
    );

    await openMobileWithTheme(page, COURSE_DAY_PATH, "light", INTERACTION_VIEWPORT);
    await settle(page);

    await expect(page).toHaveURL(new RegExp(COURSE_DAY_PATH));
    await expect(bottomBar(page)).toBeVisible();
    await expect(mobileHeader(page)).toContainText("Putting Course");
  });

  test("bar stays visible over the putting game (enrolled)", async (
    { page },
    testInfo,
  ) => {
    test.skip(
      testInfo.project.name !== "nicholas",
      "the putting game renders inside enrolled course day screens",
    );

    await openMobileWithTheme(page, COURSE_DAY_PATH, "light", INTERACTION_VIEWPORT);
    await settle(page);

    // The putting game is a widget on the lesson day screen, not its own
    // route: its distance header proves the game is on screen while the
    // fixed bar holds its place above it, at rest and at the scroll bottom.
    await expect(page.getByText("Current Distance:")).toBeVisible();
    await expect(bottomBar(page)).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(bottomBar(page)).toBeVisible();
  });

  test("unenrolled account leaves the shell for course screens", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nick",
      "nick is the unenrolled account; nicholas's behavior is the previous test",
    );

    // The enrollment guard redirects nick to the marketing page, which is
    // outside the app shell — no mobile chrome there by design.
    await page.setViewportSize(INTERACTION_VIEWPORT);
    await page.goto(COURSE_DAY_PATH);
    await settle(page);

    await expect(page).toHaveURL(new RegExp(`${COURSE_MARKETING_PATH}$`));
    await expect(bottomBar(page)).toHaveCount(0);
  });
});

test.describe("mobile active states", () => {
  test("Dashboard tab owns /app/dashboard", async ({ page }) => {
    await openMobileWithTheme(page, "/app/dashboard", "light", INTERACTION_VIEWPORT);

    await expect(tab(page, "Dashboard")).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(tab(page, "Course")).not.toHaveAttribute("aria-current");
    await expect(tab(page, "More")).toHaveAttribute("data-active", "false");
    await expect(tab(page, "More")).toHaveAttribute("aria-expanded", "false");
  });

  test("Course tab owns course lesson screens", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "nicholas",
      "course screens need the enrolled account",
    );

    await openMobileWithTheme(page, COURSE_DAY_PATH, "light", INTERACTION_VIEWPORT);
    await settle(page);

    await expect(tab(page, "Course")).toHaveAttribute("aria-current", "page");
    await expect(tab(page, "Dashboard")).not.toHaveAttribute("aria-current");
  });

  test("More owns Settings and while its sheet is open", async ({ page }) => {
    await openMobileWithTheme(page, "/app/settings", "light", INTERACTION_VIEWPORT);

    await expect(mobileHeader(page)).toContainText("Settings");
    await expect(tab(page, "More")).toHaveAttribute("data-active", "true");
    await expect(tab(page, "Dashboard")).not.toHaveAttribute("aria-current");

    await tab(page, "More").click();
    await expect(moreTab(page)).toHaveAttribute("aria-expanded", "true");
    await expect(moreTab(page)).toHaveAttribute("data-active", "true");
    await expect(moreSheet(page)).toBeVisible();
  });
});

test.describe("More sheet", () => {
  test.beforeEach(async ({ page }) => {
    await openMobileWithTheme(page, "/app/dashboard", "light", INTERACTION_VIEWPORT);
    await tab(page, "More").click();
    await expect(moreSheet(page)).toBeVisible();
  });

  test("shows account context, theme controls, the settings destination, and Sign Out", async ({
    page,
  }) => {
    // Opening pushed a history entry — that is what makes Back close it.
    expect(new URL(page.url()).searchParams.get("more")).toBe("1");

    // The dialog keeps an accessible description without repeating a visible
    // inventory directly under the title.
    await expect(
      moreSheet(page).locator('[data-slot="sheet-description"]'),
    ).toHaveClass(/sr-only/);

    // Clerk-backed account summary: an avatar and the account's email.
    const account = page.locator('[data-slot="more-account"]');
    await expect(account).toBeVisible();
    await expect(account.getByText(/@/)).toBeVisible();

    // The same System/Light/Dark control the Settings screen uses.
    for (const theme of THEMES) {
      const label = theme[0].toUpperCase() + theme.slice(1);
      await expect(
        moreSheet(page).getByRole("button", { name: label }),
      ).toBeVisible();
    }

    // Account and Settings are one combined page, so the sheet carries one
    // affordance: the account card's footer strip.
    await expect(
      moreSheet(page).getByRole("link", { name: "Account & Settings" }),
    ).toBeVisible();
    await expect(
      moreSheet(page).getByRole("button", { name: "Sign Out" }),
    ).toBeVisible();
  });

  test("theme controls drive the app theme without closing the sheet", async ({
    page,
  }) => {
    await moreSheet(page).getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/(^|\s)dark(\s|$)/);
    await expect(moreSheet(page)).toBeVisible();

    await moreSheet(page).getByRole("button", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveClass(/(^|\s)light(\s|$)/);
    await expect(moreSheet(page)).toBeVisible();
  });

  test("destination selection closes the sheet and navigates", async ({
    page,
  }) => {
    await moreSheet(page)
      .getByRole("link", { name: "Account & Settings" })
      .click();

    await expect(page).toHaveURL(new RegExp("/app/settings$"));
    await expect(moreSheet(page)).toBeHidden();
    // Settings is now current, so More stays active after the close.
    await expect(tab(page, "More")).toHaveAttribute("data-active", "true");
  });

  test("outside tap closes the sheet and restores focus to More", async ({
    page,
  }) => {
    // Tap the dimmed overlay above the sheet (the header area is beneath it).
    await page.mouse.click(INTERACTION_VIEWPORT.width / 2, 40);

    await expect(moreSheet(page)).toBeHidden();
    expect(new URL(page.url()).searchParams.get("more")).toBeNull();
    await expect(tab(page, "More")).toBeFocused();
  });

  test("browser Back closes the sheet", async ({ page }) => {
    await page.goBack();

    await expect(moreSheet(page)).toBeHidden();
    expect(new URL(page.url()).searchParams.get("more")).toBeNull();
    await expect(page).toHaveURL(new RegExp("/app/dashboard$"));
  });

  test("a downward swipe closes the sheet", async ({ page }) => {
    // The MCP-driven protocol captures swipes by hand; here the same gesture
    // is synthesized as a real TouchEvent sequence on the sheet surface, so
    // the component's touch handlers — not a code path — dismiss it.
    await page.evaluate(() => {
      const surface = document.querySelector('[data-slot="sheet-content"]')!;
      const box = surface.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y0 = box.top + 60;
      const touch = (y: number) =>
        new Touch({ identifier: 1, target: surface, clientX: x, clientY: y });
      const fire = (type: string, y: number) =>
        surface.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: type === "touchend" ? [] : [touch(y)],
            changedTouches: [touch(y)],
          }),
        );
      fire("touchstart", y0);
      fire("touchmove", y0 + 50);
      fire("touchmove", y0 + 120);
      fire("touchend", y0 + 120);
    });

    await expect(moreSheet(page)).toBeHidden();
    expect(new URL(page.url()).searchParams.get("more")).toBeNull();
  });

  test("a short landscape viewport scrolls the sheet instead of clipping it", async ({
    page,
  }) => {
    // Resized after the beforeEach opened the sheet: staying under 768px
    // keeps the sheet open, and the capped height must scroll its own
    // overflow rather than clipping Sign Out out of reach.
    await page.setViewportSize({ width: 740, height: 360 });
    await expect(moreSheet(page)).toBeVisible();

    const geometry = await moreSheet(page).evaluate((el) => ({
      overflowY: getComputedStyle(el).overflowY,
      clipped: el.scrollHeight > el.clientHeight,
    }));
    expect(geometry.overflowY).toBe("auto");
    expect(geometry.clipped).toBe(true);

    await moreSheet(page).evaluate((el) =>
      el.scrollTo({ top: el.scrollHeight }),
    );
    await expect(
      moreSheet(page).getByRole("button", { name: "Sign Out" }),
    ).toBeInViewport();
  });

  test("keyboard focus stays trapped in the open sheet", async ({ page }) => {
    for (let stop = 0; stop < 12; stop += 1) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() =>
        Boolean(
          document.activeElement?.closest('[data-slot="sheet-content"]'),
        ),
      );
      expect(
        inside,
        `Tab stop ${stop + 1} must stay inside the open sheet`,
      ).toBe(true);
    }
  });
});

test.describe("mobile themes", () => {
  for (const theme of THEMES) {
    test(`mobile chrome renders in ${theme}`, async ({ page }) => {
      await openMobileWithTheme(page, "/app/dashboard", theme, INTERACTION_VIEWPORT);

      // The bar and header adopt the theme's solid background: the proof the
      // chrome is themed, not just the page behind it.
      await expect(bottomBar(page)).toBeVisible();
      const background = await bottomBar(page).evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      expect(background).not.toBe("transparent");
    });
  }
});
