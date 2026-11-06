// Bad fixture: asserting through an intermediate type instead of validating.
// Expected diagnostic: anti-slop/no-chained-type-assertions (error).
export interface Payload {
  id: number;
}

export function reparse(value: unknown): Payload {
  return value as unknown as Payload;
}
