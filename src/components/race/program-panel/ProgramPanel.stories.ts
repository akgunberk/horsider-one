import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { currentRound, programRounds } from '@/data/mockRace'
import ProgramPanel from './ProgramPanel.vue'

const meta = {
  title: 'Race/ProgramPanel',
  component: ProgramPanel,
  tags: ['autodocs'],
  args: {
    rounds: programRounds,
    activeRound: currentRound.round,
  },
  render: (args) => ({
    components: { ProgramPanel },
    setup: () => ({ args }),
    template: '<div class="w-[340px]"><ProgramPanel v-bind="args" /></div>',
  }),
} satisfies Meta<typeof ProgramPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const details = canvasElement.querySelectorAll('details')
    const active = details[2]
    const first = details[0]

    if (!active || !first) throw new Error('Expected six round disclosures')

    await expect(details).toHaveLength(6)
    await expect(active).toHaveAttribute('open')

    await userEvent.click(within(active as HTMLElement).getByText('3rd Lap'))
    await expect(active).not.toHaveAttribute('open')

    await userEvent.click(within(first as HTMLElement).getByText('1st Lap'))
    await expect(first).toHaveAttribute('open')
  },
}
