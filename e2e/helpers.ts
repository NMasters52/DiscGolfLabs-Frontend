/**
 * Shared helpers for the browser QA harness.
 *
 * Everything here is assertion support for the standards in
 * docs/browser-qa-protocol.md: runtime reads (never code greps), computed
 * styles rather than "looked right", and enumerated shells.
 */
import { expect, type Locator, type Page } from "@playwright/test";

// The app's own single source of truth. Importing it — rather than
// restating the strings — is what makes title drift a test failure.
// Pure TS, no DOM dependency, so it is safe to call from Node.
export { APP_NAME, documentTitle } from "../app/components/app/navigation";

/** The two appearances the protocol asks us to prove things in. */
export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** Destinations whose browser tab title must match `documentTitle()`. */
export const TITLE_PATHS = [
  "/app/dashboard",
  "/app/settings",
  "/app/settings/security",
] as const;

/**
 * The course day route is enrollment-gated, so its title is asserted per
 * account in `titles.spec.ts`: enrolled (nicholas) renders inside the shell
 * with the destination title, unenrolled (nick) is redirected to the marketing
 * page, which has no title of its own and shows the bare product name.
 */
export const COURSE_DAY_PATH = "/app/courses/putting-course/learn/day/2";
export const COURSE_MARKETING_PATH = "/courses/putting-course";

/** The persistent sidebar shell, as rendered by AppSidebar. */
export const SIDEBAR_ITEMS = [
  "Courses",
  "Putting Course",
  "Games",
  "Putting Game",
  "Stats",
  "Settings",
  "Sign Out",
] as const;

/** Visible desktop sidebar panel (the fixed, painted container). */
export const sidebar = (page: Page): Locator =>
  page.locator('[data-slot="sidebar-container"]');

/** The Sign Out control in the sidebar's Account group. */
export const signOutButton = (page: Page): Locator =>
  page.getByRole("button", { name: "Sign Out" });

/**
 * Opens `path` with `localStorage.theme` already set, so next-themes resolves
 * `light`/`dark` on first paint — one navigation, no OS dependency.
 *
 * Playwright pins `prefers-color-scheme: light` (see playwright.config.ts), so
 * the machine's appearance can never leak into a run; these two themes are
 * driven purely by the stored preference, like a user clicking the toggle.
 */
export async function openWithTheme(
  page: Page,
  path: string,
  theme: Theme,
): Promise<void> {
  await page.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
  }, theme);

  await page.goto(path);

  // The shell is the thing under test: wait for it before reading styles.
  await expect(signOutButton(page)).toBeVisible();
  // And wait for the resolved class, so Tailwind's dark: variants are live.
  await expect(page.locator("html")).toHaveClass(
    new RegExp(`(^|\\s)${theme}(\\s|$)`),
  );
}

/** Waits for web fonts so a visual baseline never captures a fallback face. */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/**
 * Waits for the SPA to finish its client-side work — data loads, route guards,
 * enrollment redirects — so a read afterwards describes the page the user
 * actually lands on rather than a transient one. Without this a title read can
 * catch the pre-redirect destination and pass on a title that is about to
 * change. Network-idle is reachable here (no kept-alive socket), but a page
 * that never goes quiet still falls through to the retrying assertion.
 */
export async function settle(page: Page, timeout = 15_000): Promise<void> {
  await page
    .waitForLoadState("networkidle", { timeout })
    .catch(() => undefined);
}

/** Keyboard stop Sign Out occupies when tabbing from the top of the page. */
export const SIGN_OUT_TAB_INDEX = 7;

/**
 * Tabs from a blank focus state until Sign Out is focused.
 * Returns every stop so a failure shows the real focus order instead of an
 * unexplained number (protocol: the focus-order capture is the evidence).
 */
export async function tabToSignOut(page: Page): Promise<{
  stops: { tag: string; label: string; focusVisible: boolean }[];
  index: number;
}> {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    (document.activeElement as HTMLElement | null)?.blur();
    document.body.focus();
  });

  const stops: { tag: string; label: string; focusVisible: boolean }[] = [];
  let index = -1;

  for (let stop = 1; stop <= 15; stop += 1) {
    await page.keyboard.press("Tab");
    const current = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      return {
        tag: el.tagName,
        label:
          el.getAttribute("aria-label") ??
          (el.textContent ?? "").trim().slice(0, 40),
        focusVisible: el.matches(":focus-visible"),
      };
    });
    if (!current) continue;
    stops.push(current);
    if (current.label === "Sign Out") {
      index = stop;
      break;
    }
  }

  return { stops, index };
}

