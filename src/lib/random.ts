export type RngFn = () => number

export function randomInt(min: number, max: number, rng: RngFn = Math.random): number {
  return min + Math.floor(rng() * (max - min + 1))
}

export function shuffle<T>(items: readonly T[], rng: RngFn = Math.random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const current = copy[i]
    const target = copy[j]
    if (current !== undefined && target !== undefined) {
      copy[i] = target
      copy[j] = current
    }
  }
  return copy
}
