import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { currentRound, lanes, leaderTime } from '@/data/mockRace'
import RaceTrackCard from './RaceTrackCard.vue'

const meta = {
  title: 'Race/RaceTrackCard',
  component: RaceTrackCard,
  tags: ['autodocs'],
  args: {
    round: currentRound,
    lanes,
    leader: 'Frankel (#4)',
    time: leaderTime,
  },
  render: (args) => ({
    components: { RaceTrackCard },
    setup: () => ({ args }),
    template: '<div class="w-[760px]"><RaceTrackCard v-bind="args" /></div>',
  }),
} satisfies Meta<typeof RaceTrackCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('3rd Lap · 1600m')).toBeVisible()
    await expect(canvas.getByText('Leader · Frankel (#4)')).toBeVisible()
    await expect(canvas.getAllByRole('progressbar')).toHaveLength(10)
  },
}

export const Compact: Story = {
  args: { compact: true },
  render: (args) => ({
    components: { RaceTrackCard },
    setup: () => ({ args }),
    template: '<div class="w-[360px]"><RaceTrackCard v-bind="args" /></div>',
  }),
}
