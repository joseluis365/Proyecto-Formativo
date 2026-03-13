import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "@/constants/roles";

/**
 * AdminRoute — Solo Admin y Personal Administrativo.
 * - Sin token            → /login
 * - Rol no autorizado    → /login
 */
export default function AdminRoute() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (
        user.id_rol !== ROLES.ADMIN &&
        user.id_rol !== ROLES.PERSONAL_ADMINISTRATIVO
    ) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
