import { useState, useEffect } from "react";
import api from "@/Api/axios";

export default function useTiposCita(params = {}) {
    const [tiposCita, setTiposCita] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTipos = async () => {
            setLoading(true);
            try {
                const response = await api.get("/tipos-cita", { params });
                const data = Array.isArray(response) ? response : response?.data || [];
                setTiposCita(data.map(item => ({
                    ...item,
                    value: item.id_tipo_cita,
                    label: item.tipo
                })));
            } catch (error) {
                console.error("Error fetching tipos cita:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    return { tiposCita, loading };
}
