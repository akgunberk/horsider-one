<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { CirclePause, CirclePlay, Play, Timer } from '@lucide/vue'
import { cn } from 'cn'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'

interface Props {
  /** Next round preview, e.g. `4th Lap · 1800m`. */
  next: string
  /** Countdown label, e.g. `in 5s`. */
  countdown: string
  /** Countdown progress, 0-100. */
  progress?: number
  startLabel?: string
  /** Auto-advance is stopped; show a resume action. */
  paused?: boolean
  compact?: boolean
  reduced?: boolean
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'AutoAdvanceBar' })

const props = withDefaults(defineProps<Props>(), {
  startLabel: 'Start Now',
  paused: false,
  compact: false,
  reduced: false,
})

const clampedProgress = computed(() =>
  props.progress === undefined ? 0 : Math.min(100, Math.max(0, props.progress)),
)

const emit = defineEmits<{
  start: []
  stop: []
  resume: []
}>()
</script>

<template>
  <div
    v-if="compact"
    data-slot="auto-advance-bar"
    :class="
      cn(
        'flex w-full flex-col gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-xs',
        props.class,
      )
    "
  >
    <div class="flex items-center justify-between gap-2">
      <div class="flex min-w-0 items-center gap-2">
        <Timer class="size-[15px] shrink-0 text-brand" aria-hidden="true" />
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-[12px] font-medium text-foreground">Next: {{ next }}</span>
          <Badge variant="accent" class="mt-0.5 self-start text-[10px] tabular-nums">
            {{ countdown }}
          </Badge>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-1.5">
        <Button
          v-if="!paused"
          variant="outline"
          size="icon-sm"
          aria-label="Stop Auto-Advance"
          title="Stop Auto-Advance"
          @click="emit('stop')"
        >
          <CirclePause class="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          v-else
          variant="outline"
          size="icon-sm"
          aria-label="Resume Auto-Advance"
          title="Resume Auto-Advance"
          @click="emit('resume')"
        >
          <CirclePlay class="size-3.5" aria-hidden="true" />
        </Button>
        <Button size="sm" class="gap-1 px-2.5 text-[12px] tabular-nums" @click="emit('start')">
          <Play class="size-3" aria-hidden="true" />
          <span>{{ startLabel }}</span>
        </Button>
      </div>
    </div>

    <div
      v-if="progress !== undefined"
      class="h-0.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-label="Auto-advance countdown"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(clampedProgress)"
    >
      <div
        class="h-full rounded-full bg-brand"
        :class="reduced ? '' : 'transition-[width] duration-150 ease-linear'"
        :style="{ width: `${clampedProgress}%` }"
      />
    </div>
  </div>

  <div
    v-else
    data-slot="auto-advance-bar"
    :class="
      cn(
        'flex w-full flex-col gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xs',
        props.class,
      )
    "
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-2">
        <Timer class="size-[15px] shrink-0 text-brand" aria-hidden="true" />
        <span class="truncate text-[13px] font-medium text-foreground">Next: {{ next }}</span>
        <Badge variant="accent" class="shrink-0 tabular-nums">{{ countdown }}</Badge>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <Button
          v-if="!paused"
          variant="outline"
          size="sm"
          class="text-[12px]"
          @click="emit('stop')"
        >
          Stop Auto-Advance
        </Button>
        <Button v-else variant="outline" size="sm" class="text-[12px]" @click="emit('resume')">
          Resume Auto-Advance
        </Button>
        <Button size="sm" class="text-[12px] tabular-nums" @click="emit('start')">
          <Play class="size-3" aria-hidden="true" />
          <span>{{ startLabel }}</span>
        </Button>
      </div>
    </div>

    <div
      v-if="progress !== undefined"
      class="h-0.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-label="Auto-advance countdown"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(clampedProgress)"
    >
      <div
        class="h-full rounded-full bg-brand"
        :class="reduced ? '' : 'transition-[width] duration-150 ease-linear'"
        :style="{ width: `${clampedProgress}%` }"
      />
    </div>
  </div>
</template>
