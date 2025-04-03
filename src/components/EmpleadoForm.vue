<template>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="dni" class="block text-gray-700 text-sm font-bold mb-2">DNI:</label>
        <input
          type="text"
          id="dni"
          v-model="formData.dni"
          class="form-control"
        />
        <p v-if="errors.dni" class="text-red-500 text-xs italic">{{ errors.dni[0] }}</p>
      </div>
  
      <div class="mb-4">
        <label for="nombre" class="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
        <input
          type="text"
          id="nombre"
          v-model="formData.nombre"
          class="form-control"
        />
        <p v-if="errors.nombre" class="text-red-500 text-xs italic">{{ errors.nombre[0] }}</p>
      </div>
  
      <div class="mb-6">
        <label for="profesion" class="block text-gray-700 text-sm font-bold mb-2">Profesión:</label>
        <input
          type="text"
          id="profesion"
          v-model="formData.profesion"
          class="form-control"
        />
        <p v-if="errors.profesion" class="text-red-500 text-xs italic">{{ errors.profesion[0] }}</p>
      </div>
  <br>
      <button
        type="submit"
        class="btn btn-primary w-100"
      >
        Registrar Empleado
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const formData = ref({
    dni: '',
    nombre: '',
    profesion: '',
  });
  
  const errors = ref({});
  const emit = defineEmits(['submit']);
  
  const submitForm = () => {
    emit('submit', formData.value);
  };
  
  const props = defineProps({ // Declare props and assign to a 'props' variable (optional but clearer)
    validationErrors: {
      type: Object,
      default: () => ({}),
    },
  });
  
  watch(() => props.validationErrors, (newErrors) => {
    errors.value = newErrors;
  });
  </script>