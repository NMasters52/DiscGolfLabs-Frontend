// Bad fixture: building an array by spreading the accumulator on every step.
// Expected diagnostic: oxc/no-accumulating-spread (error).
export function buildList(values: number[]): number[] {
  return values.reduce<number[]>((acc, value) => [...acc, value], []);
}
