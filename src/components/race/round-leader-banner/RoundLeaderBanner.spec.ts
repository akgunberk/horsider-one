import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RoundLeaderBanner from './RoundLeaderBanner.vue'

describe('RoundLeaderBanner', () => {
  it('renders the round leader and lap badge', () => {
    const wrapper = mount(RoundLeaderBanner, {
      props: { name: 'Frankel', number: 4, color: '#c82829', lap: 3 },
    })

    expect(wrapper.text()).toContain('Round Leader:')
    expect(wrapper.text()).toContain('Frankel (#4)')
    expect(wrapper.text()).toContain('Lap 3')
    expect(wrapper.get('[style*="background-color"]').attributes('style')).toContain(
      'rgb(200, 40, 41)',
    )
  })
})
