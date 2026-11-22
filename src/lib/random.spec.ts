import { describe, expect, it } from 'vitest'
import { randomInt, shuffle } from './random'
import { sequenceRng, seededRng } from '@/test/rng'

describe('randomInt', () => {
  it('includes both bounds', () => {
    expect(randomInt(1, 100, () => 0)).toBe(1)
    expect(randomInt(1, 100, () => 0.999999)).toBe(100)
  })

  it('is deterministic for a seeded rng', () => {
    const first = randomInt(1, 100, seededRng(7))
    const second = randomInt(1, 100, seededRng(7))

    expect(first).toBe(second)
  })
})

describe('shuffle', () => {
  it('does not mutate the source array', () => {
    const source = [1, 2, 3, 4, 5]
    const result = shuffle(source, sequenceRng([0.1, 0.9, 0.4]))

    expect(source).toEqual([1, 2, 3, 4, 5])
    expect(result).not.toBe(source)
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('is deterministic for a seeded rng', () => {
    const source = ['a', 'b', 'c', 'd', 'e']

    expect(shuffle(source, seededRng(3))).toEqual(shuffle(source, seededRng(3)))
  })

  it('handles empty and single-item arrays', () => {
    expect(shuffle([], () => 0)).toEqual([])
    expect(shuffle(['only'], () => 0)).toEqual(['only'])
  })
})
