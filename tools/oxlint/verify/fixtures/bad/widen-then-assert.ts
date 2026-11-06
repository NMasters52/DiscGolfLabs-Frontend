// Bad fixture: widening a known value to `unknown` and asserting it right back.
// Expected diagnostic: anti-slop/no-widen-then-assert (error).
export interface Parsed {
  readonly id: string;
}

export function reparse(source: Parsed): Parsed {
  const widened: unknown = source;
  return widened as Parsed;
}
