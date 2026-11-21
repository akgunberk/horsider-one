import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config.ts';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(viteConfig, defineConfig({
  test: {
    projects: [{
      extends: true,
      test: {
        name: 'unit',
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url))
      }
    }]
  }
}));