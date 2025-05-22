<script setup>
import { RouterView } from 'vue-router';
import { getCurrentInstance, ref, onMounted } from 'vue';

const instance = getCurrentInstance();
const esMobileOTablet = ref(false);

// 🔴 Variable para guardar el evento del prompt
let deferredPrompt = null;

onMounted(() => {
  if (instance && instance.appContext.config.globalProperties.$esMobileOTablet) {
    esMobileOTablet.value = instance.appContext.config.globalProperties.$esMobileOTablet();
  }

  // ✅ Captura el evento cuando el navegador está listo para instalar la PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();         // Evita que el navegador lo muestre automáticamente
    deferredPrompt = e;         // Guarda el evento para usarlo luego
    e.prompt();                 // Muestra el prompt de instalación de inmediato

    // ✅ Opcional: puedes registrar si el usuario acepta o no
    e.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar la app');
      } else {
        console.log('El usuario rechazó la instalación');
      }
    });
  });
});
</script>

<template>
  <div v-if="esMobileOTablet">
    <router-view></router-view>
  </div>
  <div v-else class="pc-bloqueado">
    <div class="mensaje-contenedor">
      <h1>Acceso solo desde dispositivos móviles</h1>
      <p>Esta aplicación está diseñada exclusivamente para su uso en celulares y tablets.</p>
      <p>Por favor, accede desde un dispositivo móvil para utilizar la aplicación de registro de asistencia.</p>
      <div class="dispositivos-iconos">
        <span class="icono">📱</span>
        <span class="icono">📲</span>
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.pc-bloqueado {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  text-align: center;
}

.mensaje-contenedor {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 500px;
  margin: 0 1rem;
}

.mensaje-contenedor h1 {
  color: #e74c3c;
  margin-bottom: 1.5rem;
}

.mensaje-contenedor p {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.dispositivos-iconos {
  margin-top: 2rem;
}

.icono {
  font-size: 3rem;
  margin: 0 0.5rem;
}
</style>
