import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tokyo_viewshed_web/',
  server: {
    // ngrokのURLが変わっても大丈夫なように「すべて許可」にする設定
    allowedHosts: true,
  },
})
