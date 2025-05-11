import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://2.137.35.207:3000')
  },
  server: {
    host: true
  }
})
