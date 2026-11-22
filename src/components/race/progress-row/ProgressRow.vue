<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from 'cn'

interface Props {
  rank: number
  color: string
  name: string
  /** Race progress, 0-100. */
  progress: number
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'ProgressRow' })

const props = defineProps<Props>()

const clamped = computed(() => Math.min(100, Math.max(0, props.progress)))
</script>

<template>
  <div
    data-slot="progress-row"
    :class="cn('flex w-full items-center justify-between gap-4 py-1', props.class)"
  >
    <div class="flex min-w-0 items-center gap-2.5">
      <span class="w-3 shrink-0 text-[12px] text-muted-foreground tabular-nums">{{ rank }}</span>
      <span
        class="size-2 shrink-0 rounded-full"
        :style="{ backgroundColor: color }"
        aria-hidden="true"
      />
      <span class="truncate text-[13px] font-medium text-foreground">{{ name }}</span>
    </div>
    <div class="flex shrink-0 items-center gap-3">
      <div class="h-1 w-10 overflow-hidden rounded-full bg-muted">
        <div
          class="h-full rounded-full bg-primary"
          :style="{ width: `${clamped}%` }"
          aria-hidden="true"
        />
      </div>
      <span class="text-[12px] font-medium text-foreground tabular-nums">
        {{ Math.round(clamped) }}
      </span>
    </div>
  </div>
</template>
