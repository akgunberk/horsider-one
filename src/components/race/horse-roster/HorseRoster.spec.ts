import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Horse } from '@/types/race'
import HorseRoster from './HorseRoster.vue'

const horses: Horse[] = [
  { id: 1, name: 'Secretariat', color: '#c82829', condition: 70 },
  { id: 4, name: 'Frankel', color: '#167a3c', condition: 99 },
]

describe('HorseRoster', () => {
  it('renders every horse with the roster count', () => {
    const wrapper = mount(HorseRoster, { props: { horses } })

    expect(wrapper.text()).toContain('Horses')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Secretariat')
    expect(wrapper.text()).toContain('Frankel')
  })
})
