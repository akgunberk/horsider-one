import { computed, onUnmounted, watch } from 'vue'
import { useDocumentVisibility, useWindowFocus } from '@vueuse/core'
import { useRaceStore } from '@/stores/race'

export const MAX_FRAME_DELTA_MS = 50

/** Seconds to advance for a frame, clamped before applying the speed multiplier. */
export function clampFrameDelta(deltaMs: number): number {
  return Math.min(Math.max(deltaMs, 0), MAX_FRAME_DELTA_MS) / 1000
}

interface RaceLoopOptions {
  /** Test/demo acceleration applied after the delta-time clamp. */
  speedMultiplier?: number
}

/**
 * Owns the requestAnimationFrame lifecycle and bridges browser timing into the
 * race store. Race rules stay in the store; this only decides when to tick.
 */
export function useRaceLoop(options: RaceLoopOptions = {}) {
  const race = useRaceStore()
  const visibility = useDocumentVisibility()
  const focused = useWindowFocus()
  const interrupted = computed(() => visibility.value === 'hidden' || !focused.value)
  const speedMultiplier = options.speedMultiplier ?? 1

  let rafId: number | null = null
  let lastTimestamp: number | null = null

  function schedule(): void {
    if (rafId !== null || interrupted.value) return
    if (typeof requestAnimationFrame === 'undefined') return

    rafId = requestAnimationFrame((now) => {
      rafId = null

      if (lastTimestamp !== null) {
        race.tick(clampFrameDelta(now - lastTimestamp) * speedMultiplier)
      }

      lastTimestamp = now
      schedule()
    })
  }

  function stop(): void {
    if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId)
    }
    rafId = null
    lastTimestamp = null
  }

  function start(): void {
    if (rafId !== null) return
    lastTimestamp = null
    schedule()
  }

  watch(
    () => race.phase,
    (phase) => {
      if (phase === 'RUNNING' || phase === 'INTERSTITIAL') start()
      else stop()
    },
    { immediate: true },
  )

  watch(interrupted, (isInterrupted) => {
    if (isInterrupted) {
      stop()
      if (race.phase === 'RUNNING') race.pause()
      return
    }

    if (race.phase === 'INTERSTITIAL') start()
  })

  onUnmounted(stop)

  return { start, stop }
}
