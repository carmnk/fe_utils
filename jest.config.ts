import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/treeview/**',
    // '!**/table/**',
    // '!**/forms/**',
    '!**/icons/**',
    // '!**/vendor/**',
  ],
}

export default config
