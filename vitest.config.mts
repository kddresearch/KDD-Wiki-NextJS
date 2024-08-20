import { config } from "dotenv";
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'; 

export default defineConfig({
  plugins: react(),
  test: {
    environment: 'jsdom',
    // setupFiles: ['.env.local']
    env: {
      ...config({path: '.env.local'}).parsed,
    },
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
})