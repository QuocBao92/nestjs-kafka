let cyclic = 1;

export function getSid(): number {
  if (100000000 <= cyclic) {
    cyclic = 1;
  }
  const sid = cyclic++;
  return sid;
}

export function initialize(val = 1): void {
  cyclic = 0 < val ? val : 1;
}
