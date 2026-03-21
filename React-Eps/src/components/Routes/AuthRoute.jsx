import { Navigate, Outlet } from "react-router-dom";

/**
 * AuthRoute — Protege rutas para CUALQUIER usuario autenticado (todos los roles).
 * Usa localStorage (token) — INDEPENDIENTE del SuperAdmin (sessionStorage).
 * Optimizada: usa comprobación síncrona en memoria para evitar bucles de red.
 */
export default function AuthRoute() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

