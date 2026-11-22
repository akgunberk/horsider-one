import { beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import App from './App.vue'
import { seededRng } from '@/test/rng'
import { useRaceStore } from '@/stores/race'

beforeEach(() => {
  setActivePinia(createPinia())
})

async function mountApp() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(App, { global: { plugins: [pinia] } })
  await nextTick()
  return { wrapper, race: useRaceStore(pinia) }
}

describe('App', () => {
  it('auto-generates a 20-horse roster on mount', async () => {
    const { wrapper, race } = await mountApp()

    expect(race.horses).toHaveLength(20)
    expect(race.phase).toBe('SCHEDULED')
    expect(wrapper.text()).toContain('Horse Racing')
    expect(wrapper.text()).toContain('Program')
    expect(wrapper.findAll('[data-slot="horse-roster-row"]')).toHaveLength(20)
  })

  it('regenerates from the header button while scheduled', async () => {
    const { wrapper, race } = await mountApp()
    const firstRoster = race.horses.map((horse) => horse.name)

    await wrapper.findAll('button')[0]?.trigger('click')

    expect(race.phase).toBe('SCHEDULED')
    expect(race.horses).toHaveLength(20)
    expect(race.horses.map((horse) => horse.name)).not.toEqual(firstRoster)
  })

  it('starts the race and disables generate', async () => {
    const { wrapper, race } = await mountApp()
    const buttons = wrapper.findAll('button')

    await buttons[1]?.trigger('click')

    expect(race.phase).toBe('RUNNING')
    expect(wrapper.findAll('button')[0]?.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('stops auto-advance from the mobile interstitial banner', async () => {
    const { wrapper, race } = await mountApp()

    race.start()
    race.tick(100, seededRng(1))
    await nextTick()

    expect(wrapper.text()).toContain('Next: 2nd Lap · 1400m')

    const stop = wrapper
      .findAll('button')
      .find((button) => button.attributes('aria-label') === 'Stop Auto-Advance')

    await stop?.trigger('click')

    expect(race.phase).toBe('SCHEDULED')
    expect(wrapper.text()).toContain('Resume Auto-Advance')
    expect(wrapper.text()).toContain('stopped')

    const resumes = wrapper
      .findAll('button')
      .filter((button) => button.text().includes('Resume Auto-Advance'))

    await resumes[0]?.trigger('click')
    await nextTick()

    expect(race.phase).toBe('INTERSTITIAL')
    wrapper.unmount()
  })

  it('starts the next round from the desktop interstitial banner', async () => {
    const { wrapper, race } = await mountApp()

    race.start()
    race.tick(100, seededRng(1))
    await nextTick()

    const startNowButtons = wrapper
      .findAll('button')
      .filter((button) => button.text().includes('Start Now'))
    const startNow = startNowButtons[startNowButtons.length - 1]

    await startNow?.trigger('click')

    expect(race.phase).toBe('RUNNING')
    expect(race.activeRound).toBe(2)
    wrapper.unmount()
  })

  it('shows the mobile program tab with all six rounds', async () => {
    const { wrapper } = await mountApp()
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[2]?.trigger('mousedown')
    await nextTick()

    expect(wrapper.text()).toContain('Race Program')
    expect(wrapper.findAll('details').length).toBeGreaterThanOrEqual(6)
  })

  it('switches the mobile results tab', async () => {
    const { wrapper } = await mountApp()
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[3]?.trigger('mousedown')
    await nextTick()

    expect(wrapper.text()).toContain('Official Results')
    expect(wrapper.text()).toContain('No results yet.')
  })
})
