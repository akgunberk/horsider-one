import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AutoAdvanceBar from './AutoAdvanceBar.vue'

describe('AutoAdvanceBar', () => {
  it('renders the next round and countdown', () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: { next: '4th Lap · 1800m', countdown: 'in 5s' },
    })

    expect(wrapper.text()).toContain('4th Lap · 1800m')
    expect(wrapper.text()).toContain('in 5s')
  })

  it('emits stop and start from the desktop actions', async () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: { next: '4th Lap · 1800m', countdown: 'in 5s' },
    })

    const buttons = wrapper.findAll('button')
    const stop = buttons[0]
    const start = buttons[1]

    if (!stop || !start) throw new Error('Expected stop and start buttons')

    await stop.trigger('click')
    await start.trigger('click')

    expect(wrapper.emitted('stop')).toHaveLength(1)
    expect(wrapper.emitted('start')).toHaveLength(1)
  })

  it('exposes an accessible label on the compact stop button', () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: { next: '4th Lap · 1800m', countdown: 'in 5s', compact: true },
    })

    expect(wrapper.get('[aria-label="Stop Auto-Advance"]')).toBeTruthy()
  })

  it('renders clamped countdown progress', () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: { next: '4th Lap · 1800m', countdown: 'in 5s', progress: 150, compact: true },
    })

    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
  })

  it('clamps negative countdown progress', () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: { next: '4th Lap · 1800m', countdown: 'in 5s', progress: -10 },
    })

    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  })

  it('shows a resume action when paused', async () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: { next: '4th Lap · 1800m', countdown: 'stopped', paused: true },
    })

    expect(wrapper.text()).toContain('Resume Auto-Advance')
    expect(wrapper.text()).not.toContain('Stop Auto-Advance')

    const resume = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Resume Auto-Advance'))

    await resume?.trigger('click')

    expect(wrapper.emitted('resume')).toHaveLength(1)
    expect(wrapper.emitted('stop')).toBeUndefined()
  })

  it('exposes a resume label on the compact paused action', async () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: { next: '4th Lap · 1800m', countdown: 'stopped', paused: true, compact: true },
    })

    const resume = wrapper.get('[aria-label="Resume Auto-Advance"]')

    await resume.trigger('click')

    expect(wrapper.emitted('resume')).toHaveLength(1)
  })

  it('emits from the compact actions and respects reduced motion', async () => {
    const wrapper = mount(AutoAdvanceBar, {
      props: {
        next: '4th Lap · 1800m',
        countdown: 'in 5s',
        progress: 50,
        compact: true,
        reduced: true,
      },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0]?.trigger('click')
    await buttons[1]?.trigger('click')

    expect(wrapper.emitted('stop')).toHaveLength(1)
    expect(wrapper.emitted('start')).toHaveLength(1)
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('50')
  })
})
