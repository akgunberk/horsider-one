import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import HorseRosterRow from './HorseRosterRow.vue'

const meta = {
  title: 'Race/HorseRosterRow',
  component: HorseRosterRow,
  tags: ['autodocs'],
  args: {
    rank: 4,
    name: 'Frankel',
    color: '#c82829',
    condition: 99,
  },
  render: (args) => ({
    components: { HorseRosterRow },
    setup: () => ({ args }),
    template: '<div class="w-[320px]"><HorseRosterRow v-bind="args" /></div>',
  }),
} satisfies Meta<typeof HorseRosterRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Frankel')).toBeVisible()
    await expect(canvas.getByText('99')).toBeVisible()
  },
}

export const LowCondition: Story = {
  args: {
    rank: 12,
    name: 'Shergar',
    color: '#be185d',
    condition: 18,
  },
}
