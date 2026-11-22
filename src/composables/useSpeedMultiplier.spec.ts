import { describe, expect, it } from 'vitest'
import { useSpeedMultiplier } from './useSpeedMultiplier'

describe('useSpeedMultiplier', () => {
  it('defaults to real time', () => {
    expect(useSpeedMultiplier('')).toBe(1)
    expect(useSpeedMultiplier('?speed=')).toBe(1)
  })

  it('parses and clamps the query parameter', () => {
    expect(useSpeedMultiplier('?speed=120')).toBe(120)
    expect(useSpeedMultiplier('?speed=0.5')).toBe(0.5)
    expect(useSpeedMultiplier('?speed=9999')).toBe(500)
  })

  it('ignores invalid values', () => {
    expect(useSpeedMultiplier('?speed=abc')).toBe(1)
    expect(useSpeedMultiplier('?speed=0')).toBe(1)
    expect(useSpeedMultiplier('?speed=-4')).toBe(1)
  })
})
