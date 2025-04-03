<template>
    <div class="login-view-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <LoginForm @submit="handleLogin" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import LoginForm from '../components/LoginForm.vue'; // Ajusta la ruta si es necesario
  import { useLoginApi } from '../useLoginApi'; // Ajusta la ruta si es necesario
  
  const router = useRouter();
  const { login } = useLoginApi();
  
  const handleLogin = async (credentials) => {
    const success = await login(credentials.correo, credentials.password);
    if (success) {
      const role = localStorage.getItem('userRole');
      if (role === 'administrador' || role === 'supervisor') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
    // El manejo de 'loading' y 'error' ahora está dentro de LoginForm y useLoginApi
  };
  </script>
  
  <style scoped>
  .login-view-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh; /* Make the container take up the full viewport height */
    background-color: #f4f6f8; /* Optional background color */
    padding: 20px; /* Add some padding around the container */
  }
  
  .login-card {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%; /* Make the card take full width by default */
    max-width: 400px; /* Limit the maximum width on larger screens */
    text-align: center;
  }
  
  h2 {
    margin-bottom: 25px;
    color: #333;
  }
  
  /* Style for the LoginForm component (assuming you applied the previous responsive styles) */
  /* You might want to adjust the max-width of the form within LoginForm as well */
  
  /* Responsive adjustments */
  @media (max-width: 576px) {
    .login-card {
      padding: 20px;
    }
  
    h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
  
    .additional-info {
      font-size: 0.85rem;
    }
  }
  </style>