import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { currentRound, results } from '@/data/mockRace'
import ResultsPanel from './ResultsPanel.vue'

const meta = {
  title: 'Race/ResultsPanel',
  component: ResultsPanel,
  tags: ['autodocs'],
  args: {
    results,
    current: `${currentRound.label} · ${currentRound.distance}m`,
  },
  render: (args) => ({
    components: { ResultsPanel },
    setup: () => ({ args }),
    template: '<div class="w-[340px]"><ResultsPanel v-bind="args" /></div>',
  }),
} satisfies Meta<typeof ResultsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('1st Lap')).toBeVisible()
    await expect(canvas.getAllByText('Final')).toHaveLength(2)
    await expect(canvas.getByText('3rd Lap · 1600m in progress…')).toBeVisible()
  },
}

export const NoResults: Story = {
  args: { results: [] },
}
