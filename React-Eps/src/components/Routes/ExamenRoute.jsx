import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "@/constants/roles";

/**
 * ExamenRoute — Solo Rol 3 (Personal Administrativo) o aquellos que puedan atender exámenes.
 * - Sin token        → /login
 * - Rol no autorizado → /login o /dashboard
 */
export default function ExamenRoute() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // El usuario especificó: "un usuario con el id_rol = 3 y con el campo examenes = true"
    if (user.id_rol !== ROLES.PERSONAL_ADMINISTRATIVO || user.examenes !== true) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
