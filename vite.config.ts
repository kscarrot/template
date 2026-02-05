import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  root: 'src/visual',
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
  test: {
    root: resolve(__dirname, '.'),
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/algorithm/**', 'src/datastructure/**', 'src/util/**'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'node_modules', 'dist', '**/dist/**'],
    },
  },
})
