import { useState, useEffect } from "react";
import api from "@/Api/axios";

/**
 * Hook para obtener médicos disponibles según fecha y hora.
 */
export default function useMedicosDisponibles(fecha, hora) {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMedicos = async () => {
            if (!fecha || !hora) {
                setMedicos([]);
                return;
            };

            setLoading(true);
            try {
                const response = await api.get("/medicos-disponibles", {
                    params: { fecha, hora }
                });
                setMedicos(response || []);
            } catch (error) {
                console.error("Error fetching medicos disponibles:", error);
                setMedicos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicos();
    }, [fecha, hora]);

    return { medicos, loading };
}
