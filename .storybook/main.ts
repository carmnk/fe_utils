import type { StorybookConfig } from '@storybook/react-vite'
import tsconfig from "../tsconfig.json"

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    // {
    //   name: '@ts2doc/storybook-addon',
    //   options: {
    //     patternDocType: 'src/**/*.ts',
    //     compilerOptions: tsconfig.compilerOptions
    //   },
    // },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
