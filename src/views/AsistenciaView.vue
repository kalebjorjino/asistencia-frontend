<template>
  <div>
    <asistencia-form
      @submit="handleRegistroAsistencia"
      ref="asistenciaForm"
      :dni-no-existe-error="dniNoExisteError" 
      :no-schedule-error="noScheduleError" 
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
const fechaRegistro = ref('');
const horaEntradaRegistro = ref('');
const horaSalidaRegistro = ref('');
const dniNoExisteError = ref(null); 
const noScheduleError = ref(null); // <-- NUEVO: Ref para error de horario

const handleRegistroAsistencia = async (formData) => {
  asistenciaForm.value.setLoading(true);
  asistenciaForm.value.setError(null); // Limpiar errores previos
  dniNoExisteError.value = null; // Limpiar error de DNI previo
  noScheduleError.value = null; // <-- Limpiar error de horario previo

  const { dni, ubicacion, foto } = formData;
  // Ahora 'result' contendrá { ok, status?, error?, data? }
  const result = await marcarAsistencia(dni, ubicacion, foto);
  asistenciaForm.value.setLoading(false);

  if (result && result.ok) {
    const data = result.data;
    dniRegistrado.value = dni;

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
  } else if (result) {
    // NUEVO MANEJO DIFERENCIADO DE ERRORES
    if (result.status === 404) {
      dniNoExisteError.value = result.error || 'Empleado no encontrado.';
    } else if (result.status === 400) {
      noScheduleError.value = result.error || 'No se pudo registrar: Verifique su horario.';
    } else {
      // Error genérico mostrado en el formulario
      asistenciaForm.value.setError(result.error || 'Error al registrar la asistencia');
      setTimeout(() => {
        asistenciaForm.value.setError(null);
      }, 3000);
    }
  } else {
      // Caso donde marcarAsistencia devuelve null (error de red/fetch capturado en el hook)
      asistenciaForm.value.setError(error.value || 'Error de conexión al servidor.');
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