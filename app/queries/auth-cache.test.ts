import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { shouldClearAuthCache } from "./auth-cache.ts";

test("the initial Clerk resolution from undefined is app load, not a change", () => {
  assert.equal(shouldClearAuthCache(undefined, "user-1"), false);
  assert.equal(shouldClearAuthCache(undefined, null), false);
  assert.equal(shouldClearAuthCache(undefined, undefined), false);
});

test("an unchanged signed-in user keeps the cache", () => {
  assert.equal(shouldClearAuthCache("user-1", "user-1"), false);
});

test("signing out clears the cache", () => {
  assert.equal(shouldClearAuthCache("user-1", null), true);
});

test("signing in after sign-out clears the cache", () => {
  assert.equal(shouldClearAuthCache(null, "user-1"), true);
});

test("switching accounts clears the cache", () => {
  assert.equal(shouldClearAuthCache("user-1", "user-2"), true);
});
