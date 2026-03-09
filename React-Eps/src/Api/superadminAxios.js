import axios from "axios";
import Swal from "sweetalert2";

const superAdminApi = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

superAdminApi.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('superadmin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

superAdminApi.interceptors.response.use(
    (response) => {
        // Extracción automática del campo 'data' si existe la estructura estándar
        if (response.data && typeof response.data.success !== "undefined") {
            // Si el backend envió data: null (ej: Logout), devolvemos el objeto completo para no perder el mensaje
            return response.data.data !== null ? response.data.data : response.data;
        }
        return response.data;
    },
    (error) => {
        const { response } = error;

        if (response) {
            switch (response.status) {
                case 401:
                    // Sesión SuperAdmin expirada o inválida.
                    // Solo limpiamos el storage — la navegación a /SuperAdmin-Login
                    // la maneja SuperAdminRoute con <Navigate replace />.
                    // No usamos window.location.href para evitar redirecciones globales
                    // que afecten a otros roles (Admin, Paciente, etc.) durante el montaje
                    // de componentes con React.StrictMode.
                    sessionStorage.removeItem("superadmin_token");
                    sessionStorage.removeItem("superadmin_user");
                    break;

                case 403:
                    // Acceso prohibido (ej: Problemas de licencia de su empresa?) o permiso denegado.
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso Denegado',
                        text: response.data?.message || 'No tienes permisos para realizar esta acción.',
                        confirmButtonColor: '#d33',
                    });
                    break;

                case 500:
                    // Error interno del servidor
                    Swal.fire({
                        icon: 'error',
                        title: 'Error del Servidor',
                        text: 'Ha ocurrido un error inesperado al procesar la solicitud del SuperAdmin.',
                        confirmButtonColor: '#d33',
                    });
                    break;

                case 422:
                    // Se espera manejo local por el componente (setError)
                    break;

                default:
                    console.error("SuperAdmin API Error:", response.data?.message || error.message);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'Servidor desconectado o error de red.',
            });
        }

        return Promise.reject(error);
    }
);

export default superAdminApi;
