import { setup, type Preview } from '@storybook/vue3-vite'
import { createPinia } from 'pinia'

import '../src/style.css'

setup((app) => {
  app.use(createPinia())
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    chromatic: {
      // Give fonts and first paint time to settle before capturing.
      delay: 300,
      // Emulate reduced motion so transitions never leak into snapshots.
      prefersReducedMotion: 'reduce',
      pauseAnimationAtEnd: true,
      diffThreshold: 0.063,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
