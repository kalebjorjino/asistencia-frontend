import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // ✅ asegura que el SW se actualice automáticamente
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png'
      ], // ✅ estos archivos serán precacheados

      manifest: {
        name: 'Registro de Asistencia',
        short_name: 'Asistencia',
        description: 'App para registrar la asistencia de empleados',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // ✅ se abre como app nativa
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/img/icons/image1.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/icons/image2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // ✅ patrones más seguros
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
          }
        ]
      },
    }),
  ],
})

