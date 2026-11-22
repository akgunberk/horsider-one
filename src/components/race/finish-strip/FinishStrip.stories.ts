import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FinishStrip from './FinishStrip.vue'

const meta = {
  title: 'Race/FinishStrip',
  component: FinishStrip,
  tags: ['autodocs'],
  render: () => ({
    components: { FinishStrip },
    template: `<div class="flex items-center gap-4 text-foreground">
      <FinishStrip />
      <FinishStrip class="h-16 w-2" />
      <FinishStrip class="h-8 w-24" />
    </div>`,
  }),
} satisfies Meta<typeof FinishStrip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
