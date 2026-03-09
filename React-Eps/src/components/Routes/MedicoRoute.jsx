import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "@/constants/roles";

/**
 * MedicoRoute — Solo Médico.
 * - Sin token        → /login
 * - Rol no es MEDICO → /login
 */
export default function MedicoRoute() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user.id_rol !== ROLES.MEDICO) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
