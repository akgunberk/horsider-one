import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { horses } from '@/data/mockRace'
import HorseRoster from './HorseRoster.vue'

const meta = {
  title: 'Race/HorseRoster',
  component: HorseRoster,
  tags: ['autodocs'],
  args: {
    horses,
  },
  render: (args) => ({
    components: { HorseRoster },
    setup: () => ({ args }),
    template: '<div class="w-[320px]"><HorseRoster v-bind="args" /></div>',
  }),
} satisfies Meta<typeof HorseRoster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { name: 'Horses' })).toBeVisible()
    await expect(canvas.getByText('Frankel')).toBeVisible()
    await expect(canvas.getAllByText('20').length).toBeGreaterThan(0)
  },
}

export const Empty: Story = {
  args: { horses: [] },
}
