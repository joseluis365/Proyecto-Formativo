import { useState, useEffect } from "react";
import api from "@/Api/axios";

export default function usePrioridades() {
    const [prioridades, setPrioridades] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPrioridades = async () => {
            setLoading(true);
            try {
                const response = await api.get("/prioridades");
                const data = response.data.data || [];
                setPrioridades(data.map(item => ({
                    value: item.id_prioridad,
                    label: item.prioridad
                })));
            } catch (error) {
                console.error("Error fetching prioridades:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrioridades();
    }, []);

    return { prioridades, loading };
}
