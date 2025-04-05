import { ref } from 'vue';

export function useAsistenciaApi() {
    const error = ref(null);
    const loading = ref(false);

    const marcarAsistencia = async (dni, ubicacion, foto) => {
        loading.value = true;
        error.value = null;

        try {
            const formData = new FormData();
            formData.append('dni', dni);
            formData.append('ubicacion', ubicacion);
            if (foto) {
                formData.append('foto', foto);
            }

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await fetch('https://www.megabotikas.com/api/controller/asistencia.php?op=registrarAsistencia', { // Assuming the route is /api/asistencia/registro
                method: 'POST',
                body: formData,
                // Note: Content-Type is NOT set here for FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Errores del servidor:', errorData.errors);
                throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Error al registrar asistencia');
            }

            return response; // Return the full response
        } catch (err) {
            error.value = err;
            return null;
        } finally {
            loading.value = false;
        }
    };

    return { error, loading, marcarAsistencia };
}