import assert from "node:assert/strict";
import test from "node:test";
import { QueryClient } from "@tanstack/react-query";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { dashboardQueryOptions } from "./dashboard-options.ts";

test("retries a failed dashboard query once and returns recovered data", async () => {
  const queryClient = new QueryClient();
  let attempts = 0;

  const result = await queryClient.fetchQuery({
    queryKey: ["dashboard-retry-success"],
    queryFn: async () => {
      attempts += 1;

      if (attempts === 1) {
        throw new Error("temporary network failure");
      }

      return "dashboard loaded";
    },
    ...dashboardQueryOptions,
    retryDelay: 0,
  });

  assert.equal(result, "dashboard loaded");
  assert.equal(attempts, 2);
});

test("stops after the dashboard retry is exhausted", async () => {
  const queryClient = new QueryClient();
  let attempts = 0;

  await assert.rejects(
    queryClient.fetchQuery({
      queryKey: ["dashboard-retry-failure"],
      queryFn: async () => {
        attempts += 1;
        throw new Error("network unavailable");
      },
      ...dashboardQueryOptions,
      retryDelay: 0,
    }),
    /network unavailable/,
  );

  assert.equal(attempts, 2);
});
