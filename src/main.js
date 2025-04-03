import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// ... otras importaciones
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error);
        });
    });
  }

  const app = createApp(App);
  app.use(router);
  app.mount('#app');