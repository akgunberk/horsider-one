import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { RoundResult } from '@/types/race'
import ResultsPanel from './ResultsPanel.vue'

const results: RoundResult[] = [
  {
    round: { round: 1, label: '1st Lap', distance: 1200, status: 'done' },
    entries: [
      { number: 4, color: '#c82829', name: 'Frankel', meta: '1:30.00' },
      { number: 9, color: '#8e24aa', name: 'Zenyatta', meta: '1:31.20' },
    ],
  },
]

describe('ResultsPanel', () => {
  it('renders completed rounds and the in-progress label', () => {
    const wrapper = mount(ResultsPanel, {
      props: { results, current: '3rd Lap · 1600m' },
    })

    expect(wrapper.text()).toContain('1st Lap')
    expect(wrapper.text()).toContain('Final')
    expect(wrapper.text()).toContain('Frankel')
    expect(wrapper.text()).toContain('1:31.20')
    expect(wrapper.text()).toContain('3rd Lap · 1600m in progress')
  })
})
