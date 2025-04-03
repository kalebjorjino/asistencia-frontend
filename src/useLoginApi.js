// useLoginApi.js
import { ref } from 'vue';

export function useLoginApi() {
  const error = ref(null);
  const loading = ref(false);
  const authToken = ref(localStorage.getItem('authToken') || null);
  const userRole = ref(localStorage.getItem('userRole') || null);

  const login = async (correo, password) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', { // Asegúrate de que esta sea la ruta correcta de tu API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.role) {
        authToken.value = data.token;
        userRole.value = data.role;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.role);
        return true; // Indica que el inicio de sesión fue exitoso
      } else {
        error.value = data.message || 'Credenciales incorrectas.';
        return false; // Indica que el inicio de sesión falló
      }
    } catch (err) {
      error.value = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      console.error('Error de inicio de sesión:', err);
      return false; // Indica que el inicio de sesión falló
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    authToken.value = null;
    userRole.value = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // Opcionalmente, puedes hacer una llamada a la API para invalidar el token en el servidor
  };

  return {
    error,
    loading,
    authToken,
    userRole,
    login,
    logout,
  };
}