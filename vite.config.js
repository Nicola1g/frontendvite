import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, '') // /api/auth -> /auth
      }
    }
  }
})

//  Axios '/api' che div api.get('/auth/me').
// Il browser chiama http://localhost:5173/api/auth/me.
// Vite vede che il path inizia con /api → lo proxa a http://localhost:5000/auth/me