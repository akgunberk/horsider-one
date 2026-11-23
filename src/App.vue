<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import Badge from '@/components/ui/badge/Badge.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AppHeader from '@/components/layout/app-header/AppHeader.vue'
import AutoAdvanceBar from '@/components/race/auto-advance-bar/AutoAdvanceBar.vue'
import HorseRoster from '@/components/race/horse-roster/HorseRoster.vue'
import ProgramPanel from '@/components/race/program-panel/ProgramPanel.vue'
import ProgramResultsPanel from '@/components/race/program-results-panel/ProgramResultsPanel.vue'
import RaceTrackCard from '@/components/race/race-track-card/RaceTrackCard.vue'
import ResultsPanel from '@/components/race/results-panel/ResultsPanel.vue'
import RoundLeaderBanner from '@/components/race/round-leader-banner/RoundLeaderBanner.vue'
import { useRaceLoop } from '@/composables/useRaceLoop'
import { useSpeedMultiplier } from '@/composables/useSpeedMultiplier'
import { useRaceStore } from '@/stores/race'

const race = useRaceStore()
const speedMultiplier = useSpeedMultiplier()
const preferredReducedMotion = usePreferredReducedMotion()
const isDesktop = useMediaQuery('(min-width: 768px)')

useRaceLoop({ speedMultiplier })

const reduced = computed(() => preferredReducedMotion.value === 'reduce')
const isRaceUnderway = computed(() => race.phase === 'RUNNING' || race.phase === 'PAUSED')

const leaderLabel = computed(() =>
  isRaceUnderway.value && race.leader ? `${race.leader.name} (#${race.leader.id})` : '—',
)

const inProgressLabel = computed(() => {
  const round = race.activeRoundView
  return isRaceUnderway.value && round ? `${round.label} · ${round.distance}m` : ''
})

onMounted(() => race.ensureGenerated())
</script>

<template>
  <div
    class="flex h-dvh flex-col overflow-hidden bg-background text-foreground"
    :data-phase="race.phase"
  >
    <p class="sr-only" aria-live="polite">{{ race.statusLabel }}</p>

    <AppHeader
      class="shrink-0"
      :status="race.statusLabel"
      :phase="race.phase"
      :can-generate="race.canGenerate"
      :can-primary="race.canRace"
      :generate-label="race.generateLabel"
      :primary-label="race.primaryLabel"
      @generate="race.generate()"
      @primary="race.triggerPrimary()"
    />

    <main
      class="container mx-auto flex min-h-0 max-w-7xl flex-1 flex-col px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8"
    >
      <!-- Mobile: segmented views -->
      <div v-if="!isDesktop" class="flex min-h-0 flex-1 flex-col gap-3.5">
        <RoundLeaderBanner
          v-if="race.leader && isRaceUnderway"
          class="shrink-0"
          :name="race.leader.name"
          :number="race.leader.id"
          :color="race.leader.color"
          :lap="race.activeRound"
        />

        <Tabs default-value="track" class="flex min-h-0 w-full flex-1 flex-col gap-3.5">
          <TabsList class="grid w-full shrink-0 grid-cols-4">
            <TabsTrigger value="track">Track</TabsTrigger>
            <TabsTrigger value="horses">Horses</TabsTrigger>
            <TabsTrigger value="program">Program</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <AutoAdvanceBar
            v-if="race.isAutoAdvanceVisible"
            class="shrink-0"
            compact
            :next="race.nextRoundLabel"
            :countdown="race.autoAdvanceCountdownLabel"
            :paused="race.autoAdvancePaused"
            :progress="race.interstitialProgress"
            :reduced="reduced"
            start-label="Start Now"
            @start="race.startNow()"
            @stop="race.stopAutoAdvance()"
            @resume="race.resumeAutoAdvance()"
          />

          <TabsContent
            value="track"
            class="min-h-0 flex-1 overflow-y-auto"
            tabindex="0"
            aria-label="Live race track"
          >
            <RaceTrackCard
              v-if="race.activeRoundView"
              compact
              :round="race.activeRoundView"
              :lanes="race.laneRunners"
              :leader="leaderLabel"
              :time="race.leaderElapsedLabel"
              :reduced="reduced"
            />
          </TabsContent>

          <TabsContent value="horses" class="min-h-0 flex-1 overflow-hidden">
            <HorseRoster class="h-full" :horses="race.horses" />
          </TabsContent>

          <TabsContent value="program" class="min-h-0 flex-1 overflow-hidden">
            <article
              class="flex h-full min-h-0 flex-col gap-3 rounded-lg border border-border bg-card p-4"
            >
              <header class="flex shrink-0 items-center justify-between">
                <h2 class="text-[13px] font-semibold text-foreground">Race Program</h2>
                <Badge variant="outline" class="tabular-nums">
                  {{ race.programRounds.length }} Rounds
                </Badge>
              </header>
              <div class="min-h-0 flex-1 overflow-y-auto" tabindex="0" aria-label="Race program">
                <ProgramPanel :rounds="race.programRounds" :active-round="race.activeRound" />
              </div>
            </article>
          </TabsContent>

          <TabsContent value="results" class="min-h-0 flex-1 overflow-hidden">
            <article
              class="flex h-full min-h-0 flex-col gap-3 rounded-lg border border-border bg-card p-4"
            >
              <header class="flex shrink-0 items-center justify-between">
                <h2 class="text-[13px] font-semibold text-foreground">Official Results</h2>
                <Badge variant="outline" class="tabular-nums">
                  {{ race.results.length }} / 6
                </Badge>
              </header>
              <div
                class="min-h-0 flex-1 overflow-y-auto"
                tabindex="0"
                aria-label="Official results"
              >
                <ResultsPanel :results="race.results" :current="inProgressLabel" />
              </div>
            </article>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Tablet & desktop: 12-column workspace -->
      <div
        v-else
        class="grid min-h-0 flex-1 grid-cols-12 grid-rows-[minmax(0,1.1fr)_minmax(0,1fr)] items-stretch gap-6 lg:grid-rows-1"
      >
        <div
          class="order-1 flex min-h-0 flex-col gap-5 md:col-span-12 md:row-start-1 lg:order-2 lg:col-span-6 lg:row-start-1"
        >
          <AutoAdvanceBar
            v-if="race.isAutoAdvanceVisible"
            class="shrink-0"
            :next="race.nextRoundLabel"
            :countdown="race.autoAdvanceCountdownLabel"
            :paused="race.autoAdvancePaused"
            :progress="race.interstitialProgress"
            :reduced="reduced"
            start-label="Start Now"
            @start="race.startNow()"
            @stop="race.stopAutoAdvance()"
            @resume="race.resumeAutoAdvance()"
          />
          <div class="min-h-0 flex-1">
            <RaceTrackCard
              v-if="race.activeRoundView"
              class="h-full"
              :round="race.activeRoundView"
              :lanes="race.laneRunners"
              :leader="leaderLabel"
              :time="race.leaderElapsedLabel"
              :reduced="reduced"
            />
          </div>
        </div>

        <HorseRoster
          class="order-2 h-full min-h-0 md:col-span-4 md:row-start-2 lg:order-1 lg:col-span-3 lg:row-start-1"
          :horses="race.horses"
        />

        <ProgramResultsPanel
          class="order-3 h-full min-h-0 md:col-span-8 md:row-start-2 lg:order-3 lg:col-span-3 lg:row-start-1"
          :program="race.programRounds"
          :results="race.results"
          :active-round="race.activeRound"
          :current="inProgressLabel"
        />
      </div>
    </main>
  </div>
</template>
