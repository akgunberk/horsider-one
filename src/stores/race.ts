import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type {
  Horse,
  LaneRunner,
  ProgramRound,
  RacePhase,
  Round,
  RoundPlan,
  RoundRaceState,
  RoundResult,
  RoundStatus,
} from '@/types/race'
import { horseColors } from '@/data/horseColors'
import { horseNames } from '@/data/horseNames'
import type { RngFn } from '@/lib/random'
import { generateHorses, generateRounds, roundLabel } from '@/lib/generation'
import { createRoundRace, finishOrder, formatRaceTime, stepRound } from '@/lib/race'

export const INTERSTITIAL_SECONDS = 5

export const useRaceStore = defineStore('race', () => {
  const phase = ref<RacePhase>('IDLE')
  const horses = shallowRef<Horse[]>([])
  const rounds = shallowRef<RoundPlan[]>([])
  const results = shallowRef<RoundResult[]>([])
  const activeRound = ref(1)
  const raceState = shallowRef<RoundRaceState | null>(null)
  const interstitialRemaining = ref(0)
  const autoAdvancePaused = ref(false)

  const horsesById = computed(() => new Map(horses.value.map((horse) => [horse.id, horse])))

  const isGenerated = computed(() => horses.value.length > 0)

  const canGenerate = computed(
    () =>
      phase.value === 'IDLE' ||
      phase.value === 'SCHEDULED' ||
      phase.value === 'PAUSED' ||
      phase.value === 'FINISHED',
  )
  const canStart = computed(() => phase.value === 'SCHEDULED')
  const canPause = computed(() => phase.value === 'RUNNING')
  const canResume = computed(() => phase.value === 'PAUSED')
  const canResumeAutoAdvance = computed(
    () => phase.value === 'SCHEDULED' && autoAdvancePaused.value,
  )
  const isAutoAdvanceVisible = computed(
    () => phase.value === 'INTERSTITIAL' || canResumeAutoAdvance.value,
  )
  const canStartNow = computed(() => phase.value === 'INTERSTITIAL' || canResumeAutoAdvance.value)
  const canStopAutoAdvance = computed(() => phase.value === 'INTERSTITIAL')
  const canRace = computed(() => canStart.value || canPause.value || canResume.value)

  const generateLabel = computed(() => (phase.value === 'IDLE' ? 'Generate Program' : 'Regenerate'))
  const primaryLabel = computed(() => {
    if (phase.value === 'RUNNING') return 'Pause'
    if (phase.value === 'PAUSED') return 'Resume'
    return 'Start Race'
  })

  const statusLabel = computed(() => {
    switch (phase.value) {
      case 'SCHEDULED':
        return `Scheduled · Round ${activeRound.value} of 6`
      case 'RUNNING':
        return `Live · Round ${activeRound.value} of 6`
      case 'PAUSED':
        return `Paused · Round ${activeRound.value} of 6`
      case 'INTERSTITIAL':
        return `Next · Round ${activeRound.value} of 6`
      case 'FINISHED':
        return 'Finished'
      default:
        return 'Ready'
    }
  })

  function statusFor(round: number): RoundStatus {
    if (phase.value === 'IDLE') return 'upcoming'
    if (phase.value === 'FINISHED') return 'done'
    if (phase.value === 'SCHEDULED' || phase.value === 'INTERSTITIAL') {
      if (round < activeRound.value) return 'done'
      return round === activeRound.value ? 'ready' : 'upcoming'
    }
    if (round < activeRound.value) return 'done'
    if (round === activeRound.value) return 'running'
    return 'upcoming'
  }

  const roundViews = computed<Round[]>(() =>
    rounds.value.map((plan) => ({
      round: plan.round,
      label: roundLabel(plan.round),
      distance: plan.distance,
      status: statusFor(plan.round),
    })),
  )

  const activeRoundView = computed(
    () => roundViews.value.find((round) => round.round === activeRound.value) ?? null,
  )

  const activeParticipants = computed<Horse[]>(() => {
    const plan = rounds.value.find((round) => round.round === activeRound.value)
    if (!plan) return []

    return plan.horseIds
      .map((id) => horsesById.value.get(id))
      .filter((horse): horse is Horse => horse !== undefined)
  })

  const leaderRun = computed(() => {
    if (!raceState.value) return null
    return finishOrder(raceState.value)[0] ?? null
  })

  const leader = computed(() => {
    if (leaderRun.value) return horsesById.value.get(leaderRun.value.horseId) ?? null
    return activeParticipants.value[0] ?? null
  })

  const leaderElapsedSeconds = computed(() => {
    if (!raceState.value) return 0
    return leaderRun.value?.finishTime ?? raceState.value.elapsed
  })

  const leaderElapsedLabel = computed(() => formatRaceTime(leaderElapsedSeconds.value))

  const laneRunners = computed<LaneRunner[]>(() => {
    const distance = activeRoundView.value?.distance ?? 0
    const runners = raceState.value?.runners

    return activeParticipants.value.map((horse, index) => {
      const runner = runners?.find((entry) => entry.horseId === horse.id)
      const progress =
        runner && distance > 0 ? Math.min(100, (runner.position / distance) * 100) : 0

      return {
        lane: index + 1,
        number: horse.id,
        name: horse.name,
        color: horse.color,
        progress,
      }
    })
  })

  const interstitialProgress = computed(() =>
    Math.min(100, Math.max(0, (1 - interstitialRemaining.value / INTERSTITIAL_SECONDS) * 100)),
  )

  const countdownLabel = computed(() => `in ${Math.ceil(interstitialRemaining.value)}s`)
  const autoAdvanceCountdownLabel = computed(() =>
    autoAdvancePaused.value ? 'stopped' : countdownLabel.value,
  )

  const nextRoundLabel = computed(() =>
    activeRoundView.value
      ? `${activeRoundView.value.label} · ${activeRoundView.value.distance}m`
      : '',
  )

  const programRounds = computed<ProgramRound[]>(() =>
    rounds.value.map((plan) => ({
      round: {
        round: plan.round,
        label: roundLabel(plan.round),
        distance: plan.distance,
        status: statusFor(plan.round),
      },
      entries: plan.horseIds.flatMap((id) => {
        const horse = horsesById.value.get(id)
        if (!horse) return []

        return [
          {
            number: horse.id,
            name: horse.name,
            color: horse.color,
            time: `#${horse.id}`,
          },
        ]
      }),
    })),
  )

  function beginRound(): boolean {
    const participants = activeParticipants.value
    if (participants.length === 0) return false

    raceState.value = createRoundRace(participants)
    interstitialRemaining.value = 0
    autoAdvancePaused.value = false
    phase.value = 'RUNNING'
    return true
  }

  function recordResult(state: RoundRaceState): void {
    const view = activeRoundView.value
    if (!view) return

    const entries = finishOrder(state).flatMap((runner) => {
      const horse = horsesById.value.get(runner.horseId)
      if (!horse) return []

      return [
        {
          number: horse.id,
          name: horse.name,
          color: horse.color,
          time: formatRaceTime(runner.finishTime ?? 0),
        },
      ]
    })

    results.value = [...results.value, { round: { ...view, status: 'done' }, entries }]
  }

  function completeRound(state: RoundRaceState): void {
    recordResult(state)

    if (activeRound.value >= 6) {
      phase.value = 'FINISHED'
      interstitialRemaining.value = 0
      autoAdvancePaused.value = false
      return
    }

    activeRound.value += 1
    phase.value = 'INTERSTITIAL'
    interstitialRemaining.value = INTERSTITIAL_SECONDS
    autoAdvancePaused.value = false
    raceState.value = null
  }

  function tick(dt: number, rng: RngFn = Math.random): boolean {
    if (dt <= 0) return false

    if (phase.value === 'INTERSTITIAL') {
      interstitialRemaining.value = Math.max(0, interstitialRemaining.value - dt)
      if (interstitialRemaining.value === 0) return beginRound()
      return true
    }

    if (phase.value !== 'RUNNING' || !raceState.value || !activeRoundView.value) return false

    const nextState = stepRound(raceState.value, activeRoundView.value.distance, dt, rng)
    raceState.value = nextState

    if (nextState.allFinished) completeRound(nextState)
    return true
  }

  function generate(rng: RngFn = Math.random): boolean {
    if (!canGenerate.value) return false

    const nextHorses = generateHorses(horseNames, horseColors, rng)
    horses.value = nextHorses
    rounds.value = generateRounds(nextHorses, rng)
    results.value = []
    raceState.value = null
    interstitialRemaining.value = 0
    autoAdvancePaused.value = false
    activeRound.value = 1
    phase.value = 'SCHEDULED'
    return true
  }

  function ensureGenerated(rng: RngFn = Math.random): void {
    if (phase.value === 'IDLE' && !isGenerated.value) generate(rng)
  }

  function start(): boolean {
    if (!canStart.value) return false
    return beginRound()
  }

  function pause(): boolean {
    if (!canPause.value) return false
    phase.value = 'PAUSED'
    return true
  }

  function resume(): boolean {
    if (!canResume.value) return false
    phase.value = 'RUNNING'
    return true
  }

  function startNow(): boolean {
    if (!canStartNow.value) return false
    return beginRound()
  }

  function stopAutoAdvance(): boolean {
    if (!canStopAutoAdvance.value) return false
    autoAdvancePaused.value = true
    phase.value = 'SCHEDULED'
    return true
  }

  function resumeAutoAdvance(): boolean {
    if (!canResumeAutoAdvance.value) return false
    if (interstitialRemaining.value <= 0) interstitialRemaining.value = INTERSTITIAL_SECONDS
    autoAdvancePaused.value = false
    phase.value = 'INTERSTITIAL'
    return true
  }

  function triggerPrimary(): boolean {
    if (canStart.value) return start()
    if (canPause.value) return pause()
    if (canResume.value) return resume()
    return false
  }

  return {
    phase,
    horses,
    rounds,
    results,
    activeRound,
    raceState,
    interstitialRemaining,
    isGenerated,
    canGenerate,
    canStart,
    canPause,
    canResume,
    autoAdvancePaused,
    canResumeAutoAdvance,
    isAutoAdvanceVisible,
    canStartNow,
    canStopAutoAdvance,
    autoAdvanceCountdownLabel,
    canRace,
    generateLabel,
    primaryLabel,
    statusLabel,
    roundViews,
    activeRoundView,
    activeParticipants,
    leader,
    leaderElapsedSeconds,
    leaderElapsedLabel,
    laneRunners,
    interstitialProgress,
    countdownLabel,
    nextRoundLabel,
    programRounds,
    generate,
    ensureGenerated,
    start,
    pause,
    resume,
    startNow,
    stopAutoAdvance,
    resumeAutoAdvance,
    tick,
    triggerPrimary,
  }
})
