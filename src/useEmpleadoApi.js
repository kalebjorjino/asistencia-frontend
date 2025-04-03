import { ref } from 'vue';

export function useEmpleadoApi() {
    const error = ref(null);
    const loading = ref(false);
    const empleados = ref([]);
    const empleado = ref(null);

    const listarEmpleados = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch('http://localhost:3000/api/empleados');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al listar empleados');
            }
            empleados.value = await response.json();
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    const obtenerEmpleadoPorId = async (id) => {
        loading.value = true;
        error.value = null;
        empleado.value = null;
        try {
            const response = await fetch(`http://localhost:3000/api/empleados/id/${id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener empleado');
            }
            empleado.value = await response.json();
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    const obtenerEmpleadoPorDNI = async (dni) => {
        loading.value = true;
        error.value = null;
        empleado.value = null;
        try {
            const response = await fetch(`http://localhost:3000/api/empleados/dni/${dni}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener empleado');
            }
            empleado.value = await response.json();
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    const crearEmpleado = async (dni, nombre, profesion) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch('http://localhost:3000/api/empleados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dni, nombre, profesion }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear empleado');
            }
            return response; // Return the full response for potential ID access
        } catch (err) {
            error.value = err;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const actualizarEmpleado = async (id, nombre, profesion) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`http://localhost:3000/api/empleados/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, profesion }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar empleado');
            }
            return response;
        } catch (err) {
            error.value = err;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const eliminarEmpleado = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`http://localhost:3000/api/empleados/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar empleado');
            }
            return response;
        } catch (err) {
            error.value = err;
            return null;
        } finally {
            loading.value = false;
        }
    };

    return {
        error,
        loading,
        empleados,
        empleado,
        listarEmpleados,
        obtenerEmpleadoPorId,
        obtenerEmpleadoPorDNI,
        crearEmpleado,
        actualizarEmpleado,
        eliminarEmpleado,
    };
}