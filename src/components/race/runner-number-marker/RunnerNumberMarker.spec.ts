import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RunnerNumberMarker from './RunnerNumberMarker.vue'

describe('RunnerNumberMarker', () => {
  it('renders the horse number in its color', () => {
    const wrapper = mount(RunnerNumberMarker, { props: { number: 4, color: '#c82829' } })

    expect(wrapper.text()).toBe('4')
    expect(wrapper.attributes('style')).toContain('rgb(200, 40, 41)')
  })
})
