import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { LapEntry } from '../types'
import LapLeaderboardCard from './LapLeaderboardCard.vue'

const entries: LapEntry[] = [
  { number: 4, color: '#c82829', name: 'Frankel', time: '2:12.40' },
  { number: 9, color: '#8e24aa', name: 'Zenyatta', time: '2:13.95' },
]

describe('LapLeaderboardCard', () => {
  it('renders the round heading and ranked entries', () => {
    const wrapper = mount(LapLeaderboardCard, {
      props: { title: '1st Lap', distance: '1200m', status: 'Final', entries },
    })

    expect(wrapper.text()).toContain('1st Lap')
    expect(wrapper.text()).toContain('1200m')
    expect(wrapper.text()).toContain('Final')
    expect(wrapper.text()).toContain('Frankel')
    expect(wrapper.text()).toContain('2:13.95')
  })
})
