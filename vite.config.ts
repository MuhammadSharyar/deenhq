import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    allowedHosts: ['deenhq.eu.ngrok.io']
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({

      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'favicon.svg'],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/gh\/fawazahmed0\/hadith-api@1\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'hadith-api-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'DeenHQ',
        short_name: 'DeenHQ',
        description: 'Privacy-first Islamic Utility PWA',
        theme_color: '#0d9488',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
});
