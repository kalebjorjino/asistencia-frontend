<template>
    <div class="lista-empleados">
      <h2>Lista de Empleados</h2>
      <div v-if="cargando" class="alert alert-info" role="alert">
        Cargando empleados...
      </div>
      <div v-else-if="error" class="alert alert-danger" role="alert">
        Error al cargar empleados: {{ error }}
      </div>
      <div v-else-if="empleados.length > 0">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empleado in empleados" :key="empleado.id">
              <td>{{ empleado.id }}</td>
              <td>{{ empleado.nombre }}</td>
              <td>{{ empleado.correo }}</td>
              <td>{{ empleado.dni }}</td>
              <td>
                <button @click="$emit('editar', empleado.id)" class="btn btn-sm btn-primary me-2">Editar</button>
                <button @click="$emit('eliminar', empleado.id)" class="btn btn-sm btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="alert alert-warning" role="alert">
        No hay empleados registrados.
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    empleados: {
      type: Array,
      required: true,
    },
    cargando: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
  });
  
  const emit = defineEmits(['editar', 'eliminar']);
  </script>
  
  <style scoped>
  .lista-empleados {
    padding: 20px;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  </style>