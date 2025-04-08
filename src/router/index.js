import { createRouter, createWebHistory } from 'vue-router';
import AsistenciaView from '../views/AsistenciaView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
   
    {
      path: '/',
      name: 'Asistencia',
      component: AsistenciaView,
    },
   
   
  ],
});

export default router;