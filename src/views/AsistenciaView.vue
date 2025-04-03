<template>
  <div>
    <asistencia-form
      @submit="handleRegistroAsistencia"
      ref="asistenciaForm"
    />

    <div v-if="mostrarMensaje" class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registro Exitoso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" @click="cerrarMensaje"></button>
          </div>
          <div class="modal-body">
            <p>DNI: {{ dniRegistrado }}</p>
            <p>Fecha: {{ fechaRegistro }}</p>
            <p>Hora: {{ horaRegistro }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cerrarMensaje">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AsistenciaForm from '../components/AsistenciaForm.vue';
import { useAsistenciaApi } from '../useAsistenciaApi';

const asistenciaForm = ref(null);
const { error, loading, marcarAsistencia } = useAsistenciaApi();
const mostrarMensaje = ref(false);
const dniRegistrado = ref('');
const fechaRegistro = ref('');
const horaRegistro = ref('');

const handleRegistroAsistencia = async (formData) => {
  asistenciaForm.value.setLoading(true);
  const { dni, ubicacion, foto } = formData;
  await marcarAsistencia(dni, ubicacion, foto);
  asistenciaForm.value.setLoading(false);

  if (!error.value) {
    dniRegistrado.value = dni;
    fechaRegistro.value = new Date().toLocaleDateString();
    horaRegistro.value = new Date().toLocaleTimeString();
    mostrarMensaje.value = true;
    asistenciaForm.value.resetForm();
  } else {
    asistenciaForm.value.setError(error.value.message || 'Error al registrar la asistencia');
    // Opcional: limpiar el error después de un tiempo
    setTimeout(() => {
      asistenciaForm.value.setError(null);
    }, 3000);
  }
};

const cerrarMensaje = () => {
  mostrarMensaje.value = false;
};
</script>