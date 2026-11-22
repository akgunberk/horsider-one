import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { currentRound, programRounds, results } from '@/data/mockRace'
import ProgramResultsPanel from './ProgramResultsPanel.vue'

const meta = {
  title: 'Race/ProgramResultsPanel',
  component: ProgramResultsPanel,
  tags: ['autodocs'],
  args: {
    program: programRounds,
    results,
    activeRound: currentRound.round,
    current: `${currentRound.label} · ${currentRound.distance}m`,
  },
  render: (args) => ({
    components: { ProgramResultsPanel },
    setup: () => ({ args }),
    template: '<div class="w-[340px]"><ProgramResultsPanel v-bind="args" /></div>',
  }),
} satisfies Meta<typeof ProgramResultsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Program: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Running')).toBeVisible()
    await expect(canvas.getByRole('tab', { name: 'Program' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  },
}

export const ResultsTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('tab', { name: 'Results' }))

    await expect(canvas.getByRole('tab', { name: 'Results' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getAllByText('Final')).toHaveLength(2)
    await expect(canvas.getByText('3rd Lap · 1600m in progress…')).toBeVisible()
  },
}
