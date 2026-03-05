import { useState, useEffect } from "react";
import api from "@/Api/axios";

/**
 * Hook para obtener la lista completa de médicos activos con sus especialidades.
 */
export default function useMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMedicos = async () => {
            setLoading(true);
            try {
                // Rol 2 = Medico, Status 1 = Activo
                const response = await api.get("/usuarios", {
                    params: { id_rol: 2, status: 1, per_page: 100 }
                });

                // El interceptor ya devuelve response.data (que es el array de info paginada)
                // Si el backend es paginado, response será { data: [...], total: ... }
                const list = response.data || [];
                setMedicos(list);
            } catch (error) {
                console.error("Error fetching medicos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicos();
    }, []);

    return { medicos, loading };
}
