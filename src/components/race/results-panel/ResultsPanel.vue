<script setup lang="ts">
import type { RoundResult } from '@/types/race'
import LapLeaderboardCard from '../lap-leaderboard-card/LapLeaderboardCard.vue'

interface Props {
  results: RoundResult[]
  /** Label for the round currently in progress. */
  current: string
}

defineOptions({ name: 'ResultsPanel' })

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <LapLeaderboardCard
      v-for="{ round, entries } in results"
      :key="round.round"
      :title="round.label"
      :distance="`${round.distance}m`"
      status="Final"
      :entries="entries"
    />

    <p
      v-if="results.length === 0 && !current"
      class="py-4 text-center text-[12px] text-muted-foreground"
    >
      No results yet.
    </p>

    <div
      v-if="current"
      class="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 text-center text-[12px] text-muted-foreground"
    >
      {{ current }} in progress…
    </div>
  </div>
</template>
