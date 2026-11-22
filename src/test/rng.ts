import type { RngFn } from '@/lib/random'

/**
 * Exact, predictable values for unit-testing edge cases
 * (e.g., [0, 0.999] -> condition 1 vs condition 100).
 */
export function sequenceRng(values: readonly number[]): RngFn {
  let index = 0
  return () => values[index++ % values.length] ?? 0
}

/**
 * Simple Linear Congruential Generator (LCG) for multi-tick race simulations,
 * Storybook stories, and Playwright visual snapshots.
 */
export function seededRng(seed = 42): RngFn {
  let s = Math.abs(Math.floor(seed)) || 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
