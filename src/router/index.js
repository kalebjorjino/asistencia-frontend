import { createRouter, createWebHistory } from 'vue-router';
import AsistenciaView from '../views/AsistenciaView.vue';
import RegistroEmpleadoView from '../views/RegistroEmpleadoView.vue';
import LoginView from '../views/LoginView.vue';
//import ListaEmpleadosView from '../views/ListaEmpleadosView.vue';
//import EditarEmpleadoView from '../views/EditarEmpleadoView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      redirect: '/login', // Redirige la ruta raíz a /login por defecto
    },
    {
      path: '/',
      name: 'Asistencia',
      component: AsistenciaView,
    },
    {
      path: '/registro-empleado',
      name: 'RegistroEmpleado',
      component: RegistroEmpleadoView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    /*{
      path: '/empleados',
      name: 'ListaEmpleados',
      component: ListaEmpleadosView,
    },
    {
      path: '/empleados/editar/:id',
      name: 'EditarEmpleado',
      component: EditarEmpleadoView,
      props: true, // Para pasar el parámetro 'id' como prop
    },*/
  ],
});

export default router;