<template>
    <div class="lista-empleados-view">
        <ListaEmpleados :empleados="empleados" :cargando="cargando" :error="error" @editar="manejarEditar"
            @eliminar="manejarEliminar" />
        <router-link to="/empleados/registro" class="btn btn-success mt-3">Registrar Nuevo Empleado</router-link>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ListaEmpleados from '../components/ListaEmpleados.vue';
import { useEmpleadoApi } from '../useLoginApi'; // Ajusta la ruta si es necesario

const { empleados, cargando, error, obtenerEmpleados, eliminarEmpleado } = useEmpleadoApi();
const router = useRouter();

onMounted(async () => {
    await obtenerEmpleados();
});

const manejarEditar = (empleadoId) => {
    router.push(`/empleados/editar/${empleadoId}`);
};

const manejarEliminar = async (empleadoId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
        await eliminarEmpleado(empleadoId);
        await obtenerEmpleados(); // Recargar la lista después de la eliminación
    }
};
</script>

<style scoped>
.lista-empleados-view {
    padding: 20px;
}
</style>