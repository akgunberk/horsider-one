const DEFAULT_SPEED_MULTIPLIER = 1
const MAX_SPEED_MULTIPLIER = 500

/**
 * Reads the optional `?speed=` multiplier used by Playwright and demos.
 * Invalid, zero, or negative values fall back to real time.
 */
export function useSpeedMultiplier(
  search: string = typeof window === 'undefined' ? '' : window.location.search,
): number {
  const raw = new URLSearchParams(search).get('speed')
  if (raw === null) return DEFAULT_SPEED_MULTIPLIER

  const value = Number(raw)
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_SPEED_MULTIPLIER

  return Math.min(value, MAX_SPEED_MULTIPLIER)
}
