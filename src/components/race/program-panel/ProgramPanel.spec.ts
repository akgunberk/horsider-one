import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ProgramRound } from '@/types/race'
import ProgramPanel from './ProgramPanel.vue'

const program: ProgramRound[] = [
  {
    round: { round: 1, label: '1st Lap', distance: 1200, status: 'done' },
    entries: [{ number: 4, color: '#c82829', name: 'Runner 1-1', time: '#4' }],
  },
  {
    round: { round: 2, label: '2nd Lap', distance: 1400, status: 'upcoming' },
    entries: [{ number: 9, color: '#8e24aa', name: 'Runner 2-1', time: '#9' }],
  },
]

describe('ProgramPanel', () => {
  it('expands the active round by default', () => {
    const wrapper = mount(ProgramPanel, { props: { rounds: program, activeRound: 1 } })

    const details = wrapper.findAll('details')

    expect(details).toHaveLength(2)
    expect(details[0]?.attributes('open')).toBeDefined()
    expect(details[1]?.attributes('open')).toBeUndefined()
    expect(wrapper.text()).toContain('Done')
    expect(wrapper.text()).toContain('Upcoming')
    expect(wrapper.text()).toContain('Runner 1-1')
  })
})
