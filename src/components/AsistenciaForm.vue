<template>
    <div class="bg-white d-flex flex-column align-items-center min-vh-100 p-3">
      <div class="w-100 mb-3 d-flex justify-content-center">
        <div class="rounded-clock">
          <span class="time">{{ currentTime }}</span>
        </div>
      </div>
      <div class="container">
        <div class="card shadow">
          <h2 class="card-title text-center mb-4 ">MEGABOTIKAS E.I.R.L</h2>
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4  fw-bold">REGISTRO ASISTENCIA</h2>
            <form @submit.prevent="emit('submit', formData)">
              <div class="mb-3">
                <label for="dni" class="form-label fw-bold">DNI:</label>
                <input
                  type="number"
                  id="dni"
                  v-model="formData.dni"
                  class="form-control"
                  placeholder="Ingrese su DNI"
                  required
                />
              </div>
  
              <div class="mb-3">
                <label for="ubicacion" class="form-label fw-bold">Ubicación:</label>
                <input
                  type="text"
                  id="ubicacion"
                  v-model="formData.ubicacion"
                  class="form-control"
                  disabled
                />
              </div>
  
              <div class="mb-3">
                <button
                  type="button"
                  class="btn btn-secondary form-control"
                  @click="triggerCamera"
                >
                  Abrir Cámara
                </button>
                <input
                  ref="inputFile"
                  type="file"
                  id="foto"
                  accept="image/*"
                  capture="camera"
                  @change="handleFileUpload"
                  class="d-none"
                />
                <div v-if="formData.foto" class="mt-2 d-flex justify-content-center">
                  <img
                    :src="previewImage"
                    alt="Foto de Asistencia"
                    class="img-fluid rounded"
                    style="max-height: 150px;"
                  />
                </div>
              </div>
  
              <button type="submit" class="btn btn-primary btn-block form-control">
                Asistencia
              </button>
            </form>
  
            <div v-if="loading" class="text-center mt-3 text-muted">Cargando...</div>
            <div v-if="error" class="text-danger mt-3">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
  import { useGeolocation } from '@vueuse/core';
  
  const emit = defineEmits(['submit']);
  
  const formData = reactive({
    dni: '',
    ubicacion: '',
    foto: null,
  });
  
  const inputFile = ref(null);
  const previewImage = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const currentTime = ref('');
  let intervalId;
  
  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTime.value = `${hours}:${minutes}:${seconds}`;
  };
  
  onMounted(() => {
    updateTime();
    intervalId = setInterval(updateTime, 1000);
  });
  
  onUnmounted(() => {
    clearInterval(intervalId);
  });
  
  const { coords, isSupported: isGeolocationSupported, error: geolocationError } = useGeolocation();
  
  if (isGeolocationSupported) {
    watch(coords, (newCoords) => {
      if (newCoords) {
        formData.ubicacion = `Latitud: ${newCoords.latitude.toFixed(6)}, Longitud: ${newCoords.longitude.toFixed(6)}`;
      }
    });
  
    watch(geolocationError, (newError) => {
      if (newError) {
        console.error('Error al obtener la ubicación:', newError);
        formData.ubicacion = 'Ubicación no disponible';
      }
    });
  } else {
    formData.ubicacion = 'Geolocalización no soportada por el navegador';
  }
  
  const triggerCamera = () => {
    inputFile.value.click();
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    formData.foto = file;
    if (file) {
      previewImage.value = URL.createObjectURL(file);
    } else {
      previewImage.value = null;
    }
  };
  
  defineExpose({
    resetForm: () => {
      formData.dni = '';
      formData.foto = null;
      previewImage.value = null;
      if (inputFile.value) {
        inputFile.value.value = ''; // Clear the file input
      }
    },
    setLoading: (value) => {
      loading.value = value;
    },
    setError: (message) => {
      error.value = message;
    },
  });
  </script>
  
  <style scoped>
  .rounded-clock {
    width: 200px; /* Ajusta el tamaño según necesites */
    height: 200px;
    background-color: #f0f0f0; /* Color de fondo del reloj */
    border-radius: 50%; /* Hace que el div sea un círculo */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .time {
    font-size: 5em; /* Ajusta el tamaño del texto de la hora */
    font-weight: bold;
    color: #333; /* Color del texto de la hora */
  }
  </style>