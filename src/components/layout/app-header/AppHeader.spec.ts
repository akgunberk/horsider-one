import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from './AppHeader.vue'

const props = {
  status: 'Scheduled · Round 1 of 6',
  phase: 'SCHEDULED',
  canGenerate: true,
  canPrimary: true,
  generateLabel: 'Regenerate',
  primaryLabel: 'Start Race',
} as const

describe('AppHeader', () => {
  it('renders the brand, status and controls', () => {
    const wrapper = mount(AppHeader, { props })

    expect(wrapper.get('h1').text()).toBe('Horse Racing')
    expect(wrapper.text()).toContain('Scheduled · Round 1 of 6')

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(2)
    expect(buttons[0]?.text()).toContain('Regenerate')
    expect(buttons[0]?.attributes('aria-label')).toBe('Regenerate')
    expect(buttons[1]?.text()).toContain('Start Race')
  })

  it('emits generate and primary actions', async () => {
    const wrapper = mount(AppHeader, { props })
    const buttons = wrapper.findAll('button')

    await buttons[0]?.trigger('click')
    await buttons[1]?.trigger('click')

    expect(wrapper.emitted('generate')).toHaveLength(1)
    expect(wrapper.emitted('primary')).toHaveLength(1)
  })

  it('disables generate while running', () => {
    const wrapper = mount(AppHeader, {
      props: {
        ...props,
        phase: 'RUNNING',
        canGenerate: false,
        primaryLabel: 'Pause',
      },
    })

    const buttons = wrapper.findAll('button')

    expect(buttons[0]?.attributes('disabled')).toBeDefined()
    expect(buttons[1]?.text()).toContain('Pause')
  })
})
