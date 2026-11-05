import { test } from "node:test";
import assert from "node:assert/strict";
// @ts-expect-error Node strip-types requires the source extension.
import { formatStatsPeriod } from "./stats-period.ts";
import { queryKeys } from "../../queries/keys.js";
import { QueryClient } from "@tanstack/react-query";

test("renders UTC dates with exclusive end converted to last included day", () => {
  assert.equal(formatStatsPeriod({ days: 30, start: "2026-07-14T00:00:00Z", end: "2026-08-13T00:00:00Z" }, 30), "Jul 14 – Aug 12, 2026");
  assert.equal(formatStatsPeriod({ days: 30, start: "2026-09-25T00:00:00Z", end: "2026-10-25T00:00:00Z" }, 30), "Sep 25 – Oct 24, 2026");
  assert.equal(formatStatsPeriod({ days: 30, start: "2026-12-15T00:00:00Z", end: "2027-01-14T00:00:00Z" }, 30), "Dec 15, 2026 – Jan 13, 2027");
  assert.equal(formatStatsPeriod({ days: 7, start: "2026-12-25T00:00:00Z", end: "2027-01-01T00:00:00Z" }, 7), "Dec 25 – Dec 31, 2026");
  assert.equal(formatStatsPeriod({ days: 7, start: "2026-09-25T00:00:00Z", end: "2026-10-02T00:00:00Z" }, 30), "Last 30 days");
  assert.equal(formatStatsPeriod({ days: 7, start: "2026-10-02T00:00:00Z", end: "2026-10-02T00:00:00Z" }, 7), "Last 7 days");
  assert.equal(formatStatsPeriod({ days: 30, start: "2026-09-24T20:00:00-04:00", end: "2026-10-24T20:00:00-04:00" }, 30), "Sep 25 – Oct 24, 2026");
  assert.equal(formatStatsPeriod(undefined, 7), "Last 7 days");
  assert.equal(formatStatsPeriod({ days: 7, start: "bad", end: "bad" }, 7), "Last 7 days");
});

test("period caches stay separate and shared invalidation marks every period stale", async () => {
  const client = new QueryClient();
  for (const days of [7, 30, 90]) client.setQueryData(queryKeys.puttingGame.stats(days), days);
  assert.equal(client.getQueryData(queryKeys.puttingGame.stats(7)), 7);
  await client.invalidateQueries({ queryKey: queryKeys.puttingGame.stats() });
  for (const days of [7, 30, 90]) assert.equal(client.getQueryState(queryKeys.puttingGame.stats(days))?.isInvalidated, true);
  client.clear();
});
