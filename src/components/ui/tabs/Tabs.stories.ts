import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Tabs from './Tabs.vue'
import TabsContent from './TabsContent.vue'
import TabsList from './TabsList.vue'
import TabsTrigger from './TabsTrigger.vue'

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    defaultValue: 'track',
  },
  render: (args) => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent },
    setup: () => ({ args }),
    template: `<Tabs v-bind="args" class="w-[280px]">
      <TabsList class="w-full">
        <TabsTrigger value="track">Track</TabsTrigger>
        <TabsTrigger value="horses">Horses</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>
      <TabsContent value="track" class="mt-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Track view
      </TabsContent>
      <TabsContent value="horses" class="mt-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Horses view
      </TabsContent>
      <TabsContent value="results" class="mt-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Results view
      </TabsContent>
    </Tabs>`,
  }),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ProgramResults: Story = {
  name: 'Program / Results',
  args: { defaultValue: 'program' },
  render: (args) => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent },
    setup: () => ({ args }),
    template: `<Tabs v-bind="args" class="w-[260px]">
      <TabsList class="w-full">
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>
      <TabsContent value="program" class="mt-3 text-sm text-muted-foreground">
        Six scheduled rounds
      </TabsContent>
      <TabsContent value="results" class="mt-3 text-sm text-muted-foreground">
        No rounds finished yet
      </TabsContent>
    </Tabs>`,
  }),
}
