import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LapLeaderboardCard from './LapLeaderboardCard.vue'
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
  title: 'Race/LapLeaderboardCard',
  component: LapLeaderboardCard,
  tags: ['autodocs'],
  args: {
    title: '1st Lap',
    distance: '1200m',
    status: 'Done',
    entries,
  },
  render: (args) => ({
    components: { LapLeaderboardCard },
    setup: () => ({ args }),
    template: '<div class="w-[300px]"><LapLeaderboardCard v-bind="args" /></div>',
  }),
} satisfies Meta<typeof LapLeaderboardCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Live: Story = {
  args: {
    title: '3rd Lap',
    distance: '1600m',
    status: 'Live',
    entries: entries.slice(0, 4),
  },
}

export const Empty: Story = {
  args: {
    title: '4th Lap',
    distance: '1800m',
    status: 'Scheduled',
    entries: [],
  },
}
