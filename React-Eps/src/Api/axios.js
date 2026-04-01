/*
 * Cliente HTTP principal del frontend.
 * Configura Axios base para consumo de API general.
 */
import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
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
          // Solo actuar como "sesión finalizada" si el usuario YA tenía un token guardado.
          // Si no hay token, es un intento de login fallido: se maneja localmente en LoginSection.
          if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            Swal.fire({
              icon: 'warning',
              title: 'Sesión Finalizada',
              text: 'Tu sesión ha expirado o no es válida. Por favor, ingresa de nuevo.',
              confirmButtonColor: '#3085d6',
            }).then(() => {
              window.location.href = "/login";
            });
          }
          break;

        case 403:
          // Acceso prohibido — solo mostrar si la solicitud no maneja sus propios errores
          if (!error.config?.skipGlobalHandler) {
            Swal.fire({
              icon: 'error',
              title: 'Acceso Denegado',
              text: response.data?.message || 'No tienes permisos para realizar esta acción o hay problemas con la licencia de tu empresa.',
              confirmButtonColor: '#d33',
            });
          }
          break;

        case 500:
          // Error interno del servidor
          Swal.fire({
            icon: 'error',
            title: 'Error del Servidor',
            text: 'Ha ocurrido un error inesperado en el servidor. Por favor, inténtalo más tarde.',
            confirmButtonColor: '#d33',
          });
          break;

        case 422:
          // Manejado habitualmente por handleApiErrors en el componente,
          // no disparamos Swal global para no interferir con el feedback de formularios.
          break;

        default:
          // Otros errores no manejados específicamente
          console.error("API Error:", response.data?.message || error.message);
      }
    } else if (!axios.isCancel(error)) {
      // Error de red o servidor caído, pero solo si no fue cancelado intencionalmente
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No se pudo establecer conexión con el servidor. Verifica tu conexión a internet.',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
