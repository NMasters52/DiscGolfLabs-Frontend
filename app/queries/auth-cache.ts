/**
 * Whether a Clerk user change must invalidate cached server state.
 *
 * `undefined` means Clerk has not resolved yet — the initial
 * `undefined -> userId` resolution is app load, not a user change, so it
 * keeps the cache. Every resolved transition does not: sign-out (`userId ->
 * null`), sign-in (`null -> userId`), and account switch (`userId ->
 * another userId`) all leave another user's enrollment and progress in
 * cache, so each one clears it.
 */
export function shouldClearAuthCache(
  previousUserId: string | null | undefined,
  nextUserId: string | null | undefined,
): boolean {
  return previousUserId !== undefined && previousUserId !== nextUserId;
}
