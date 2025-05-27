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

            const response = await fetch('https://megabotikas.com/asistencia/controller/asistencia.php?op=registrarAsistencia', {
                method: 'POST',
                body: formData,
            });

            // Intentar parsear JSON siempre para obtener el mensaje de error o éxito
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                // Si la respuesta no es JSON (inesperado), crear un error genérico
                console.error('Respuesta no es JSON válido:', await response.text()); // Loguear texto si falla JSON
                // Devolver un objeto de error genérico si la respuesta no fue OK
                if (!response.ok) {
                    return { ok: false, status: response.status, error: 'Error inesperado del servidor.' };
                }
                // Si la respuesta fue OK pero no es JSON, es un problema
                throw new Error('Respuesta exitosa pero no es JSON válido');
            }

            // Si la respuesta NO fue OK (ej. 404, 400, 500)
            if (!response.ok) {
                console.error('Error backend:', data);
                // Devolver el objeto de error estructurado
                return { ok: false, status: response.status, error: data.error || 'Error desconocido al registrar asistencia' };
            }

            // Si la respuesta fue OK
            return { ok: true, data }; // Devolver éxito con los datos

        } catch (err) {
            console.error('Error en marcarAsistencia:', err);
            error.value = err.message || 'Error de conexión o al procesar la solicitud.';
            // Devolver un objeto de error genérico para errores de red/fetch
            return { ok: false, status: 500, error: error.value };
        } finally {
            loading.value = false;
        }
    };

    return { error, loading, marcarAsistencia };
}
