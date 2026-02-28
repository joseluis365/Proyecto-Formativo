import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MotionSpinner from "../UI/Spinner";

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
                const response = await fetch("http://127.0.0.1:8000/api/superadmin/check-session", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    // Token inválido o expirado
                    sessionStorage.removeItem("superadmin_token");
                    sessionStorage.removeItem("superadmin_user");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error verificando sesión:", error);
                setIsAuthenticated(false);
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
