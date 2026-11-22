import type { Meta, StoryObj } from '@storybook/vue3-vite'
import RoundLeaderBanner from './RoundLeaderBanner.vue'

const meta = {
  title: 'Race/RoundLeaderBanner',
  component: RoundLeaderBanner,
  tags: ['autodocs'],
  args: {
    name: 'Frankel',
    number: 4,
    color: '#3B82F6',
    lap: 3,
  },
  argTypes: {
    number: { control: { type: 'number', min: 1, max: 20 } },
    color: { control: 'color' },
    lap: { control: { type: 'number', min: 1, max: 6 } },
  },
  render: (args) => ({
    components: { RoundLeaderBanner },
    setup: () => ({ args }),
    template: '<div class="w-[340px]"><RoundLeaderBanner v-bind="args" /></div>',
  }),
} satisfies Meta<typeof RoundLeaderBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  render: (args) => ({
    components: { RoundLeaderBanner },
    setup: () => ({ args }),
    template: '<div class="w-[320px]"><RoundLeaderBanner v-bind="args" /></div>',
  }),
}
