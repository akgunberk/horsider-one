import type { StorybookConfig } from '@storybook/vue3-vite';

// Set only for subpath deploys (GitHub Pages). Keeps Vitest/Chromatic on the default base.
const base = process.env.SB_BASE;

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/vue3-vite",
  ...(base
    ? {
        viteFinal: (viteConfig) => ({ ...viteConfig, base }),
        managerHead: (head: string) => `${head}<base href="${base}">`,
      }
    : {}),
};
export default config;