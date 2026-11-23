import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { horseColors } from '@/data/horseColors'
import RunnerNumberMarker from './RunnerNumberMarker.vue'

const meta = {
  title: 'Race/RunnerNumberMarker',
  component: RunnerNumberMarker,
  tags: ['autodocs'],
  args: {
    number: 7,
    color: horseColors[0]!,
  },
  argTypes: {
    number: { control: { type: 'number', min: 1, max: 20 } },
    color: { control: 'color' },
  },
  render: (args) => ({
    components: { RunnerNumberMarker },
    setup: () => ({ args }),
    template: '<RunnerNumberMarker v-bind="args" />',
  }),
} satisfies Meta<typeof RunnerNumberMarker>

export default meta
type Story = StoryObj<typeof meta>

export const NumberSeven: Story = {}

export const NumberOne: Story = {
  args: { number: 1, color: horseColors[3]! },
}

export const AllLanes: Story = {
  render: () => ({
    components: { RunnerNumberMarker },
    setup: () => ({
      runners: horseColors.slice(0, 10).map((color, index) => ({
        number: index + 1,
        color,
      })),
    }),
    template: `<div class="flex flex-wrap items-center gap-2">
      <RunnerNumberMarker
        v-for="runner in runners"
        :key="runner.number"
        :number="runner.number"
        :color="runner.color"
      />
    </div>`,
  }),
}
