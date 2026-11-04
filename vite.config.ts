import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: 'dist',
  },
  root: 'src/visual',
  resolve: {
    alias: {
      src: resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    root: resolve(import.meta.dirname, '.'),
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/algorithm/**', 'src/datastructure/**', 'src/util/**'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'node_modules',
        'dist',
        '**/dist/**',
      ],
    },
  },
})
