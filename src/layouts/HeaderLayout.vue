<template>
  <header class="app-header bg-light border-bottom shadow-sm py-3">
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light">
        <router-link to="/" class="navbar-brand font-weight-bold text-dark">
          <img src="../assets/logo.png" alt="Logo" height="30" class="d-inline-block align-top mr-2">
          Sistema de Asistencia
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="showAsistencia">
              <router-link to="/asistencia" class="nav-link text-secondary">
                <i class="bi bi-check-circle-fill me-1"></i> Asistencia
              </router-link>
            </li>
            <li class="nav-item" v-if="showLogin">
              <router-link to="/login" class="nav-link text-secondary">
                <i class="bi bi-person-fill me-1"></i> Inicio de Sesión
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Asegúrate de tener Bootstrap Icons instalados

const route = useRoute();
const router = useRouter();
const showAsistencia = ref(false);
const showLogin = ref(true);

watch(() => route.path, (newPath) => {
  if (newPath === '/login') {
    showAsistencia.value = true;
    showLogin.value = false;
  } else if (newPath === '/asistencia') {
    showAsistencia.value = false;
    showLogin.value = true;
  } else {
    // Define el comportamiento por defecto si estás en otra ruta
    showAsistencia.value = false;
    showLogin.value = true;
  }
});

onMounted(() => {
  // Comprueba la ruta inicial al montar el componente
  if (route.path === '/login') {
    showAsistencia.value = true;
    showLogin.value = false;
  } else if (route.path === '/asistencia') {
    showAsistencia.value = false;
    showLogin.value = true;
  }
});
</script>

<style scoped>
.navbar-brand:hover {
  color: #343a40; /* Dark text color on hover */
}

.nav-link:hover {
  color: #007bff; /* Primary color on hover */
}
</style>