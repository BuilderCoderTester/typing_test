import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // Add this
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://typing-test-7w2y.vercel.app/',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})