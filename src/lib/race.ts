import type { Horse, RoundRaceState, RunnerState } from '@/types/race'
import type { RngFn } from './random'

/** Metres per second at condition 100 before noise. */
export const BASE_SPEED = 80
export const SPEED_NOISE = 0.08

export function createRoundRace(participants: readonly Horse[]): RoundRaceState {
  return {
    elapsed: 0,
    allFinished: false,
    runners: participants.map((horse, index) => ({
      horseId: horse.id,
      lane: index + 1,
      condition: horse.condition,
      position: 0,
      finishTime: null,
    })),
  }
}

/** `speed = BASE * (0.75 + condition / 400) * (1 + noise)`, noise in [-VAR, VAR]. */
export function speedFor(condition: number, rng: RngFn): number {
  const noise = (rng() * 2 - 1) * SPEED_NOISE
  return BASE_SPEED * (0.75 + condition / 400) * (1 + noise)
}

/**
 * Advances the round by `dt` seconds. Finish times use the exact remaining
 * distance before the tick, so overshoot is interpolated rather than clamped.
 */
export function stepRound(
  state: RoundRaceState,
  distance: number,
  dt: number,
  rng: RngFn,
): RoundRaceState {
  if (state.allFinished || dt <= 0 || distance <= 0) return state

  const runners = state.runners.map((runner): RunnerState => {
    if (runner.finishTime !== null) return runner

    const speed = speedFor(runner.condition, rng)
    const remaining = distance - runner.position
    const travel = speed * dt

    if (travel >= remaining) {
      return {
        ...runner,
        position: distance,
        finishTime: state.elapsed + remaining / speed,
      }
    }

    return { ...runner, position: runner.position + travel }
  })

  return {
    elapsed: state.elapsed + dt,
    runners,
    allFinished: runners.every((runner) => runner.finishTime !== null),
  }
}

/** Finish order, ties broken deterministically by horse id. */
export function finishOrder(state: RoundRaceState): RunnerState[] {
  return [...state.runners].sort((a, b) => {
    if (a.finishTime !== null && b.finishTime !== null) {
      return a.finishTime - b.finishTime || a.horseId - b.horseId
    }
    if (a.finishTime !== null) return -1
    if (b.finishTime !== null) return 1
    return b.position - a.position || a.horseId - b.horseId
  })
}

export function formatRaceTime(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0
  const minutes = Math.floor(safe / 60)
  const remainder = (safe % 60).toFixed(2).padStart(5, '0')
  return `${minutes}:${remainder}`
}
