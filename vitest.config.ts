import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      threshold: {
        global: {
          branches: 70,
          functions: 75,
          lines: 75,
          statements: 75,
        },
      },
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/**/*.bench.ts',
        'test/**',
        'dist/**',
        'src/__mocks__/**',
        '**/node_modules/**',
        '**/coverage/**',
        '**/release/**',
        '**/docs/**',
        '**/*.config.*',
      ],
    },
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/release/**',
      '**/docs/**',
      '**/__mocks__/**',
      '**/test/**',
    ],
  },
  resolve: {
    alias: {
      'vscode': new URL('./src/__mocks__/vscode.ts', import.meta.url).pathname,
      'vscode-nls': new URL('./src/__mocks__/vscode-nls.ts', import.meta.url).pathname,
    },
  },
})

