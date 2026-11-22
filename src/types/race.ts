import type { LapEntry } from '@/components/race/types'

export type RacePhase = 'IDLE' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'INTERSTITIAL' | 'FINISHED'

/** Horse roster entry. */
export interface Horse {
  id: number
  name: string
  color: string
  /** Static condition, 1-100. */
  condition: number
}

/** Runner shown in a track lane. */
export interface LaneRunner {
  lane: number
  number: number
  name: string
  color: string
  /** Race progress, 0-100. */
  progress: number
}

export type RoundStatus = 'done' | 'ready' | 'running' | 'upcoming'

export interface Round {
  round: number
  label: string
  distance: number
  status: RoundStatus
}

/** Stored round draw: ids reference the generated roster. */
export interface RoundPlan {
  round: number
  distance: number
  horseIds: number[]
}

/** Live simulation state for one runner. */
export interface RunnerState {
  horseId: number
  lane: number
  condition: number
  /** Meters covered in the current round. */
  position: number
  /** Exact finish time in seconds, null until crossing. */
  finishTime: number | null
}

/** Live simulation state for the active round. */
export interface RoundRaceState {
  elapsed: number
  runners: RunnerState[]
  allFinished: boolean
}

export interface ProgramRound {
  round: Round
  entries: LapEntry[]
}

export interface RoundResult {
  round: Round
  entries: LapEntry[]
}
