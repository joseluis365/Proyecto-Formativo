import axios from "axios";

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
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("superadmin_token");
            sessionStorage.removeItem("superadmin_user");
            window.location.href = "/SuperAdmin-Login";
        }
        return Promise.reject(error);
    }
);

export default superAdminApi;
