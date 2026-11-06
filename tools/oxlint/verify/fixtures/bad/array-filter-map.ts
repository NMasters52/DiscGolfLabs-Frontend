// Bad fixture: filter immediately followed by map (two passes over one array).
// Expected diagnostic: anti-slop/no-array-filter-map (warning).
const values = [1, 2, 3];

export const doubled = values.filter((value) => value > 1).map((value) => value * 2);
