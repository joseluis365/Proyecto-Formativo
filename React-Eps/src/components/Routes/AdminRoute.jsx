import { Navigate, Outlet } from "react-router-dom";

/**
 * AdminRoute — Protege rutas específicamente para el usuario "Administrador" (id_rol = 2) y SuperAdmin (1)
 * Optimizada: usa comprobación síncrona en memoria para evitar bucles de red.
 */
export default function AdminRoute() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        // Permitir SuperAdmin (1), Admin (2) y Personal Administrativo (3)
        if (user.id_rol === 1 || user.id_rol === 2 || user.id_rol === 3) {
            return <Outlet />;
        }
        
        // Redirecciones seguras para evitar bucles
        if (user.id_rol === 4) return <Navigate to="/medico/agenda" replace />;
        if (user.id_rol === 5) return <Navigate to="/paciente" replace />;
        if (user.id_rol === 6) return <Navigate to="/farmacia/dashboard" replace />;
        
        return <Navigate to="/login" replace />;
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
}

