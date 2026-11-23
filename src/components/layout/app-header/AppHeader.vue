<script setup lang="ts">
import type { RacePhase } from '@/types/race'
import { Flag, Pause, Play, Shuffle } from '@lucide/vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'

interface Props {
  /** Live race state label, e.g. `Scheduled · Round 1 of 6`. */
  status: string
  phase: RacePhase
  canGenerate: boolean
  canPrimary: boolean
  generateLabel: string
  primaryLabel: string
}

defineOptions({ name: 'AppHeader' })

defineProps<Props>()

const emit = defineEmits<{
  generate: []
  primary: []
}>()
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-border bg-card">
    <div
      class="container mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span
          class="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
        >
          <Flag class="size-4" aria-hidden="true" />
        </span>
        <div class="min-w-0">
          <h1 class="truncate font-heading text-lg leading-tight font-semibold text-foreground">
            Horse Racing
          </h1>
          <p class="mt-0.5 hidden text-[13px] text-muted-foreground sm:block">
            6-Round Turf Telemetry Simulator
          </p>
        </div>
        <Badge variant="accent" class="ml-1 hidden md:inline-flex">{{ status }}</Badge>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!canGenerate"
          :title="canGenerate ? generateLabel : 'Pause the race to regenerate'"
          aria-label="Generate program"
          @click="emit('generate')"
        >
          <Shuffle class="size-3.5" aria-hidden="true" />
          <span class="hidden sm:inline">{{ generateLabel }}</span>
          <span class="sm:hidden">Gen</span>
        </Button>
        <Button size="sm" :disabled="!canPrimary" @click="emit('primary')">
          <Pause v-if="phase === 'RUNNING'" class="size-3.5" aria-hidden="true" />
          <Play v-else class="size-3.5" aria-hidden="true" />
          <span>{{ primaryLabel }}</span>
        </Button>
      </div>
    </div>
  </header>
</template>
