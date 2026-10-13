import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        safari: (16 << 16),
        chrome: (110 << 16),
        firefox: (110 << 16)
      },
      cssModules: {
        dashedIndents: true,
        localsConvention: 'camelCaseOnly'
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
  build: {
    cssMinify: 'lightningcss'
  }
})
