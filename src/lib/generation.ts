import type { Horse, RoundPlan } from '@/types/race'
import type { RngFn } from './random'
import { randomInt, shuffle } from './random'

export const ROSTER_SIZE = 20
export const HORSES_PER_ROUND = 10

export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200] as const

const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th'] as const

export function roundLabel(round: number): string {
  return `${ORDINALS[round - 1] ?? `${round}th`} Lap`
}

/**
 * Draws a full roster: unique names, unique colors, one static condition each.
 * RNG consumption order is deterministic so tests can pin exact outcomes.
 */
export function generateHorses(
  names: readonly string[],
  colors: readonly string[],
  rng: RngFn,
): Horse[] {
  const uniqueNames = [...new Set(names)]
  const uniqueColors = [...new Set(colors)]

  if (uniqueNames.length < ROSTER_SIZE) {
    throw new Error(`Need at least ${ROSTER_SIZE} horse names`)
  }
  if (uniqueColors.length < ROSTER_SIZE) {
    throw new Error(`Need at least ${ROSTER_SIZE} horse colors`)
  }

  const selectedNames = shuffle(uniqueNames, rng).slice(0, ROSTER_SIZE)
  const selectedColors = shuffle(uniqueColors, rng).slice(0, ROSTER_SIZE)

  return selectedNames.map((name, index) => {
    const color = selectedColors[index]
    if (!color) throw new Error(`Missing color for roster slot ${index}`)

    return {
      id: index + 1,
      name,
      color,
      condition: randomInt(1, 100, rng),
    }
  })
}

/** Draws 10 unique horse ids for one round. */
export function drawParticipants(horses: readonly Horse[], rng: RngFn): number[] {
  if (horses.length < HORSES_PER_ROUND) {
    throw new Error(`Need at least ${HORSES_PER_ROUND} horses to draw a round`)
  }

  return shuffle(horses, rng)
    .slice(0, HORSES_PER_ROUND)
    .map((horse) => horse.id)
}

/** Precomputes all six independent round draws. */
export function generateRounds(horses: readonly Horse[], rng: RngFn): RoundPlan[] {
  return ROUND_DISTANCES.map((distance, index) => ({
    round: index + 1,
    distance,
    horseIds: drawParticipants(horses, rng),
  }))
}
