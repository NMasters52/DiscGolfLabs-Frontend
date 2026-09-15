/**
 * Sign Out contrast (issue #56 regression guard).
 *
 * QA #7 passed Light mode on the subject of the test and missed that the Sign
 * Out label was unreadable. This spec measures the live computed colors in both
 * appearances and asserts the WCAG 2.x ratio of the label against the
 * background the browser actually paints behind it — never "looked right".
 */
import { expect, test } from "@playwright/test";

import {
  measureContrast,
  openWithTheme,
  signOutButton,
  THEMES,
} from "./helpers";

/** WCAG 2.x AA for normal-size text (Sign Out renders at 14px). */
const MIN_CONTRAST = 4.5;

for (const theme of THEMES) {
  test(`Sign Out contrast is WCAG AA in ${theme} mode`, async ({ page }) => {
    // openWithTheme also proves the theme really landed: it fails unless
    // <html> resolves to this appearance, so the matrix can't go vacuous.
    await openWithTheme(page, "/app/settings", theme);

    const signOut = signOutButton(page);
    const measured = await measureContrast(page, signOut);

    // Evidence first: the measured values travel with the failure.
    expect(
      measured.ratio,
      `Sign Out label ${measured.color} on ${measured.backgroundColor} ` +
        `(composited background ${measured.effectiveBackground}, ` +
        `page background ${await page.evaluate(
          () => getComputedStyle(document.body).backgroundColor,
        )}) in ${theme} mode`,
    ).toBeGreaterThanOrEqual(MIN_CONTRAST);

    // A theme that hid the label instead of recoloring it would pass the
    // ratio, so rule out a transparent/fully-transparent foreground too.
    expect(measured.color).not.toMatch(/rgba?\(\s*0,\s*0,\s*0,\s*0\s*\)/);
  });
}
