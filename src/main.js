import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Función para detectar si es un dispositivo móvil o tablet
function esMobileOTablet() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
}

// Solo registrar el service worker en dispositivos móviles o tablets
if ('serviceWorker' in navigator && esMobileOTablet()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Service Worker registrado con éxito en dispositivo móvil:', registration);
      })
      .catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
      });
  });
} else {
  console.log('Service Worker no registrado: no es un dispositivo móvil o tablet');
}

// Compartir la función de detección con la aplicación
const app = createApp(App);
app.config.globalProperties.$esMobileOTablet = esMobileOTablet;
app.use(router);
app.mount('#app');