<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { Horse } from '@/types/race'
import { cn } from 'cn'
import Badge from '@/components/ui/badge/Badge.vue'
import HorseRosterRow from '../horse-roster-row/HorseRosterRow.vue'

interface Props {
  horses: Horse[]
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'HorseRoster' })

const props = defineProps<Props>()
</script>

<template>
  <article
    :class="
      cn(
        'flex h-full min-h-0 w-full flex-col gap-3 rounded-lg border border-border bg-card p-4',
        props.class,
      )
    "
  >
    <header class="flex shrink-0 items-center justify-between">
      <h2 class="text-[13px] font-semibold text-foreground">Horses</h2>
      <Badge variant="outline" class="tabular-nums">{{ horses.length }}</Badge>
    </header>

    <p v-if="horses.length === 0" class="py-4 text-center text-[12px] text-muted-foreground">
      Generate a program to draw 20 horses.
    </p>

    <ul
      v-else
      class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1"
      tabindex="0"
      aria-label="Horse roster"
    >
      <li v-for="(horse, index) in horses" :key="horse.id">
        <HorseRosterRow
          :rank="index + 1"
          :name="horse.name"
          :color="horse.color"
          :condition="horse.condition"
        />
      </li>
    </ul>
  </article>
</template>
