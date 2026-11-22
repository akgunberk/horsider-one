import { describe, expect, it } from 'vitest'
import { seededRng, sequenceRng } from '@/test/rng'
import {
  HORSES_PER_ROUND,
  ROSTER_SIZE,
  ROUND_DISTANCES,
  drawParticipants,
  generateHorses,
  generateRounds,
  roundLabel,
} from './generation'

const names = Array.from({ length: 30 }, (_, index) => `Horse ${index + 1}`)
const colors = Array.from(
  { length: 20 },
  (_, index) => `#0000${index.toString(16).padStart(2, '0')}`,
)

describe('generateHorses', () => {
  it('draws a full roster with unique names and colors', () => {
    const horses = generateHorses(names, colors, seededRng(1))

    expect(horses).toHaveLength(ROSTER_SIZE)
    expect(new Set(horses.map((horse) => horse.name)).size).toBe(ROSTER_SIZE)
    expect(new Set(horses.map((horse) => horse.color)).size).toBe(ROSTER_SIZE)
    expect(horses.map((horse) => horse.id)).toEqual(
      Array.from({ length: ROSTER_SIZE }, (_, index) => index + 1),
    )
  })

  it('keeps every condition within 1-100', () => {
    const horses = generateHorses(names, colors, sequenceRng([0, 0.999]))

    for (const horse of horses) {
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
      expect(Number.isInteger(horse.condition)).toBe(true)
    }
  })

  it('is deterministic for a seeded rng', () => {
    expect(generateHorses(names, colors, seededRng(9))).toEqual(
      generateHorses(names, colors, seededRng(9)),
    )
  })

  it('does not mutate its inputs', () => {
    const namesCopy = [...names]
    const colorsCopy = [...colors]

    generateHorses(names, colors, seededRng(2))

    expect(names).toEqual(namesCopy)
    expect(colors).toEqual(colorsCopy)
  })

  it('rejects insufficient name or color pools', () => {
    expect(() => generateHorses(['One'], colors, seededRng(1))).toThrow('horse names')
    expect(() => generateHorses(names, ['#ffffff'], seededRng(1))).toThrow('horse colors')
  })
})

describe('round draws', () => {
  const horses = generateHorses(names, colors, seededRng(4))

  it('draws 10 unique ids per round', () => {
    const ids = drawParticipants(horses, seededRng(5))

    expect(ids).toHaveLength(HORSES_PER_ROUND)
    expect(new Set(ids).size).toBe(HORSES_PER_ROUND)
    expect(ids.every((id) => horses.some((horse) => horse.id === id))).toBe(true)
  })

  it('precomputes six rounds at the expected distances', () => {
    const rounds = generateRounds(horses, seededRng(6))

    expect(rounds).toHaveLength(6)
    expect(rounds.map((round) => round.distance)).toEqual([...ROUND_DISTANCES])
    expect(rounds.map((round) => round.round)).toEqual([1, 2, 3, 4, 5, 6])

    for (const round of rounds) {
      expect(round.horseIds).toHaveLength(HORSES_PER_ROUND)
      expect(new Set(round.horseIds).size).toBe(HORSES_PER_ROUND)
    }
  })

  it('labels rounds ordinally', () => {
    expect(roundLabel(1)).toBe('1st Lap')
    expect(roundLabel(6)).toBe('6th Lap')
    expect(roundLabel(7)).toBe('7th Lap')
  })

  it('requires enough horses to fill a round', () => {
    expect(() => drawParticipants(horses.slice(0, 5), seededRng(1))).toThrow('10 horses')
  })
})
