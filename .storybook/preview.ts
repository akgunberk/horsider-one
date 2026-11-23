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

    viewport: {
      options: {
        mobile: {
          name: 'Mobile (390×844)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (834×1112)',
          styles: { width: '834px', height: '1112px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1280×900)',
          styles: { width: '1280px', height: '900px' },
          type: 'desktop',
        },
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
      test: 'error',
    },
  },
}

export default preview
