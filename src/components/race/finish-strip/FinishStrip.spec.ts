import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FinishStrip from './FinishStrip.vue'

describe('FinishStrip', () => {
  it('renders a decorative checkered strip', () => {
    const wrapper = mount(FinishStrip, { attrs: { class: 'h-full' } })

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.classes()).toContain('finish-checkered')
    expect(wrapper.classes()).toContain('h-full')
  })
})
