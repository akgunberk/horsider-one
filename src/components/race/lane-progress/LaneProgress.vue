<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from 'cn'
import FinishStrip from '../finish-strip/FinishStrip.vue'
import RunnerNumberMarker from '../runner-number-marker/RunnerNumberMarker.vue'

interface Props {
  /** Lane position, 1-10. */
  lane: number
  /** Permanent horse number. */
  number: number
  name?: string
  color: string
  /** Race progress, 0-100. */
  progress: number
  compact?: boolean
  /** Simplify decorative track fill for `prefers-reduced-motion`. */
  reduced?: boolean
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'LaneProgress' })

const props = withDefaults(defineProps<Props>(), {
  name: '',
  compact: false,
  reduced: false,
})

const clamped = computed(() => Math.min(100, Math.max(0, props.progress)))
const progressRatio = computed(() => clamped.value / 100)
const markerStyle = computed<CSSProperties>(() => ({
  '--p': String(progressRatio.value),
}))
const trackColor = computed(() => `color-mix(in srgb, ${props.color} 35%, white)`)
</script>

<template>
  <div
    data-slot="lane-progress"
    :class="cn('flex items-center', compact ? 'gap-3' : 'gap-4', props.class)"
  >
    <div v-if="compact" class="w-4 shrink-0 text-[12px] text-muted-foreground tabular-nums">
      {{ lane }}
    </div>
    <div v-else class="flex w-32 shrink-0 items-center gap-2">
      <span class="w-4 shrink-0 text-[12px] text-muted-foreground tabular-nums">{{ lane }}</span>
      <span class="truncate text-[13px] font-medium text-foreground">{{ name }}</span>
    </div>

    <div
      class="track-lane-rail relative flex h-8 flex-1 items-center overflow-hidden rounded-md border border-dashed border-border bg-muted/40"
      role="progressbar"
      :aria-label="name ? `Lane ${lane}, ${name}` : `Lane ${lane}`"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(clamped)"
    >
      <div class="track-run-area absolute inset-y-0 left-0 right-3 flex items-center">
        <div
          v-if="!reduced"
          class="absolute inset-y-0 left-0 flex w-full origin-left items-center"
          :style="{ transform: `scaleX(${progressRatio})` }"
          aria-hidden="true"
        >
          <div class="h-1 w-full rounded-full" :style="{ backgroundColor: trackColor }" />
        </div>

        <span
          class="horse-marker absolute top-1/2 left-0 z-10"
          :style="markerStyle"
          aria-hidden="true"
        >
          <RunnerNumberMarker :number="number" :color="color" />
        </span>
      </div>

      <FinishStrip class="absolute inset-y-0 right-1.5 h-full" />
    </div>
  </div>
</template>
