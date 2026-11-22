<script setup lang="ts">
import type { BadgeVariants } from '@/components/ui/badge'
import type { ProgramRound, RoundStatus } from '@/types/race'
import { ChevronDown } from '@lucide/vue'
import Badge from '@/components/ui/badge/Badge.vue'
import LeaderboardRow from '../leaderboard-row/LeaderboardRow.vue'

interface Props {
  rounds: ProgramRound[]
  /** Round number expanded by default. */
  activeRound: number
}

defineOptions({ name: 'ProgramPanel' })

defineProps<Props>()

const STATUS_LABEL: Record<RoundStatus, string> = {
  done: 'Done',
  ready: 'Ready',
  running: 'Running',
  upcoming: 'Upcoming',
}

const STATUS_VARIANT: Record<RoundStatus, BadgeVariants['variant']> = {
  done: 'secondary',
  ready: 'default',
  running: 'accent',
  upcoming: 'outline',
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <details
      v-for="{ round, entries } in rounds"
      :key="round.round"
      :open="round.round === activeRound"
      class="group overflow-hidden rounded-lg border border-border bg-card"
    >
      <summary
        class="sticky top-0 z-10 flex cursor-pointer list-none items-center justify-between gap-2 bg-muted px-3 py-2.5 transition-colors select-none hover:bg-muted/80 group-open:border-b group-open:border-border [&::-webkit-details-marker]:hidden"
      >
        <div class="flex min-w-0 items-baseline gap-1.5">
          <h3 class="text-[13px] font-semibold text-foreground">{{ round.label }}</h3>
          <span class="text-[12px] text-muted-foreground tabular-nums">{{ round.distance }}m</span>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <Badge :variant="STATUS_VARIANT[round.status]">{{ STATUS_LABEL[round.status] }}</Badge>
          <ChevronDown
            class="size-3.5 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </div>
      </summary>

      <div class="divide-y divide-border/60">
        <LeaderboardRow
          v-for="(entry, index) in entries"
          :key="`${entry.number}-${index}`"
          :rank="index + 1"
          :color="entry.color"
          :name="entry.name"
          :time="entry.time"
          class="px-3 py-1.5"
        />
      </div>
    </details>
  </div>
</template>
