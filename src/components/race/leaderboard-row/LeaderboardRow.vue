<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

interface Props {
  rank: number
  color: string
  name: string
  time: string
  /** Draw a top divider; disable inside cards that already use `divide-y`. */
  divider?: boolean
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'LeaderboardRow' })

const props = withDefaults(defineProps<Props>(), {
  divider: false,
})
</script>

<template>
  <div
    data-slot="leaderboard-row"
    :class="
      cn(
        'flex w-full items-center justify-between gap-3',
        divider && 'border-t border-border pt-3',
        props.class,
      )
    "
  >
    <div class="flex min-w-0 items-center gap-2.5">
      <span class="w-3 shrink-0 text-[12px] text-muted-foreground tabular-nums">{{ rank }}</span>
      <span
        class="size-2 shrink-0 rounded-full"
        :style="{ backgroundColor: color }"
        aria-hidden="true"
      />
      <span class="truncate text-[13px] text-foreground">{{ name }}</span>
    </div>
    <span class="shrink-0 text-[12px] text-muted-foreground tabular-nums">{{ time }}</span>
  </div>
</template>
