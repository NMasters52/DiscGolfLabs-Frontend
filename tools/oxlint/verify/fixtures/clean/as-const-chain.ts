// Clean fixture: `as const` assertion chains are allowed.
// A double `as const` narrows rather than losing information, unlike
// `value as unknown as Target`, which the gate still flags.
export const featureFlags = { retries: 2, mode: "fixed" } as const;

export const flagMode = (featureFlags.mode as const) as const;
