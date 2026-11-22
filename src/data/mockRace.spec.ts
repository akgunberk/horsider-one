import { describe, expect, it } from 'vitest'
import {
  countdown,
  currentRound,
  headerStatus,
  horses,
  lanes,
  leader,
  leaderTime,
  nextRoundLabel,
  programRounds,
  results,
  rounds,
} from './mockRace'

describe('mockRace', () => {
  it('provides a complete race demo snapshot', () => {
    expect(horses).toHaveLength(20)
    expect(new Set(horses.map((horse) => horse.name)).size).toBe(20)
    expect(new Set(horses.map((horse) => horse.color)).size).toBe(20)
    expect(horses.every((horse) => horse.condition >= 1 && horse.condition <= 100)).toBe(true)

    expect(rounds).toHaveLength(6)
    expect(currentRound.status).toBe('running')

    expect(lanes).toHaveLength(10)
    expect(programRounds).toHaveLength(6)
    expect(programRounds.every((round) => round.entries.length === 10)).toBe(true)

    expect(results).toHaveLength(2)
    expect(results.every((round) => round.entries.length === 10)).toBe(true)

    expect(leader.number).toBe(4)
    expect(leaderTime).toBe('0:41.20')
    expect(nextRoundLabel).toBe('4th Lap · 1800m')
    expect(countdown).toBe('in 5s')
    expect(headerStatus).toBe('Live · Round 3 of 6')
  })
})
