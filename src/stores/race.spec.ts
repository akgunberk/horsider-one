import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { seededRng, sequenceRng } from '@/test/rng'
import { useRaceStore } from './race'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useRaceStore', () => {
  it('starts idle without a roster', () => {
    const store = useRaceStore()

    expect(store.phase).toBe('IDLE')
    expect(store.isGenerated).toBe(false)
    expect(store.horses).toHaveLength(0)
    expect(store.canGenerate).toBe(true)
    expect(store.canStart).toBe(false)
    expect(store.canRace).toBe(false)
    expect(store.statusLabel).toBe('Ready')
    expect(store.activeRoundView).toBeNull()
    expect(store.activeParticipants).toEqual([])
    expect(store.leader).toBeNull()
    expect(store.laneRunners).toEqual([])
    expect(store.programRounds).toEqual([])
    expect(store.nextRoundLabel).toBe('')
    expect(store.triggerPrimary()).toBe(false)
  })

  it('auto-generates once from idle', () => {
    const store = useRaceStore()
    store.ensureGenerated(seededRng(1))

    expect(store.phase).toBe('SCHEDULED')
    expect(store.horses).toHaveLength(20)
    expect(store.rounds).toHaveLength(6)
    expect(store.activeRound).toBe(1)
    expect(store.results).toEqual([])

    const firstHorse = store.horses[0]?.name
    store.ensureGenerated(seededRng(2))
    expect(store.horses[0]?.name).toBe(firstHorse)
  })

  it('generates a full roster and round draws', () => {
    const store = useRaceStore()

    expect(store.generate(seededRng(1))).toBe(true)
    expect(store.phase).toBe('SCHEDULED')
    expect(store.horses).toHaveLength(20)
    expect(store.rounds).toHaveLength(6)
    expect(store.roundViews).toHaveLength(6)
    expect(store.activeParticipants).toHaveLength(10)
    expect(store.laneRunners).toHaveLength(10)
    expect(store.laneRunners.every((lane) => lane.progress === 0)).toBe(true)
    expect(store.programRounds).toHaveLength(6)
    expect(store.programRounds.every((round) => round.entries.length === 10)).toBe(true)
    expect(store.leader).toEqual(store.activeParticipants[0])
  })

  it('marks the active round ready and the rest upcoming', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))

    expect(store.roundViews.map((round) => round.status)).toEqual([
      'ready',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
    ])
    expect(store.statusLabel).toBe('Scheduled · Round 1 of 6')
  })

  it('regenerates while scheduled', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    const firstRoster = store.horses.map((horse) => horse.name)

    expect(store.generate(seededRng(2))).toBe(true)
    expect(store.horses).toHaveLength(20)
    expect(store.horses.map((horse) => horse.name)).not.toEqual(firstRoster)
  })

  it('runs the start, pause and resume transitions', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))

    expect(store.start()).toBe(true)
    expect(store.phase).toBe('RUNNING')
    expect(store.statusLabel).toBe('Live · Round 1 of 6')
    expect(store.roundViews[0]?.status).toBe('running')

    expect(store.pause()).toBe(true)
    expect(store.phase).toBe('PAUSED')
    expect(store.statusLabel).toBe('Paused · Round 1 of 6')

    expect(store.resume()).toBe(true)
    expect(store.phase).toBe('RUNNING')
  })

  it('blocks generation while running', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    const roster = store.horses.map((horse) => horse.name)

    expect(store.canGenerate).toBe(false)
    expect(store.generate(seededRng(2))).toBe(false)
    expect(store.horses.map((horse) => horse.name)).toEqual(roster)
  })

  it('regenerates from pause, returning to scheduled', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.pause()

    expect(store.canGenerate).toBe(true)
    expect(store.generate(seededRng(3))).toBe(true)
    expect(store.phase).toBe('SCHEDULED')
    expect(store.activeRound).toBe(1)
  })

  it('drives the primary action through the race phases', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))

    expect(store.triggerPrimary()).toBe(true)
    expect(store.phase).toBe('RUNNING')
    expect(store.triggerPrimary()).toBe(true)
    expect(store.phase).toBe('PAUSED')
    expect(store.triggerPrimary()).toBe(true)
    expect(store.phase).toBe('RUNNING')
    expect(store.primaryLabel).toBe('Pause')
  })

  it('derives done rounds after advancing', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.activeRound = 2

    expect(store.roundViews[0]?.status).toBe('done')
    expect(store.roundViews[1]?.status).toBe('running')
    expect(store.roundViews[2]?.status).toBe('upcoming')
  })

  it('allows regeneration from the finished phase', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.phase = 'FINISHED'

    expect(store.statusLabel).toBe('Finished')
    expect(store.roundViews.every((round) => round.status === 'done')).toBe(true)
    expect(store.canGenerate).toBe(true)
    expect(store.generate(seededRng(4))).toBe(true)
    expect(store.phase).toBe('SCHEDULED')
  })

  it('exposes exact sequence outcomes', () => {
    const store = useRaceStore()
    store.generate(sequenceRng([0, 0.999]))

    expect(store.horses.every((horse) => horse.condition === 1 || horse.condition === 100)).toBe(
      true,
    )
  })

  it('moves runners and derives the live leader', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()

    const before = store.laneRunners.map((lane) => lane.progress)

    expect(store.tick(1, () => 0.5)).toBe(true)
    expect(store.laneRunners.some((lane) => lane.progress > 0)).toBe(true)
    expect(store.laneRunners.map((lane) => lane.progress)).not.toEqual(before)
    expect(store.leader).not.toBeNull()
    expect(store.leaderElapsedSeconds).toBe(1)
    expect(store.leaderElapsedLabel).toBe('0:01.00')
  })

  it('freezes progress while paused', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.tick(1, () => 0.5)
    store.pause()

    const frozen = store.laneRunners.map((lane) => lane.progress)

    expect(store.tick(5, () => 0.5)).toBe(false)
    expect(store.laneRunners.map((lane) => lane.progress)).toEqual(frozen)

    store.resume()
    expect(store.tick(1, () => 0.5)).toBe(true)
  })

  it('records a finished round and enters the interstitial', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()

    expect(store.tick(100, seededRng(2))).toBe(true)

    expect(store.phase).toBe('INTERSTITIAL')
    expect(store.statusLabel).toBe('Next · Round 2 of 6')
    expect(store.activeRound).toBe(2)
    expect(store.results).toHaveLength(1)
    expect(store.results[0]?.entries).toHaveLength(10)
    expect(store.interstitialRemaining).toBe(5)
    expect(store.countdownLabel).toBe('in 5s')
    expect(store.nextRoundLabel).toBe('2nd Lap · 1400m')
    expect(store.canGenerate).toBe(false)
    expect(store.canStartNow).toBe(true)
    expect(store.laneRunners.every((lane) => lane.progress === 0)).toBe(true)
  })

  it('keeps the auto-advance bar visible after stopping', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.tick(100, seededRng(2))

    expect(store.stopAutoAdvance()).toBe(true)
    expect(store.phase).toBe('SCHEDULED')
    expect(store.activeRound).toBe(2)
    expect(store.canStart).toBe(true)
    expect(store.autoAdvancePaused).toBe(true)
    expect(store.isAutoAdvanceVisible).toBe(true)
    expect(store.canResumeAutoAdvance).toBe(true)
    expect(store.canStartNow).toBe(true)
    expect(store.autoAdvanceCountdownLabel).toBe('stopped')
  })

  it('resumes the countdown from where it stopped', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.tick(100, seededRng(2))
    store.tick(2, seededRng(3))
    store.stopAutoAdvance()

    const remaining = store.interstitialRemaining

    expect(store.resumeAutoAdvance()).toBe(true)
    expect(store.phase).toBe('INTERSTITIAL')
    expect(store.autoAdvancePaused).toBe(false)
    expect(store.interstitialRemaining).toBe(remaining)
    expect(store.autoAdvanceCountdownLabel).toBe('in 3s')
  })

  it('starts the next round from the paused auto-advance state', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.tick(100, seededRng(2))
    store.stopAutoAdvance()

    expect(store.startNow()).toBe(true)
    expect(store.phase).toBe('RUNNING')
    expect(store.autoAdvancePaused).toBe(false)
    expect(store.isAutoAdvanceVisible).toBe(false)
  })

  it('starts the next round immediately', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.tick(100, seededRng(2))

    expect(store.startNow()).toBe(true)
    expect(store.phase).toBe('RUNNING')
    expect(store.activeRound).toBe(2)
    expect(store.raceState?.runners).toHaveLength(10)
  })

  it('auto-advances when the countdown expires', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()
    store.tick(100, seededRng(2))

    expect(store.tick(2.5, seededRng(3))).toBe(true)
    expect(store.interstitialProgress).toBeCloseTo(50)
    expect(store.phase).toBe('INTERSTITIAL')

    expect(store.tick(2.5, seededRng(3))).toBe(true)
    expect(store.phase).toBe('RUNNING')
    expect(store.activeRound).toBe(2)
  })

  it('finishes after round six and keeps final positions', () => {
    const store = useRaceStore()
    store.generate(seededRng(1))
    store.start()

    for (let round = 1; round <= 5; round += 1) {
      store.tick(100, seededRng(round))
      store.tick(5, seededRng(round))
    }

    expect(store.phase).toBe('RUNNING')
    expect(store.activeRound).toBe(6)

    store.tick(100, seededRng(9))

    expect(store.phase).toBe('FINISHED')
    expect(store.statusLabel).toBe('Finished')
    expect(store.results).toHaveLength(6)
    expect(store.results.every((result) => result.entries.length === 10)).toBe(true)
    expect(store.laneRunners.every((lane) => lane.progress === 100)).toBe(true)
    expect(store.canGenerate).toBe(true)
  })
})
