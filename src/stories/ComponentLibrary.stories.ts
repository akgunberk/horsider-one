import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Check, Flag, Pause, Play, Shuffle, Timer } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AutoAdvanceBar from '@/components/race/auto-advance-bar/AutoAdvanceBar.vue'
import FinishStrip from '@/components/race/finish-strip/FinishStrip.vue'
import LaneProgress from '@/components/race/lane-progress/LaneProgress.vue'
import LapLeaderboardCard from '@/components/race/lap-leaderboard-card/LapLeaderboardCard.vue'
import LeaderboardRow from '@/components/race/leaderboard-row/LeaderboardRow.vue'
import RoundLeaderBanner from '@/components/race/round-leader-banner/RoundLeaderBanner.vue'
import RunnerNumberMarker from '@/components/race/runner-number-marker/RunnerNumberMarker.vue'
import { horseColors } from '@/data/horseColors'
import type { LapEntry } from '@/types/race'

const entries: LapEntry[] = [
  { number: 7, color: '#DF4545', name: 'Secretariat', meta: '0:12.84' },
  { number: 4, color: '#3B82F6', name: 'Frankel', meta: '0:12.91' },
  { number: 12, color: '#10B981', name: 'Man o’ War', meta: '0:13.02' },
  { number: 9, color: '#F59E0B', name: 'Seabiscuit', meta: '0:13.11' },
  { number: 15, color: '#8B5CF6', name: 'Phar Lap', meta: '0:13.24' },
  { number: 2, color: '#EC4899', name: 'Citation', meta: '0:13.35' },
  { number: 18, color: '#14B8A6', name: 'Affirmed', meta: '0:13.42' },
  { number: 6, color: '#6366F1', name: 'Spectacular Bid', meta: '0:13.58' },
  { number: 11, color: '#84CC16', name: 'War Admiral', meta: '0:13.63' },
  { number: 20, color: '#F97316', name: 'Seattle Slew', meta: '0:13.79' },
]

const meta = {
  title: 'Overview/Component Library',
  parameters: {
    layout: 'fullscreen',
    // Kitchen-sink overview duplicates the per-component snapshots.
    chromatic: { disableSnapshot: true },
  },
  render: () => ({
    components: {
      AutoAdvanceBar,
      Badge,
      Button,
      Check,
      FinishStrip,
      Flag,
      LaneProgress,
      LapLeaderboardCard,
      LeaderboardRow,
      Pause,
      Play,
      RoundLeaderBanner,
      RunnerNumberMarker,
      Shuffle,
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
      Timer,
    },
    setup: () => ({
      entries,
      markerColor: horseColors[0]!,
      runners: [
        { lane: 1, number: 7, name: 'Secretariat', color: horseColors[0]!, progress: 52 },
        { lane: 2, number: 4, name: 'Frankel', color: horseColors[3]!, progress: 61 },
        { lane: 3, number: 12, name: 'Man o’ War', color: horseColors[2]!, progress: 44 },
      ],
    }),
    template: `<div class="mx-auto grid w-full max-w-[976px] grid-cols-1 items-start gap-10 bg-background p-8 text-foreground lg:grid-cols-2">
      <div class="flex flex-col gap-9">
        <div class="flex items-center gap-4">
          <Play class="size-4" />
          <Pause class="size-4" />
          <Shuffle class="size-4" />
          <Flag class="size-4" />
          <Check class="size-4" />
          <Timer class="size-4" />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <Button><Play class="size-3.5" />Button</Button>
          <Button variant="outline"><Play class="size-3.5" />Button</Button>
          <Button variant="secondary"><Play class="size-3.5" />Button</Button>
          <Button variant="ghost"><Play class="size-3.5" />Button</Button>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <Badge>Badge</Badge>
          <Badge variant="secondary">Badge</Badge>
          <Badge variant="outline">Badge</Badge>
          <Badge variant="accent">Badge</Badge>
        </div>

        <Tabs default-value="track" class="self-start">
          <TabsList>
            <TabsTrigger value="track">Track</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          <TabsContent value="track" />
          <TabsContent value="results" />
        </Tabs>

        <RunnerNumberMarker :number="7" :color="markerColor" />

        <FinishStrip />

        <div class="flex flex-col gap-4">
          <LaneProgress
            v-for="runner in runners"
            :key="runner.lane"
            v-bind="runner"
          />
        </div>

        <LeaderboardRow
          class="max-w-[260px]"
          :rank="1"
          color="#DF4545"
          name="Secretariat"
          meta="0:12.84"
          divider
        />
      </div>

      <div class="flex flex-col gap-6">
        <LapLeaderboardCard
          class="max-w-[300px]"
          title="1st Lap"
          distance="1200m"
          status="Done"
          :entries="entries"
        />
        <RoundLeaderBanner name="Frankel" :number="4" color="#3B82F6" :lap="3" />
        <AutoAdvanceBar
          next="4th Lap · 1800m"
          countdown="in 5s"
          start-label="Start Now (4s)"
        />
        <AutoAdvanceBar
          class="max-w-[360px]"
          next="4th Lap · 1800m"
          countdown="in 5s"
          start-label="Start (4s)"
          compact
        />
      </div>
    </div>`,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
