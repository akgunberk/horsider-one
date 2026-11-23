<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { LaneRunner, Round } from '@/types/race'
import { Timer } from '@lucide/vue'
import { cn } from 'cn'
import Badge from '@/components/ui/badge/Badge.vue'
import LaneProgress from '../lane-progress/LaneProgress.vue'

interface Props {
  round: Round
  lanes: LaneRunner[]
  /** Leader label, e.g. `Frankel (#4)`. */
  leader: string
  /** Elapsed leader time, e.g. `0:41.20`. */
  time: string
  compact?: boolean
  /** Simplify decorative motion for `prefers-reduced-motion`. */
  reduced?: boolean
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'RaceTrackCard' })

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  reduced: false,
})
</script>

<template>
  <article
    :class="
      cn(
        'flex w-full flex-col gap-3.5 rounded-lg border border-border bg-card p-4 md:gap-4 md:p-5',
        props.class,
      )
    "
  >
    <header v-if="compact" class="flex items-center justify-between gap-2">
      <h2 class="text-[13px] font-semibold text-foreground">
        {{ round.label }} · {{ round.distance }}m
      </h2>
      <Badge variant="outline" class="tabular-nums">{{ lanes.length }} Horses</Badge>
    </header>

    <header v-else class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-col gap-0.5">
        <span class="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Round {{ round.round }} of 6
        </span>
        <h2 class="font-heading text-lg font-semibold text-foreground">
          {{ round.label }} · {{ round.distance }}m
        </h2>
      </div>
      <div class="flex items-center gap-3">
        <Badge variant="outline" class="tabular-nums">Leader · {{ leader }}</Badge>
        <span class="inline-flex items-center gap-1.5 text-foreground tabular-nums">
          <Timer class="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span class="font-mono text-[13px]">{{ time }}</span>
        </span>
      </div>
    </header>

    <ul
      class="flex min-h-0 flex-1 flex-col justify-between gap-2.5 overflow-y-auto"
      :tabindex="compact ? undefined : 0"
      :aria-label="compact ? undefined : 'Race lanes'"
    >
      <li v-for="lane in lanes" :key="lane.lane">
        <LaneProgress
          :lane="lane.lane"
          :number="lane.number"
          :name="lane.name"
          :color="lane.color"
          :progress="lane.progress"
          :compact="compact"
          :reduced="reduced"
        />
      </li>
    </ul>

    <div
      :class="
        cn(
          'flex items-center justify-between pt-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase tabular-nums',
          compact ? 'pl-7' : 'pl-36',
        )
      "
    >
      <span>0m</span>
      <span>400m</span>
      <span>800m</span>
      <span>1200m</span>
      <span>Finish</span>
    </div>
  </article>
</template>
