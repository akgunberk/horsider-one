// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/storybook-static/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/*.spec.ts'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  ...storybook.configs['flat/recommended'],

  {
    name: 'app/types-boundaries',
    files: ['src/types/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vue',
              message: 'src/types/ must contain pure domain types with zero Vue imports (see docs/architecture.md).',
            },
            {
              name: 'pinia',
              message: 'src/types/ must contain pure domain types with zero Pinia imports (see docs/architecture.md).',
            },
            {
              name: '@vueuse/core',
              message: 'src/types/ must contain pure domain types with zero VueUse imports (see docs/architecture.md).',
            },
          ],
          patterns: [
            {
              group: [
                '@/lib/*',
                '@/stores/*',
                '@/composables/*',
                '@/components/*',
                '@/data/*',
                '../lib/*',
                '../stores/*',
                '../composables/*',
                '../components/*',
                '../data/*',
              ],
              message:
                'src/types/ is the leaf contract layer and must not import from higher layers (see docs/architecture.md).',
            },
          ],
        },
      ],
    },
  },

  {
    name: 'app/lib-boundaries',
    files: ['src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vue',
              message: 'src/lib/ must be pure TypeScript with zero Vue imports (see docs/architecture.md).',
            },
            {
              name: 'pinia',
              message: 'src/lib/ must be pure TypeScript with zero Pinia imports (see docs/architecture.md).',
            },
            {
              name: '@vueuse/core',
              message: 'src/lib/ must be pure TypeScript with zero VueUse imports (see docs/architecture.md).',
            },
          ],
          patterns: [
            {
              group: [
                '@/stores/*',
                '@/composables/*',
                '@/components/*',
                '@/data/*',
                '../stores/*',
                '../composables/*',
                '../components/*',
                '../data/*',
              ],
              message:
                'src/lib/ may only import from src/types/ and sibling src/lib/ modules (see docs/architecture.md).',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
          message: 'Never call raw Math.random() in src/lib/. Inject rng: RngFn instead (see AGENTS.md).',
        },
      ],
    },
  },

  {
    name: 'app/store-boundaries',
    files: ['src/stores/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/composables/*', '@/components/*', '../composables/*', '../components/*'],
              message: 'src/stores/ may only import data, lib, and types (see docs/architecture.md).',
            },
          ],
        },
      ],
    },
  },

  {
    name: 'app/composable-boundaries',
    files: ['src/composables/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/components/*', '../components/*'],
              message: 'src/composables/ must not import components (see docs/architecture.md).',
            },
          ],
        },
      ],
    },
  },

  skipFormatting,
)
