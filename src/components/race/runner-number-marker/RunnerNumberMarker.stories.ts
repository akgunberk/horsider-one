import type { Meta, StoryObj } from '@storybook/vue3-vite'
import RunnerNumberMarker from './RunnerNumberMarker.vue'

const meta = {
  title: 'Race/RunnerNumberMarker',
  component: RunnerNumberMarker,
  tags: ['autodocs'],
  args: {
    number: 7,
    color: '#DF4545',
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
  args: { number: 1, color: '#3B82F6' },
}

export const AllLanes: Story = {
  render: () => ({
    components: { RunnerNumberMarker },
    setup: () => ({
      runners: [
        { number: 1, color: '#3B82F6' },
        { number: 2, color: '#F59E0B' },
        { number: 3, color: '#10B981' },
        { number: 4, color: '#8B5CF6' },
        { number: 5, color: '#EC4899' },
        { number: 6, color: '#14B8A6' },
        { number: 7, color: '#DF4545' },
        { number: 8, color: '#6366F1' },
        { number: 9, color: '#84CC16' },
        { number: 10, color: '#F97316' },
      ],
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
