// Clean fixture: `as const` assertion chains stay exempt from
// no-chained-type-assertions. Two kinds of line live here:
//
// 1. A valid application idiom — a single `as const` on an object literal,
//    which is how app code should narrow literals:
export const featureFlags = { retries: 2, mode: "fixed" } as const;

// 2. A syntax-only matcher probe: a chain made only of `as const` must not be
//    flagged. The second assertion is deliberately NOT valid TypeScript
//    (tsc rejects it with TS1355). This directory is excluded from application
//    typecheck on purpose; this line tests the lint matcher only — do not
//    copy it into app code.
export const flagMode = (featureFlags.mode as const) as const;
