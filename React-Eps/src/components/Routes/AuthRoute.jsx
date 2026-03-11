import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MotionSpinner from "../UI/Spinner";
import api from "../../Api/axios";

/**
 * AuthRoute — Protege rutas para CUALQUIER usuario autenticado (todos los roles).
 * Usa localStorage (token) — INDEPENDIENTE del SuperAdmin (sessionStorage).
 */
export default function AuthRoute() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                await api.get("/me");
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error verificando sesión de usuario:", error);
                setIsAuthenticated(false);
                // El interceptor de axios.js ya limpia el localStorage en 401
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [token]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col gap-4 items-center justify-center dark:bg-gray-900 dark:text-white">
                Verificando sesión
                <MotionSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
