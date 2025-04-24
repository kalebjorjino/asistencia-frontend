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
            <h5 class="modal-title">{{ mensajeModalTitulo }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" @click="cerrarMensaje"></button>
          </div>
          <div class="modal-body">
            <p>DNI: {{ dniRegistrado }}</p>
            <p>Local: {{ localRegistrado }}</p>
            <p v-if="horaEntradaRegistro">Hora de Entrada: {{ horaEntradaRegistro }}</p>
            <p v-if="horaSalidaRegistro">Hora de Salida: {{ horaSalidaRegistro }}</p>
            <p>Fecha: {{ fechaRegistro }}</p>
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
const mensajeModalTitulo = ref('');
const dniRegistrado = ref('');
const localRegistrado = ref('');
const fechaRegistro = ref('');
const horaEntradaRegistro = ref('');
const horaSalidaRegistro = ref('');
const dniNoExisteError = ref(null); // Nuevo ref para el error de DNI

const handleRegistroAsistencia = async (formData) => {
  asistenciaForm.value.setLoading(true);
  asistenciaForm.value.setError(null); // Limpiar errores previos
  dniNoExisteError.value = null; // Limpiar error de DNI previo
  const { dni, ubicacion, foto, local_id } = formData;
  const response = await marcarAsistencia(dni, ubicacion, foto, local_id);
  asistenciaForm.value.setLoading(false);

  if (response && response.ok) {
    const data = await response.json();
    dniRegistrado.value = dni;
    localRegistrado.value = formData.local_id;

    if (data.tipo === 'entrada') {
      mensajeModalTitulo.value = 'Entrada Registrada';
      horaEntradaRegistro.value = data.hora_entrada;
      horaSalidaRegistro.value = '';
    } else if (data.tipo === 'salida') {
      mensajeModalTitulo.value = 'Salida Registrada';
      horaSalidaRegistro.value = data.hora_salida;
      horaEntradaRegistro.value = '';
    }

    fechaRegistro.value = new Date().toLocaleDateString();
    mostrarMensaje.value = true;
    asistenciaForm.value.resetForm();
  } else if (response && response.status === 404) {
    const errorData = await response.json();
    dniNoExisteError.value = errorData.error;
  } else {
    const errorData = await response.json();
    asistenciaForm.value.setError(errorData.errors ? JSON.stringify(errorData.errors) : 'Error al registrar la asistencia');
    setTimeout(() => {
      asistenciaForm.value.setError(null);
    }, 3000);
  }
};

const cerrarMensaje = () => {
  mostrarMensaje.value = false;
  horaEntradaRegistro.value = '';
  horaSalidaRegistro.value = '';
};
</script>

<style scoped>
.error-dni {
  color: red;
  margin-top: 0.5rem;
}
</style>