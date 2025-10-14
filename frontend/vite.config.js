import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dev-time proxy so frontend can call /api/* without specifying host/port
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8050',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
