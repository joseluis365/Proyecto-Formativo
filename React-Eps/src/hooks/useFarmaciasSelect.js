import { useState, useEffect } from "react";
import api from "@/Api/axios";

export default function useFarmaciasSelect() {
    const [farmacias, setFarmacias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFarmacias = async () => {
            setLoading(true);
            try {
                const response = await api.get("/farmacias");
                // El interceptor devuelve directamente la data si no hay success: true/false
                // O devuelve data.data si lo hay.
                // Verificamos estructura común del proyecto.
                const data = response?.data || response || [];

                setFarmacias(data.map(item => ({
                    value: item.nit,
                    label: item.nombre
                })));
            } catch (error) {
                console.error("Error fetching farmacias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFarmacias();
    }, []);

    return { farmacias, loading };
}
