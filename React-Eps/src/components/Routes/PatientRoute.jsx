import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "@/constants/roles";

/**
 * PatientRoute — Solo Paciente.
 * - Sin token          → /login
 * - Rol no es PACIENTE → /login
 */
export default function PatientRoute() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user.id_rol !== ROLES.PACIENTE) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
