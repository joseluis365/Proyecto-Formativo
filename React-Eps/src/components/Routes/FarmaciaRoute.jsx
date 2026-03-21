import { Navigate, Outlet } from "react-router-dom";

/**
 * FarmaciaRoute — Protege rutas específicamente para el usuario "Farmacéutico" (id_rol = 6).
 * Optimizada: usa comprobación síncrona en memoria para evitar bucles de red.
 */
export default function FarmaciaRoute() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        if (user.id_rol === 6 || user.id_rol === 1) { // SuperAdmin también puede ver si es necesario
            return <Outlet />;
        }
        
        // Redirecciones si no es farmacia
        if (user.id_rol === 2 || user.id_rol === 3) return <Navigate to="/dashboard" replace />;
        if (user.id_rol === 4) return <Navigate to="/medico/agenda" replace />;
        if (user.id_rol === 5) return <Navigate to="/paciente" replace />;
        
        return <Navigate to="/login" replace />;
    } catch (e) {
        return <Navigate to="/login" replace />;
    }
}

