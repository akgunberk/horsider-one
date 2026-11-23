import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { ProgramRound, RoundResult } from '@/types/race'
import ProgramResultsPanel from './ProgramResultsPanel.vue'

const program: ProgramRound[] = [
  {
    round: { round: 3, label: '3rd Lap', distance: 1600, status: 'running' },
    entries: [{ number: 4, color: '#c82829', name: 'Program Runner', meta: '#4' }],
  },
]

const results: RoundResult[] = [
  {
    round: { round: 1, label: '1st Lap', distance: 1200, status: 'done' },
    entries: [{ number: 4, color: '#c82829', name: 'Result Runner', meta: '2:12.40' }],
  },
]

const props = {
  program,
  results,
  activeRound: 3,
  current: '3rd Lap · 1600m',
}

describe('ProgramResultsPanel', () => {
  it('shows the program by default and switches to results', async () => {
    const wrapper = mount(ProgramResultsPanel, { props })

    expect(wrapper.text()).toContain('Program Runner')

    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs).toHaveLength(2)

    await tabs[1]?.trigger('mousedown')
    await nextTick()

    expect(wrapper.text()).toContain('Result Runner')
    expect(wrapper.text()).toContain('2:12.40')
  })
})
