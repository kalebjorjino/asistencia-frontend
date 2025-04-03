import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'auto',
      manifest: {
        name: 'Registro de Asistencia',
        short_name: 'Asistencia',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/img/icons/image1.png', // Reemplaza con tus iconos
            sizes: '192x192',
            type: 'image/png',
            
          },
          {
            src: '/img/icons/image2.png', // Reemplaza con tus iconos
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,img,svg,png,jpg,jpeg}'],
      },
    }),
  ],
})
