import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MyPage from './Page.vue'

const meta = {
  title: 'Example/Page',
  component: MyPage,
  render: () => ({
    components: { MyPage },
    template: '<my-page />',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    // Scaffolding from the Vite template; not part of the app surface.
    chromatic: { disableSnapshot: true },
  },
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof MyPage>

export default meta
type Story = StoryObj<typeof meta>

export const LoggedOut: Story = {}
