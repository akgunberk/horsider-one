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
import ProgressRow from '@/components/race/progress-row/ProgressRow.vue'
import RoundLeaderBanner from '@/components/race/round-leader-banner/RoundLeaderBanner.vue'
import RunnerNumberMarker from '@/components/race/runner-number-marker/RunnerNumberMarker.vue'
import type { LapEntry } from '@/components/race/types'

const entries: LapEntry[] = [
  { number: 7, color: '#DF4545', name: 'Secretariat', time: '12.84s' },
  { number: 4, color: '#3B82F6', name: 'Frankel', time: '12.91s' },
  { number: 12, color: '#10B981', name: 'Man o’ War', time: '13.02s' },
  { number: 9, color: '#F59E0B', name: 'Seabiscuit', time: '13.11s' },
  { number: 15, color: '#8B5CF6', name: 'Phar Lap', time: '13.24s' },
  { number: 2, color: '#EC4899', name: 'Citation', time: '13.35s' },
  { number: 18, color: '#14B8A6', name: 'Affirmed', time: '13.42s' },
  { number: 6, color: '#6366F1', name: 'Spectacular Bid', time: '13.58s' },
  { number: 11, color: '#84CC16', name: 'War Admiral', time: '13.63s' },
  { number: 20, color: '#F97316', name: 'Seattle Slew', time: '13.79s' },
]

const meta = {
  title: 'Overview/Component Library',
  parameters: {
    layout: 'fullscreen',
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
      ProgressRow,
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
      runners: [
        { lane: 1, number: 7, name: 'Secretariat', color: '#DF4545', progress: 52 },
        { lane: 2, number: 4, name: 'Frankel', color: '#3B82F6', progress: 61 },
        { lane: 3, number: 12, name: 'Man o’ War', color: '#10B981', progress: 44 },
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

        <RunnerNumberMarker :number="7" color="#DF4545" />

        <FinishStrip />

        <div class="flex flex-col gap-4">
          <LaneProgress
            v-for="runner in runners"
            :key="runner.lane"
            v-bind="runner"
          />
        </div>

        <div class="flex max-w-[240px] flex-col">
          <ProgressRow :rank="1" color="#DF4545" name="Secretariat" :progress="75" />
        </div>

        <LeaderboardRow
          class="max-w-[260px]"
          :rank="1"
          color="#DF4545"
          name="Secretariat"
          time="12.84s"
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
