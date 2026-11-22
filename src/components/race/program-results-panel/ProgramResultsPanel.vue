<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { ProgramRound, RoundResult } from '@/types/race'
import { cn } from 'cn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProgramPanel from '../program-panel/ProgramPanel.vue'
import ResultsPanel from '../results-panel/ResultsPanel.vue'

interface Props {
  program: ProgramRound[]
  results: RoundResult[]
  activeRound: number
  current: string
  defaultTab?: 'program' | 'results'
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'ProgramResultsPanel' })

const props = withDefaults(defineProps<Props>(), {
  defaultTab: 'program',
})
</script>

<template>
  <section
    :class="
      cn(
        'flex h-full min-h-0 w-full flex-col gap-4 rounded-lg border border-border bg-card p-4',
        props.class,
      )
    "
  >
    <Tabs :default-value="defaultTab" class="flex min-h-0 flex-1 flex-col gap-3">
      <TabsList class="grid h-9 w-full shrink-0 grid-cols-2">
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>

      <TabsContent
        value="program"
        class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
        tabindex="0"
        aria-label="Race program"
      >
        <ProgramPanel :rounds="program" :active-round="activeRound" />
      </TabsContent>

      <TabsContent
        value="results"
        class="min-h-0 flex-1 overflow-y-auto"
        tabindex="0"
        aria-label="Round results"
      >
        <ResultsPanel :results="results" :current="current" />
      </TabsContent>
    </Tabs>
  </section>
</template>
