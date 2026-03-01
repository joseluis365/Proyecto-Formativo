import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MotionSpinner from "../UI/Spinner";
import api from "../../Api/superadminAxios";

export default function SuperAdminRoute() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = sessionStorage.getItem("superadmin_token");

    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                // Usamos la instancia dedicada que ya maneja el token y errores 401
                await api.get("/superadmin/check-session");
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error verificando sesión:", error);
                setIsAuthenticated(false);
                // No es necesario remover el token aquí manualmente porque 
                // el interceptor de superadminAxios ya lo hace al recibir un 401.
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [token]);

    if (isLoading) {
        return <div className="min-h-screen flex flex-col gap-4 items-center justify-center dark:bg-gray-900 dark:text-white">Verificando sesión
            <MotionSpinner />

        </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/SuperAdmin-Login" replace />;
    }

    return <Outlet />;
}
