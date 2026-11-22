<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'
import LeaderboardRow from '../leaderboard-row/LeaderboardRow.vue'
import type { LapEntry } from '../types'

interface Props {
  title: string
  distance: string
  status: string
  entries: LapEntry[]
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'LapLeaderboardCard' })

const props = defineProps<Props>()
</script>

<template>
  <div
    data-slot="lap-leaderboard-card"
    :class="cn('w-full overflow-hidden rounded-xl border border-border bg-card', props.class)"
  >
    <header
      class="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5"
    >
      <div class="flex items-baseline gap-2">
        <span class="text-[13px] font-semibold text-foreground">{{ title }}</span>
        <span class="text-[12px] text-muted-foreground tabular-nums">{{ distance }}</span>
      </div>
      <span class="shrink-0 text-[12px] font-medium text-foreground">{{ status }}</span>
    </header>
    <div class="divide-y divide-border/60">
      <LeaderboardRow
        v-for="(entry, index) in entries"
        :key="`${entry.number}-${index}`"
        :rank="index + 1"
        :color="entry.color"
        :name="entry.name"
        :time="entry.time"
        class="px-4 py-1.5"
      />
    </div>
  </div>
</template>
