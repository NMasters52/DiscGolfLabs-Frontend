// Bad fixture: copying the accumulator inside a reduce instead of mutating it.
// Expected diagnostic: anti-slop/no-reduce-accumulator-copy (error).
export interface Tally {
  readonly [id: string]: number;
}

export function tally(entries: Tally[]): Tally {
  return entries.reduce<Tally>((acc, entry) => Object.assign({}, acc, entry), {});
}