export interface ContrastMeasurement {
  /** Computed `color` of the element. */
  color: string;
  /** Computed `backgroundColor` of the element. */
  backgroundColor: string;
  /** That background composited through ancestors until opaque. */
  effectiveBackground: string;
  /** WCAG 2.x contrast ratio of `color` against `effectiveBackground`. */
  ratio: number;
}

/**
 * Reads the element's computed `color`/`backgroundColor`, resolves the
 * background the way the browser actually paints it, and returns the WCAG
 * ratio. Runs entirely in page context so the numbers come from the live DOM
 * (protocol: measured contrast, not "looked right").
 */
export function measureContrast(
  page: Page,
  target: Locator,
): Promise<ContrastMeasurement> {
  return target.evaluate((el: HTMLElement): ContrastMeasurement => {
    // Chrome returns rgb()/rgba() for every color in this app's palette.
    // Pull the numbers out rather than trying to strip the function name: a
    // half-parsed channel silently becomes 0/NaN and the ratio lies.
    const parse = (value: string) => {
      if (!/^rgba?\(/.test(value)) {
        throw new Error(`unsupported computed color: "${value}"`);
      }
      const nums = (value.match(/-?\d*\.?\d+/g) ?? []).map(Number);
      if (nums.length < 3) {
        throw new Error(`unparsable computed color: "${value}"`);
      }
      return { r: nums[0], g: nums[1], b: nums[2], a: nums.length > 3 ? nums[3] : 1 };
    };

    const luminance = (c: { r: number; g: number; b: number }) => {
      const channel = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
    };

    const ratioOf = (
      a: { r: number; g: number; b: number },
      b: { r: number; g: number; b: number },
    ) => {
      const la = luminance(a);
      const lb = luminance(b);
      return Math.round(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)) * 100) / 100;
    };

    const styles = getComputedStyle(el);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // Walk up the tree compositing translucent backgrounds onto the next one,
    // which is what the eye sees behind the label.
    let resolved = parse(backgroundColor);
    let node: HTMLElement | null = el.parentElement;
    while (node && resolved.a < 1) {
      const parentLayer = parse(getComputedStyle(node).backgroundColor);
      resolved = {
        r: resolved.r * resolved.a + parentLayer.r * (1 - resolved.a),
        g: resolved.g * resolved.a + parentLayer.g * (1 - resolved.a),
        b: resolved.b * resolved.a + parentLayer.b * (1 - resolved.a),
        a: resolved.a + parentLayer.a * (1 - resolved.a),
      };
      node = node.parentElement;
    }

    // Nothing opaque behind it: fall back to the white canvas so the ratio
    // stays meaningful rather than measuring against an empty stack.
    if (resolved.a < 1) {
      resolved = {
        r: resolved.r * resolved.a + 255 * (1 - resolved.a),
        g: resolved.g * resolved.a + 255 * (1 - resolved.a),
        b: resolved.b * resolved.a + 255 * (1 - resolved.a),
        a: 1,
      };
    }

    const rgb = (c: { r: number; g: number; b: number }) =>
      `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;

    return {
      color,
      backgroundColor,
      effectiveBackground: rgb(resolved),
      ratio: ratioOf(parse(color), resolved),
    };
  });
}

/** True when the element currently matches `:focus-visible`. */
export function isFocusVisible(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    Boolean(document.activeElement?.matches(":focus-visible")),
  );
}

/** Computed `box-shadow` of the currently focused element. */
export function focusedBoxShadow(page: Page): Promise<string> {
  return page.evaluate(
    () => getComputedStyle(document.activeElement as Element).boxShadow,
  );
}

/** The computed `box-shadow` of an element, focused or not. */
export function boxShadowOf(page: Page, target: Locator): Promise<string> {
  return target.evaluate((el) => getComputedStyle(el).boxShadow);
}
