import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's native type stripping requires the explicit extension.
import { getAuthRedirectDestination } from "../../components/require-auth-redirect.ts";

test("redirects a loaded signed-out dashboard visitor to sign-in", () => {
  const destination = getAuthRedirectDestination({
    isLoaded: true,
    isSignedIn: false,
    pathname: "/app/dashboard",
    search: "",
  });

  assert.equal(
    destination,
    "/sign-in?redirect_url=%2Fapp%2Fdashboard",
  );
});

test("preserves a nested course path and query string in the return URL", () => {
  const destination = getAuthRedirectDestination({
    isLoaded: true,
    isSignedIn: false,
    pathname: "/app/courses/putting-course/learn/day/2",
    search: "?focus=warmup&attempt=1",
  });

  assert.equal(
    destination,
    "/sign-in?redirect_url=%2Fapp%2Fcourses%2Fputting-course%2Flearn%2Fday%2F2%3Ffocus%3Dwarmup%26attempt%3D1",
  );
});
