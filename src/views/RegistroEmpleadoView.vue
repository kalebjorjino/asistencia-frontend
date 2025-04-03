<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 class="text-3xl font-weight-bold mb-4 text-secondary text-center">Registro de Empleado</h2>
      <EmpleadoForm @submit="handleRegistro" :validationErrors="errors" />
      <p v-if="registroExitoso" class="text-green-500 text-sm italic mt-4">Empleado registrado!</p>
      <p v-if="registroError" class="text-red-500 text-sm italic mt-4">{{ registroError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useEmpleadoApi } from '../useEmpleadoApi'; // Asegúrate de la ruta correcta
import EmpleadoForm from '../components/EmpleadoForm.vue';

const errors = ref({});
const registroExitoso = ref(false);
const registroError = ref('');
const { error, loading, crearEmpleado  } = useEmpleadoApi();

const handleRegistro = async (empleadoData) => {
  errors.value = {};
  registroExitoso.value = false;
  registroError.value = '';

  const response = await crearEmpleado (
    empleadoData.dni,
    empleadoData.nombre,
    empleadoData.profesion
  );

  if (response) {
    if (response.status === 201) {
      registroExitoso.value = true;
      // Opcional: Limpiar el formulario aquí o en el componente hijo
    } else if (response.status === 400) {
      const data = await response.json();
      errors.value = data.errors.reduce((acc, err) => {
        acc[err.path] = acc[err.path] || [];
        acc[err.path].push(err.msg);
        return acc;
      }, {});
    } else if (response.status === 409) {
      const data = await response.json();
      registroError.value = data.message;
    } else {
      registroError.value = 'Error al registrar el empleado.';
      console.error('Error en el registro:', response);
    }
  } else if (error.value) {
    registroError.value = 'Error de conexión con el servidor.';
    console.error('Error al conectar con la API:', error.value);
  }
};
</script>