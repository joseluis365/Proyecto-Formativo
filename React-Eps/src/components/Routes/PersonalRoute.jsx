import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "@/constants/roles";

/**
 * PersonalRoute — Solo Rol 3 (Personal Administrativo normal).
 * - Sin token        → /login
 * - Rol no autorizado → /dashboard o /login
 */
export default function PersonalRoute() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user.id_rol !== ROLES.PERSONAL_ADMINISTRATIVO || user.examenes === true) {
        if (user.id_rol === ROLES.SUPERADMIN || user.id_rol === ROLES.ADMIN) {
             return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
