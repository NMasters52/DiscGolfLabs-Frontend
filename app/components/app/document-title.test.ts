import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { APP_NAME, documentTitle } from "./navigation.ts";

test("titles the Settings root and every Clerk sub-page as Settings", () => {
  // Clerk's UserProfile owns every remainder client-side, so the title must
  // not depend on which internal page the URL happens to name.
  assert.equal(documentTitle("/app/settings"), `Settings · ${APP_NAME}`);
  assert.equal(documentTitle("/app/settings/security"), `Settings · ${APP_NAME}`);
  assert.equal(documentTitle("/app/settings/bogus"), `Settings · ${APP_NAME}`);
});

test("never exposes the URL in the title", () => {
  // The regression in #55 was the browser falling back to the URL as the
  // title; guard the whole shape, not just the Settings entry.
  for (const pathname of [
    "/app/settings",
    "/app/settings/security",
    "/app/dashboard",
    "/app",
  ]) {
    const title = documentTitle(pathname);
    assert.ok(!title.includes("/"), `${title} leaks a path`);
    assert.ok(!title.includes("localhost"), `${title} leaks a host`);
  }
});

test("keeps the other destinations addressable so titles cannot drift", () => {
  assert.equal(documentTitle("/app/dashboard"), `Dashboard · ${APP_NAME}`);
  assert.equal(
    documentTitle("/app/courses/putting-course/learn/day/2"),
    `Putting Course · ${APP_NAME}`,
  );
});

test("falls back to the product name where no destination claims the path", () => {
  // This is the value Settings resets the tab to on unmount, so the Settings
  // title cannot leak onto pages that set no title of their own.
  assert.equal(documentTitle("/app"), APP_NAME);
  // The splat route never mounts here, so it must not claim the title either.
  assert.equal(documentTitle("/app/settingsx"), APP_NAME);
});
