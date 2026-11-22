import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LapLeaderboardCard from './LapLeaderboardCard.vue'
import type { LapEntry } from '../types'

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
