import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import AppHeader from './AppHeader.vue'

const meta = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  args: {
    status: 'Scheduled · Round 1 of 6',
    phase: 'SCHEDULED',
    canGenerate: true,
    canPrimary: true,
    generateLabel: 'Regenerate',
    primaryLabel: 'Start Race',
  },
  render: (args) => ({
    components: { AppHeader },
    setup: () => ({ args }),
    template: '<AppHeader v-bind="args" />',
  }),
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { name: 'Horse Racing' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Regenerate' })).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Start Race' })).toBeEnabled()
  },
}

export const Running: Story = {
  args: {
    status: 'Live · Round 1 of 6',
    phase: 'RUNNING',
    canGenerate: false,
    canPrimary: true,
    generateLabel: 'Regenerate',
    primaryLabel: 'Pause',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Regenerate' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeEnabled()
  },
}

export const Paused: Story = {
  args: {
    status: 'Paused · Round 1 of 6',
    phase: 'PAUSED',
    canGenerate: true,
    canPrimary: true,
    generateLabel: 'Regenerate',
    primaryLabel: 'Resume',
  },
}
