// Clean fixture: reducer that mutates the accumulator in place.
// `Object.assign(acc, item)` keeps one accumulator object alive across the
// reduce; only copying it (`Object.assign({}, acc, ...)`) is flagged.
export interface PriceIndex {
  readonly [id: string]: number;
}

export function mergePriceIndex(rows: PriceIndex[], initial: PriceIndex = {}): PriceIndex {
  return rows.reduce<PriceIndex>((acc, row) => Object.assign(acc, row), initial);
}
