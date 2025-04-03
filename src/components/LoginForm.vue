<template>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="correo">Correo Electrónico:</label>
        <input type="email" id="correo" v-model="correo" required>
        <small class="form-text text-muted">Ingrese su correo electrónico de administrador o supervisor.</small>
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" :disabled="loading" class="submit-button">
        {{ loading ? 'Iniciando Sesión...' : 'Entrar' }}
      </button>
      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLoginApi } from '../useLoginApi'; // Ajusta la ruta si es necesario
  
  const correo = ref('');
  const password = ref('');
  const router = useRouter();
  const { error, loading, login } = useLoginApi();
  
  const handleSubmit = async () => {
    const success = await login(correo.value, password.value);
    if (success) {
      // Redirigir al usuario basado en su rol (esto ahora se puede hacer aquí o en LoginView)
      const role = localStorage.getItem('userRole');
      if (role === 'administrador' || role === 'supervisor') {
        router.push('/admin');
      } else {
        router.push('/registro-empleado'); // Redirección por defecto
      }
    }
    // Si el inicio de sesión falla, el error.value se actualizará automáticamente en useLoginApi
  };
  </script>
  
  <style scoped>
  .login-form {
    padding: 20px;
    max-width: 400px; /* Limit maximum width for larger screens */
    margin: 0 auto; /* Center the form */
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 1rem;
  }
  
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1rem;
  }
  
  .form-text {
    display: block;
    margin-top: 8px;
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .submit-button {
    background-color: #007bff;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1rem;
    width: 100%; /* Make the button full width on smaller screens */
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #0056b3;
  }
  
  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: red;
    margin-top: 15px;
    font-size: 0.9rem;
  }
  
  /* Media query for larger screens */
  @media (min-width: 768px) {
    .submit-button {
      width: auto; /* Adjust button width on larger screens if needed */
    }
  }
  </style>