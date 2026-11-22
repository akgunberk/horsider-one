import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Play } from '@lucide/vue'
import Button from './Button.vue'
import { buttonVariants } from '.'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
  },
  render: (args) => ({
    components: { Button, Play },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { Button, Play },
    setup: () => ({ args }),
    template: `<Button v-bind="args">
      <Play />
      <span>Start Race</span>
    </Button>`,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({
      variants: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    }),
    template: `<div class="flex flex-wrap items-center gap-3">
      <Button v-for="variant in variants" :key="variant" :variant="variant">Button</Button>
    </div>`,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Button, Play },
    setup: () => ({
      sizes: ['xs', 'sm', 'default', 'lg'],
    }),
    template: `<div class="flex flex-wrap items-center gap-3">
      <Button v-for="size in sizes" :key="size" :size="size">
        <Play />
        <span>Button</span>
      </Button>
    </div>`,
  }),
}

export const Disabled: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" disabled>Button</Button>',
  }),
}

export const VariantsExport: Story = {
  name: 'Variants (code reference)',
  render: () => ({
    setup: () => ({ classes: buttonVariants({ variant: 'outline', size: 'sm' }) }),
    template: '<code class="text-xs">{{ classes }}</code>',
  }),
}
