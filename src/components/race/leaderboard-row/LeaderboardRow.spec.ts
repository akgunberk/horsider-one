import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LeaderboardRow from './LeaderboardRow.vue'

describe('LeaderboardRow', () => {
  it('renders rank, horse and finish time', () => {
    const wrapper = mount(LeaderboardRow, {
      props: { rank: 1, color: '#c82829', name: 'Frankel', time: '2:12.40' },
    })

    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('Frankel')
    expect(wrapper.text()).toContain('2:12.40')
    expect(wrapper.get('[style*="background-color"]').attributes('style')).toContain(
      'rgb(200, 40, 41)',
    )
    expect(wrapper.classes()).not.toContain('border-t')
  })

  it('draws a divider when requested', () => {
    const wrapper = mount(LeaderboardRow, {
      props: { rank: 2, color: '#8e24aa', name: 'Zenyatta', time: '2:13.95', divider: true },
    })

    expect(wrapper.classes()).toContain('border-t')
  })
})
