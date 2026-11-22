import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './Badge.vue'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'accent', 'destructive'],
    },
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: '<Badge v-bind="args">Badge</Badge>',
  }),
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Accent: Story = {
  args: { variant: 'accent' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const AllVariants: Story = {
  render: () => ({
    components: { Badge },
    setup: () => ({
      variants: ['default', 'secondary', 'outline', 'accent', 'destructive'],
    }),
    template: `<div class="flex flex-wrap items-center gap-3">
      <Badge v-for="variant in variants" :key="variant" :variant="variant">Badge</Badge>
    </div>`,
  }),
}
