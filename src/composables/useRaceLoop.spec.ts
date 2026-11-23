import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { seededRng } from '@/test/rng'
import { useRaceStore } from '@/stores/race'
import { MAX_FRAME_DELTA_MS, clampFrameDelta, useRaceLoop } from './useRaceLoop'

const Host = defineComponent({
  setup() {
    useRaceLoop({ speedMultiplier: 2 })
    return () => null
  },
})

let frames: FrameRequestCallback[]
let cancelFrame: ReturnType<typeof vi.fn>

beforeEach(() => {
  frames = []
  cancelFrame = vi.fn()
  setActivePinia(createPinia())

  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.push(callback)
    return frames.length
  })
  vi.stubGlobal('cancelAnimationFrame', cancelFrame)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function mountLoop() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(Host, { global: { plugins: [pinia] } })
  const race = useRaceStore(pinia)
  race.generate(seededRng(1))
  return { wrapper, race }
}

describe('clampFrameDelta', () => {
  it('clamps negative and oversized frame deltas', () => {
    expect(clampFrameDelta(-10)).toBe(0)
    expect(clampFrameDelta(16)).toBeCloseTo(0.016)
    expect(clampFrameDelta(1000)).toBeCloseTo(MAX_FRAME_DELTA_MS / 1000)
  })
})

describe('useRaceLoop', () => {
  it('starts a single loop when the race is running', async () => {
    const { race } = mountLoop()

    expect(frames).toHaveLength(0)
    race.start()
    await nextTick()

    expect(frames).toHaveLength(1)
  })

  it('applies the delta clamp and speed multiplier before ticking', async () => {
    const { race } = mountLoop()
    const tick = vi.spyOn(race, 'tick')

    race.start()
    await nextTick()

    frames[0]?.(1000)
    frames[1]?.(2000)

    expect(tick).toHaveBeenCalledWith(0.1)
  })

  it('does not tick while paused or scheduled', async () => {
    const { race } = mountLoop()
    const tick = vi.spyOn(race, 'tick')

    await nextTick()
    expect(frames).toHaveLength(0)

    race.start()
    await nextTick()
    race.pause()
    await nextTick()

    expect(tick).not.toHaveBeenCalled()
  })

  it('cancels the loop on unmount', async () => {
    const { wrapper, race } = mountLoop()

    race.start()
    await nextTick()
    wrapper.unmount()

    expect(cancelFrame).toHaveBeenCalled()
  })

  it('pauses a running race when the document is hidden', async () => {
    const { wrapper, race } = mountLoop()
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')

    race.start()
    await nextTick()
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()

    expect(race.phase).toBe('PAUSED')
    expect(cancelFrame).toHaveBeenCalled()

    visibility.mockRestore()
    wrapper.unmount()
  })

  it('does not pause a scheduled race when hidden', async () => {
    const { wrapper, race } = mountLoop()
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')

    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()

    expect(race.phase).toBe('SCHEDULED')

    visibility.mockRestore()
    wrapper.unmount()
  })

  it('restarts the loop when the document becomes visible again', async () => {
    const { wrapper, race } = mountLoop()
    const visibility = vi.spyOn(document, 'visibilityState', 'get')

    visibility.mockReturnValue('hidden')
    race.start()
    await nextTick()
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()

    expect(race.phase).toBe('PAUSED')

    visibility.mockReturnValue('visible')
    race.resume()
    await nextTick()
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()

    expect(frames.length).toBeGreaterThan(0)

    visibility.mockRestore()
    wrapper.unmount()
  })

  it('pauses a running race when the window loses focus', async () => {
    const { wrapper, race } = mountLoop()

    race.start()
    await nextTick()
    window.dispatchEvent(new Event('blur'))
    await nextTick()

    expect(race.phase).toBe('PAUSED')
    expect(cancelFrame).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('stays paused when focus returns and does not auto-resume', async () => {
    const { wrapper, race } = mountLoop()

    race.start()
    await nextTick()
    window.dispatchEvent(new Event('blur'))
    await nextTick()
    const scheduled = frames.length

    window.dispatchEvent(new Event('focus'))
    await nextTick()

    expect(race.phase).toBe('PAUSED')
    expect(frames).toHaveLength(scheduled)

    wrapper.unmount()
  })

  it('restarts an interstitial countdown when focus returns', async () => {
    const { wrapper, race } = mountLoop()

    race.start()
    await nextTick()
    race.tick(100, seededRng(1))
    await nextTick()
    expect(race.phase).toBe('INTERSTITIAL')

    window.dispatchEvent(new Event('blur'))
    await nextTick()
    const stoppedFrames = frames.length

    window.dispatchEvent(new Event('focus'))
    await nextTick()

    expect(race.phase).toBe('INTERSTITIAL')
    expect(frames.length).toBeGreaterThan(stoppedFrames)

    wrapper.unmount()
  })

  it('does nothing when requestAnimationFrame is unavailable', async () => {
    const { wrapper, race } = mountLoop()

    vi.stubGlobal('requestAnimationFrame', undefined)
    race.start()
    await nextTick()

    expect(frames).toHaveLength(0)
    wrapper.unmount()
  })

  it('does not schedule another frame after a tick finishes round six', async () => {
    const FastHost = defineComponent({
      setup() {
        useRaceLoop({ speedMultiplier: 500 })
        return () => null
      },
    })
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(FastHost, { global: { plugins: [pinia] } })
    const race = useRaceStore(pinia)
    race.generate(seededRng(1))
    race.start()
    await nextTick()

    for (let round = 1; round <= 5; round += 1) {
      race.tick(100, seededRng(round))
      race.tick(5, seededRng(round))
    }
    race.tick(30, seededRng(6))
    expect(race.phase).toBe('RUNNING')

    frames[frames.length - 1]?.(1000)
    const countAfterPrime = frames.length
    frames[countAfterPrime - 1]?.(1050)

    expect(race.phase).toBe('FINISHED')
    expect(frames).toHaveLength(countAfterPrime)
    wrapper.unmount()
  })
})
