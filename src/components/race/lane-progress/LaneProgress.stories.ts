import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { horseColors } from '@/data/horseColors'
import LaneProgress from './LaneProgress.vue'

const meta = {
  title: 'Race/LaneProgress',
  component: LaneProgress,
  tags: ['autodocs'],
  args: {
    lane: 1,
    number: 7,
    name: 'Secretariat',
    color: horseColors[0]!,
    progress: 52,
    compact: false,
  },
  argTypes: {
    lane: { control: { type: 'number', min: 1, max: 10 } },
    number: { control: { type: 'number', min: 1, max: 20 } },
    color: { control: 'color' },
    progress: { control: { type: 'range', min: 0, max: 100 } },
  },
  render: (args) => ({
    components: { LaneProgress },
    setup: () => ({ args }),
    template: '<div class="w-[440px]"><LaneProgress v-bind="args" /></div>',
  }),
} satisfies Meta<typeof LaneProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Start: Story = {
  args: { progress: 0 },
}

export const Finish: Story = {
  args: { progress: 100 },
}

export const Compact: Story = {
  args: { compact: true, name: undefined },
  render: (args) => ({
    components: { LaneProgress },
    setup: () => ({ args }),
    template: '<div class="w-[270px]"><LaneProgress v-bind="args" /></div>',
  }),
}

export const Field: Story = {
  render: () => ({
    components: { LaneProgress },
    setup: () => ({
      runners: [
        { lane: 1, number: 7, name: 'Secretariat', color: horseColors[0]!, progress: 72 },
        { lane: 2, number: 4, name: 'Frankel', color: horseColors[3]!, progress: 64 },
        { lane: 3, number: 12, name: 'Man o’ War', color: horseColors[2]!, progress: 58 },
        { lane: 4, number: 9, name: 'Seabiscuit', color: horseColors[5]!, progress: 45 },
        { lane: 5, number: 15, name: 'Phar Lap', color: horseColors[6]!, progress: 31 },
      ],
    }),
    template: `<div class="flex w-[520px] flex-col gap-2">
      <LaneProgress
        v-for="runner in runners"
        :key="runner.lane"
        v-bind="runner"
      />
    </div>`,
  }),
}
