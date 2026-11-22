import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import AutoAdvanceBar from './AutoAdvanceBar.vue'

const meta = {
  title: 'Race/AutoAdvanceBar',
  component: AutoAdvanceBar,
  tags: ['autodocs'],
  args: {
    next: '4th Lap · 1800m',
    countdown: 'in 5s',
    startLabel: 'Start Now (4s)',
    compact: false,
  },
  render: (args) => ({
    components: { AutoAdvanceBar },
    setup: () => ({ args }),
    template: '<AutoAdvanceBar v-bind="args" />',
  }),
} satisfies Meta<typeof AutoAdvanceBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Stop Auto-Advance' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Start Now (4s)' }))

    await expect(canvas.getByText('in 5s')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Start Now (4s)' })).toBeEnabled()
  },
}

export const Compact: Story = {
  args: {
    compact: true,
    startLabel: 'Start (4s)',
  },
  render: (args) => ({
    components: { AutoAdvanceBar },
    setup: () => ({ args }),
    template: '<div class="w-[360px]"><AutoAdvanceBar v-bind="args" /></div>',
  }),
}

export const Paused: Story = {
  args: {
    next: '4th Lap · 1800m',
    countdown: 'stopped',
    progress: 40,
    paused: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Resume Auto-Advance' })).toBeEnabled()
    await expect(canvas.queryByRole('button', { name: 'Stop Auto-Advance' })).toBeNull()
  },
}

export const LastCountdown: Story = {
  args: {
    next: '6th Lap · 2200m',
    countdown: 'in 1s',
    startLabel: 'Start Now (1s)',
  },
}
