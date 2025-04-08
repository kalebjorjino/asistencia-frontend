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
          <h2 class="card-title text-center mb-4 fw-bold">REGISTRO ASISTENCIA</h2>
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
              <label for="local_id" class="form-label fw-bold">Local:</label>
              <select
                id="local_id"
                v-model="formData.local_id"
                class="form-select"
                required
              >
                <option value="" disabled>Seleccione un local</option>
                <option v-for="local in locales" :key="local.local_id" :value="local.local_id">
                  {{ local.local_nom }}
                </option>
              </select>
              <div v-if="errorLocales" class="text-danger mt-1">{{ errorLocales }}</div>
              <div v-if="loadingLocales" class="text-muted mt-1">Cargando locales...</div>
            </div>

            <div class="mb-3">
              <label for="ubicacion" class="form-label fw-bold">Ubicación:</label>
              <input
                type="text"
                id="ubicacion"
                v-model="formData.ubicacion"
                class="form-control"
                disabled
                required
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
                required
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

            <button
              type="submit"
              class="btn btn-primary btn-block form-control"
              :disabled="!formData.foto || loadingLocales || loading"
            >
              Asistencia
            </button>
          </form>

          <div v-if="loading" class="text-center mt-3 text-muted">Enviando asistencia...</div>
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
  local_id: '', // Campo corregido para coincidir con el v-model
  ubicacion: '',
  foto: null,
});

const inputFile = ref(null);
const previewImage = ref(null);
const loading = ref(false);
const error = ref(null);
const currentTime = ref('');
let intervalId;

// Nuevos refs para la lógica del select de Locales
const locales = ref([]);
const loadingLocales = ref(false);
const errorLocales = ref(null);

// Función para obtener los locales desde la API
const fetchLocales = async () => {
  loadingLocales.value = true;
  errorLocales.value = null;
  try {
    const response = await fetch('https://www.megabotikas.com/api/controller/local.php?op=combo');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text(); // La respuesta del PHP es HTML de las opciones
    const tempElement = document.createElement('div');
    tempElement.innerHTML = data;
    const options = tempElement.querySelectorAll('option');
    const localesArray = [];
    options.forEach(option => {
      if (option.value !== '') { // Excluir la opción "Selecciona"
        localesArray.push({
          local_id: option.value,
          local_nom: option.textContent
        });
      }
    });
    locales.value = localesArray;
  } catch (e) {
    console.error('Error al obtener los locales:', e);
    errorLocales.value = 'Error al cargar los locales. Por favor, intente de nuevo.';
  } finally {
    loadingLocales.value = false;
  }
};

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
  fetchLocales(); // Llama a la función para obtener los locales al montar el componente
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
    formData.local_id = ''; // Resetear el campo de local
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
  width: 200px;
  /* Ajusta el tamaño según necesites */
  height: 200px;
  background-color: #f0f0f0;
  /* Color de fondo del reloj */
  border-radius: 50%;
  /* Hace que el div sea un círculo */
  display: flex;
  justify-content: center;
  align-items: center;
}

.time {
  font-size: 5em;
  /* Ajusta el tamaño del texto de la hora */
  font-weight: bold;
  color: #333;
  /* Color del texto de la hora */
}
</style>