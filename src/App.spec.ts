import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import App from './App.vue'
import { seededRng } from '@/test/rng'
import { useRaceStore } from '@/stores/race'

function setViewport(desktop: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string): MediaQueryList =>
      ({
        matches: desktop && query === '(min-width: 768px)',
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )
}

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function mountApp(options: { desktop?: boolean } = {}) {
  setViewport(options.desktop ?? true)
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(App, { global: { plugins: [pinia] } })
  await nextTick()
  return { wrapper, race: useRaceStore(pinia) }
}

describe('App', () => {
  it('auto-generates a 20-horse roster on mount', async () => {
    const { wrapper, race } = await mountApp({ desktop: true })

    expect(race.horses).toHaveLength(20)
    expect(race.phase).toBe('SCHEDULED')
    expect(wrapper.text()).toContain('Horse Racing')
    expect(wrapper.text()).toContain('Program')
    expect(wrapper.findAll('[data-slot="horse-roster-row"]')).toHaveLength(20)
    expect(wrapper.findAll('[role="progressbar"]')).toHaveLength(10)
    wrapper.unmount()
  })

  it('regenerates from the header button while scheduled', async () => {
    const { wrapper, race } = await mountApp({ desktop: true })
    const firstRoster = race.horses.map((horse) => horse.name)

    await wrapper.findAll('button')[0]?.trigger('click')

    expect(race.phase).toBe('SCHEDULED')
    expect(race.horses).toHaveLength(20)
    expect(race.horses.map((horse) => horse.name)).not.toEqual(firstRoster)
    wrapper.unmount()
  })

  it('starts the race and disables generate', async () => {
    const { wrapper, race } = await mountApp({ desktop: true })
    const buttons = wrapper.findAll('button')

    await buttons[1]?.trigger('click')

    expect(race.phase).toBe('RUNNING')
    expect(wrapper.findAll('button')[0]?.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('stops auto-advance from the mobile interstitial banner', async () => {
    const { wrapper, race } = await mountApp({ desktop: false })

    race.start()
    race.tick(100, seededRng(1))
    await nextTick()

    expect(wrapper.text()).toContain('Next: 2nd Lap · 1400m')
    expect(wrapper.findAll('[data-slot="auto-advance-bar"]')).toHaveLength(1)

    const stop = wrapper.get('[aria-label="Stop Auto-Advance"]')
    await stop.trigger('click')

    expect(race.phase).toBe('SCHEDULED')
    expect(wrapper.text()).toContain('stopped')

    const resume = wrapper.get('[aria-label="Resume Auto-Advance"]')
    await resume.trigger('click')
    await nextTick()

    expect(race.phase).toBe('INTERSTITIAL')
    wrapper.unmount()
  })

  it('starts the next round from the desktop interstitial banner', async () => {
    const { wrapper, race } = await mountApp({ desktop: true })

    race.start()
    race.tick(100, seededRng(1))
    await nextTick()

    expect(wrapper.findAll('[data-slot="auto-advance-bar"]')).toHaveLength(1)

    const startNow = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Start Now'))

    await startNow?.trigger('click')

    expect(race.phase).toBe('RUNNING')
    expect(race.activeRound).toBe(2)
    wrapper.unmount()
  })

  it('shows the mobile program tab with all six rounds', async () => {
    const { wrapper } = await mountApp({ desktop: false })
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[2]?.trigger('mousedown')
    await nextTick()

    expect(wrapper.text()).toContain('Race Program')
    expect(wrapper.findAll('details').length).toBeGreaterThanOrEqual(6)
    wrapper.unmount()
  })

  it('switches the mobile results tab', async () => {
    const { wrapper } = await mountApp({ desktop: false })
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[3]?.trigger('mousedown')
    await nextTick()

    expect(wrapper.text()).toContain('Official Results')
    expect(wrapper.text()).toContain('No results yet.')
    wrapper.unmount()
  })
})
