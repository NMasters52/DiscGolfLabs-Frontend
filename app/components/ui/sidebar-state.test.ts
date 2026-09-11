import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's native type stripping requires the explicit extension.
import { readSidebarState, serializeSidebarState } from "./sidebar-state.ts";

test("reads true and false sidebar preferences", () => {
  assert.equal(readSidebarState("sidebar_state=true"), true);
  assert.equal(readSidebarState("sidebar_state=false"), false);
  assert.equal(
    readSidebarState("theme=dark; sidebar_state=false; session=active"),
    false,
  );
});

test("ignores missing and malformed sidebar preferences", () => {
  assert.equal(readSidebarState("theme=dark"), undefined);
  assert.equal(readSidebarState("sidebar_state=maybe"), undefined);
  assert.equal(readSidebarState("sidebar_state=trueish"), undefined);
});

test("serializes a seven-day sidebar preference cookie", () => {
  assert.equal(
    serializeSidebarState(false),
    "sidebar_state=false; path=/; max-age=604800",
  );
});
