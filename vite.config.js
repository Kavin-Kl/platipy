import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: true,
    proxy: {
      '/genius': {
        target: 'https://api.genius.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/genius/, ''),
      },
    },
  },
  plugins: [react(), tailwindcss(), mkcert()],
})
