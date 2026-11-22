import type { Horse, LaneRunner, ProgramRound, Round, RoundResult } from '@/types/race'
import { horseColors } from './horseColors'

const NAMES = [
  'Secretariat',
  'Seabiscuit',
  "Man o' War",
  'Frankel',
  'Phar Lap',
  'Winx',
  'Red Rum',
  'Arkle',
  'Zenyatta',
  'Citation',
  'Kelso',
  'Shergar',
  'Northern Dancer',
  'Black Caviar',
  'Enable',
  'American Pharoah',
  'Sea The Stars',
  'Ruffian',
  'Seattle Slew',
  'Gallant Fox',
]

const CONDITIONS = [70, 36, 54, 99, 60, 24, 80, 37, 92, 50, 33, 18, 98, 67, 74, 58, 85, 44, 29, 63]

export const horses: Horse[] = NAMES.map((name, index) => ({
  id: index + 1,
  name,
  condition: CONDITIONS[index] ?? 50,
  color: horseColors[index] ?? '#000000',
}))

function horseById(id: number): Horse {
  const horse = horses.find((entry) => entry.id === id)
  if (!horse) throw new Error(`Unknown horse ${id}`)
  return horse
}

/** Horse ids drawn for each round, in lane order. */
const SELECTIONS: number[][] = [
  [4, 9, 17, 16, 1, 6, 13, 2, 10, 14],
  [3, 7, 15, 8, 5, 19, 11, 20, 12, 18],
  [4, 9, 17, 16, 1, 6, 13, 2, 10, 14],
  [3, 7, 15, 8, 5, 19, 11, 20, 12, 18],
  [13, 1, 9, 4, 16, 10, 6, 2, 14, 17],
  [5, 8, 12, 19, 3, 20, 7, 11, 18, 15],
]

export const currentRound: Round = {
  round: 3,
  label: '3rd Lap',
  distance: 1600,
  status: 'running',
}

export const rounds: Round[] = [
  { round: 1, label: '1st Lap', distance: 1200, status: 'done' },
  { round: 2, label: '2nd Lap', distance: 1400, status: 'done' },
  currentRound,
  { round: 4, label: '4th Lap', distance: 1800, status: 'upcoming' },
  { round: 5, label: '5th Lap', distance: 2000, status: 'upcoming' },
  { round: 6, label: '6th Lap', distance: 2200, status: 'upcoming' },
]

const LANE_PROGRESS = [72, 68, 65, 61, 58, 54, 49, 45, 41, 37]

export const lanes: LaneRunner[] = (SELECTIONS[2] ?? []).map((id, index) => {
  const horse = horseById(id)
  return {
    lane: index + 1,
    number: horse.id,
    name: horse.name,
    color: horse.color,
    progress: LANE_PROGRESS[index] ?? 50,
  }
})

const leaderHorse = horseById(4)

export const leader = {
  name: leaderHorse.name,
  number: leaderHorse.id,
  color: leaderHorse.color,
  lap: currentRound.round,
}

export const headerStatus = 'Live · Round 3 of 6'

export const nextRoundLabel = '4th Lap · 1800m'

export const countdown = 'in 5s'

export const leaderTime = '0:41.20'

function finishTime(distance: number, index: number): string {
  const total = distance * 0.075 + index * 1.65
  const minutes = Math.floor(total / 60)
  const seconds = (total % 60).toFixed(2).padStart(5, '0')
  return `${minutes}:${seconds}`
}

export const programRounds: ProgramRound[] = rounds.map((round) => ({
  round,
  entries: (SELECTIONS[round.round - 1] ?? []).map((id) => {
    const horse = horseById(id)
    return {
      number: horse.id,
      name: horse.name,
      color: horse.color,
      time: `#${horse.id}`,
    }
  }),
}))

export const results: RoundResult[] = rounds
  .filter((round) => round.status === 'done')
  .map((round) => ({
    round,
    entries: (SELECTIONS[round.round - 1] ?? []).map((id, index) => {
      const horse = horseById(id)
      return {
        number: horse.id,
        name: horse.name,
        color: horse.color,
        time: finishTime(round.distance, index),
      }
    }),
  }))
