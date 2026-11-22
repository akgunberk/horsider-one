import { describe, expect, it } from 'vitest'
import type { Horse } from '@/types/race'
import { seededRng, sequenceRng } from '@/test/rng'
import {
  BASE_SPEED,
  SPEED_NOISE,
  createRoundRace,
  finishOrder,
  formatRaceTime,
  speedFor,
  stepRound,
} from './race'

const participants: Horse[] = [
  { id: 4, name: 'Frankel', color: '#c82829', condition: 100 },
  { id: 9, name: 'Zenyatta', color: '#8e24aa', condition: 100 },
  { id: 17, name: 'Sea The Stars', color: '#0369a1', condition: 1 },
]

describe('race engine', () => {
  it('creates a round with every runner at the start', () => {
    const state = createRoundRace(participants)

    expect(state.elapsed).toBe(0)
    expect(state.allFinished).toBe(false)
    expect(state.runners.map((runner) => runner.lane)).toEqual([1, 2, 3])
    expect(state.runners.every((runner) => runner.position === 0)).toBe(true)
    expect(state.runners.every((runner) => runner.finishTime === null)).toBe(true)
  })

  it('applies the condition-weighted speed formula with noise bounds', () => {
    const slow = speedFor(1, () => 0.5)
    const fast = speedFor(100, () => 0.5)
    const noisyFast = speedFor(100, () => 0.999999)

    expect(slow).toBeCloseTo(BASE_SPEED * (0.75 + 1 / 400))
    expect(fast).toBeCloseTo(BASE_SPEED)
    expect(noisyFast).toBeCloseTo(BASE_SPEED * (1 + SPEED_NOISE))
    expect(noisyFast).toBeGreaterThan(fast)
  })

  it('moves runners by speed × dt', () => {
    const state = createRoundRace(participants)
    const next = stepRound(state, 1000, 1, () => 0.5)

    expect(next.elapsed).toBe(1)
    expect(next.runners[0]?.position).toBeCloseTo(BASE_SPEED)
    expect(next.runners[2]?.position).toBeLessThan(next.runners[0]?.position ?? 0)
    expect(state.runners[0]?.position).toBe(0)
  })

  it('interpolates the exact finish time on overshoot', () => {
    const state = createRoundRace([participants[0]!])
    const next = stepRound(state, 100, 2, () => 0.5)

    expect(next.runners[0]?.position).toBe(100)
    expect(next.runners[0]?.finishTime).toBeCloseTo(100 / BASE_SPEED)
    expect(next.allFinished).toBe(true)
    expect(next.elapsed).toBe(2)
  })

  it('breaks finish ties deterministically by horse id', () => {
    const state = createRoundRace(participants.slice(0, 2))
    const finished = stepRound(state, 100, 2, () => 0.5)

    expect(finishOrder(finished).map((runner) => runner.horseId)).toEqual([4, 9])
  })

  it('ranks mixed finished and running horses', () => {
    const state = createRoundRace(participants)
    const mixed: typeof state = {
      elapsed: 1,
      allFinished: false,
      runners: [
        { ...state.runners[0]!, position: 100, finishTime: 1.2 },
        { ...state.runners[1]!, position: 90, finishTime: null },
        { ...state.runners[2]!, position: 80, finishTime: null },
      ],
    }

    expect(finishOrder(mixed).map((runner) => runner.horseId)).toEqual([4, 9, 17])
  })

  it('keeps finished runners in place while others continue', () => {
    const state = createRoundRace(participants)
    const mixed: typeof state = {
      elapsed: 1,
      allFinished: false,
      runners: [
        { ...state.runners[0]!, position: 100, finishTime: 1.1 },
        { ...state.runners[1]!, position: 50, finishTime: null },
      ],
    }
    const next = stepRound(mixed, 100, 1, () => 0.5)

    expect(next.runners[0]).toBe(mixed.runners[0])
    expect(next.runners[1]?.position).toBeGreaterThan(50)
  })

  it('ignores non-positive deltas and distances', () => {
    const state = createRoundRace(participants)

    expect(stepRound(state, 100, 0, () => 0.5)).toBe(state)
    expect(stepRound(state, 0, 1, () => 0.5)).toBe(state)
  })

  it('stops stepping once every runner is finished', () => {
    const state = createRoundRace(participants)
    const finished = stepRound(state, 100, 10, () => 0.5)
    const next = stepRound(finished, 100, 1, () => 0.5)

    expect(next).toBe(finished)
  })

  it('formats race times with centiseconds', () => {
    expect(formatRaceTime(0)).toBe('0:00.00')
    expect(formatRaceTime(41.2)).toBe('0:41.20')
    expect(formatRaceTime(125.05)).toBe('2:05.05')
    expect(formatRaceTime(Number.NaN)).toBe('0:00.00')
  })

  it('is deterministic for a seeded rng', () => {
    expect(stepRound(createRoundRace(participants), 1200, 1, seededRng(7))).toEqual(
      stepRound(createRoundRace(participants), 1200, 1, seededRng(7)),
    )
  })

  it('handles sequence noise without exceeding the speed envelope', () => {
    const state = stepRound(createRoundRace(participants), 2000, 1, sequenceRng([0, 0.5, 1]))
    const positions = state.runners.map((runner) => runner.position)

    expect(positions.every((position) => position > 0 && position < 2000)).toBe(true)
  })
})
