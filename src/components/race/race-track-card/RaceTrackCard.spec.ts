import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { LaneRunner, Round } from '@/types/race'
import RaceTrackCard from './RaceTrackCard.vue'

const round: Round = { round: 3, label: '3rd Lap', distance: 1600, status: 'running' }

const lanes: LaneRunner[] = [
  { lane: 1, number: 4, name: 'Frankel', color: '#c82829', progress: 72 },
  { lane: 2, number: 9, name: 'Zenyatta', color: '#8e24aa', progress: 58 },
]

describe('RaceTrackCard', () => {
  it('renders the live round, leader, time and lanes', () => {
    const wrapper = mount(RaceTrackCard, {
      props: { round, lanes, leader: 'Frankel (#4)', time: '0:41.20' },
    })

    expect(wrapper.text()).toContain('Round 3 of 6')
    expect(wrapper.text()).toContain('3rd Lap · 1600m')
    expect(wrapper.text()).toContain('Leader · Frankel (#4)')
    expect(wrapper.text()).toContain('0:41.20')
    expect(wrapper.text()).toContain('Finish')
    expect(wrapper.findAll('[role="progressbar"]')).toHaveLength(2)
  })

  it('renders the compact mobile header', () => {
    const wrapper = mount(RaceTrackCard, {
      props: { round, lanes, leader: 'Frankel (#4)', time: '0:41.20', compact: true },
    })

    expect(wrapper.text()).toContain('2 Horses')
    expect(wrapper.text()).not.toContain('Round 3 of 6')
  })

  it('computes distance ruler markers from the active round distance', () => {
    const wrapper = mount(RaceTrackCard, {
      props: {
        round: { round: 6, label: '6th Lap', distance: 2200, status: 'running' },
        lanes,
        leader: 'Frankel (#4)',
        time: '0:41.20',
      },
    })

    expect(wrapper.text()).toContain('0m')
    expect(wrapper.text()).toContain('550m')
    expect(wrapper.text()).toContain('1100m')
    expect(wrapper.text()).toContain('1650m')
    expect(wrapper.text()).toContain('Finish')
  })
})
