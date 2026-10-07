import assert from "node:assert/strict";
import test from "node:test";
import { QueryClient } from "@tanstack/react-query";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { defaultQueryOptions } from "./query-options.ts";

test("retries a failed query once and returns recovered data", async () => {
  const queryClient = new QueryClient();
  let attempts = 0;

  const result = await queryClient.fetchQuery({
    queryKey: ["query-retry-success"],
    queryFn: async () => {
      attempts += 1;

      if (attempts === 1) {
        throw new Error("temporary network failure");
      }

      return "loaded";
    },
    ...defaultQueryOptions,
    retryDelay: 0,
  });

  assert.equal(result, "loaded");
  assert.equal(attempts, 2);
});

test("stops after the retry is exhausted", async () => {
  const queryClient = new QueryClient();
  let attempts = 0;

  await assert.rejects(
    queryClient.fetchQuery({
      queryKey: ["query-retry-failure"],
      queryFn: async () => {
        attempts += 1;
        throw new Error("network unavailable");
      },
      ...defaultQueryOptions,
      retryDelay: 0,
    }),
    /network unavailable/,
  );

  assert.equal(attempts, 2);
});
