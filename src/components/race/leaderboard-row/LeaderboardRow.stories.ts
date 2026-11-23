import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LeaderboardRow from './LeaderboardRow.vue'

const meta = {
  title: 'Race/LeaderboardRow',
  component: LeaderboardRow,
  tags: ['autodocs'],
  args: {
    rank: 1,
    color: '#DF4545',
    name: 'Secretariat',
    meta: '0:12.84',
    divider: true,
  },
  argTypes: {
    rank: { control: { type: 'number', min: 1, max: 10 } },
    color: { control: 'color' },
  },
  render: (args) => ({
    components: { LeaderboardRow },
    setup: () => ({ args }),
    template: '<div class="w-[260px]"><LeaderboardRow v-bind="args" /></div>',
  }),
} satisfies Meta<typeof LeaderboardRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoDivider: Story = {
  args: { divider: false },
}
