import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressRow from './ProgressRow.vue'

describe('ProgressRow', () => {
  it('clamps progress to 100 and renders the rounded value', () => {
    const wrapper = mount(ProgressRow, {
      props: { rank: 1, color: '#c82829', name: 'Frankel', progress: 150 },
    })

    expect(wrapper.text()).toContain('Frankel')
    expect(wrapper.text()).toContain('100')
    expect(wrapper.get('[style*="width"]').attributes('style')).toContain('width: 100%')
  })

  it('rounds partial progress', () => {
    const wrapper = mount(ProgressRow, {
      props: { rank: 2, color: '#8e24aa', name: 'Zenyatta', progress: 42.4 },
    })

    expect(wrapper.text()).toContain('42')
  })
})
