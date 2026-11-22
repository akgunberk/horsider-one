import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LaneProgress from './LaneProgress.vue'

describe('LaneProgress', () => {
  it('reports clamped progress and an accessible label', () => {
    const wrapper = mount(LaneProgress, {
      props: {
        lane: 2,
        number: 4,
        name: 'Frankel',
        color: '#3B82F6',
        progress: 150,
      },
    })

    const progressbar = wrapper.get('[role="progressbar"]')

    expect(progressbar.attributes('aria-valuenow')).toBe('100')
    expect(progressbar.attributes('aria-label')).toBe('Lane 2, Frankel')
  })

  it('hides the name in compact mode', () => {
    const wrapper = mount(LaneProgress, {
      props: {
        lane: 2,
        number: 4,
        name: 'Frankel',
        color: '#3B82F6',
        progress: 40,
        compact: true,
      },
    })

    expect(wrapper.text()).not.toContain('Frankel')
  })

  it('clamps negative progress and omits the name from the label', () => {
    const wrapper = mount(LaneProgress, {
      props: { lane: 3, number: 7, color: '#3B82F6', progress: -20 },
    })

    const progressbar = wrapper.get('[role="progressbar"]')

    expect(progressbar.attributes('aria-valuenow')).toBe('0')
    expect(progressbar.attributes('aria-label')).toBe('Lane 3')
  })
})
