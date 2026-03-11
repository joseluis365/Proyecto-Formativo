import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MotionSpinner from "../UI/Spinner";
import api from "../../Api/axios";

/**
 * FarmaciaRoute — Protege rutas específicamente para el usuario "Farmacéutico" (id_rol = 6).
 */
export default function FarmaciaRoute() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const verifySessionAndRole = async () => {
            if (!token) {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get("/me");
                // Verificar si el rol es 6 (Farmacéutico). El interceptor devuelve directamente la data.
                const user = response.user || response; // a veces viene directo o envuelto en user
                if (user && user.id_rol === 6) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error("Error verificando sesión o rol de farmacia:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifySessionAndRole();
    }, [token]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col gap-4 items-center justify-center dark:bg-gray-900 dark:text-white">
                Verificando acceso a Farmacia
                <MotionSpinner />
            </div>
        );
    }

    if (!isAuthorized) {
        // Redirige al dashboard correcto si está autenticado pero no tiene permisos, sino al login
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj.id_rol === 1) return <Navigate to="/SuperAdmin-Dashboard" replace />;
                if (userObj.id_rol === 2 || userObj.id_rol === 3) return <Navigate to="/dashboard" replace />;
            } catch (e) { }
        }
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
