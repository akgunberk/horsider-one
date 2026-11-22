import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ProgressRow from './ProgressRow.vue'

const meta = {
  title: 'Race/ProgressRow',
  component: ProgressRow,
  tags: ['autodocs'],
  args: {
    rank: 1,
    color: '#DF4545',
    name: 'Secretariat',
    progress: 75,
  },
  argTypes: {
    rank: { control: { type: 'number', min: 1, max: 10 } },
    color: { control: 'color' },
    progress: { control: { type: 'range', min: 0, max: 100 } },
  },
  render: (args) => ({
    components: { ProgressRow },
    setup: () => ({ args }),
    template: '<div class="w-[240px]"><ProgressRow v-bind="args" /></div>',
  }),
} satisfies Meta<typeof ProgressRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Finished: Story = {
  args: { progress: 100 },
}
