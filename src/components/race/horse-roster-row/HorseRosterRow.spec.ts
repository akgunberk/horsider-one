import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseRosterRow from './HorseRosterRow.vue'

describe('HorseRosterRow', () => {
  it('renders rank, name, color and condition', () => {
    const wrapper = mount(HorseRosterRow, {
      props: { rank: 4, name: 'Frankel', color: '#c82829', condition: 99 },
    })

    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('Frankel')
    expect(wrapper.text()).toContain('99')
    expect(wrapper.get('[style*="background-color"]').attributes('style')).toContain(
      'rgb(200, 40, 41)',
    )
    expect(wrapper.get('[style*="width"]').attributes('style')).toContain('width: 99%')
  })
})
