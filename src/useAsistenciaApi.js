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

            // Loguear contenido de FormData para ver qué se está enviando
            console.log('Contenido de FormData antes de enviar:');
            for (let pair of formData.entries()) {
                if(pair[0] === 'foto' && pair[1] instanceof File) {
                    console.log(pair[0], pair[1].name, pair[1].size, pair[1].type);
                } else {
                    console.log(pair[0], pair[1]);
                }
            }

            const response = await fetch('http://www.megabotikas.com/asistencia/controller/asistencia.php?op=registrarAsistencia', {
                method: 'POST',
                body: formData,
                // NO poner headers Content-Type aquí para FormData
            });

            // Leer la respuesta como texto para depurar cualquier error JSON o mensaje del backend
            const text = await response.text();
            console.log('Respuesta del backend (texto):', text);

            // Intentar parsear JSON si es posible
            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                console.error('Error parseando JSON:', jsonError);
                throw new Error('Respuesta no es JSON válido');
            }

            if (!response.ok) {
                console.error('Error backend:', data);
                throw new Error(data.error || 'Error desconocido al registrar asistencia');
            }

            // Retornar un objeto similar a response para que tu código actual siga funcionando
            return {
                ok: response.ok,
                status: response.status,
                json: async () => data
            };

        } catch (err) {
            console.error('Error en marcarAsistencia:', err);
            error.value = err.message || err;
            return null;
        } finally {
            loading.value = false;
        }
    };

    return { error, loading, marcarAsistencia };
}
