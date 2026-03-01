import axios from "axios";

const superAdminAxios = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Interceptor de solicitudes para añadir el token de SuperAdmin
superAdminAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("superadmin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de respuestas para manejar la expiración de sesión (401)
superAdminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("superadmin_token");
            sessionStorage.removeItem("superadmin_user");

            // Solo redirigir si el usuario está actualmente en el módulo SuperAdmin
            if (window.location.pathname.startsWith("/SuperAdmin")) {
                window.location.href = "/SuperAdmin-Login";
            }
        }
        return Promise.reject(error);
    }
);

export default superAdminAxios;
