import { useState, useEffect } from "react";
import api from "@/Api/axios";

export default function useTiposCita() {
    const [tiposCita, setTiposCita] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTipos = async () => {
            setLoading(true);
            try {
                const response = await api.get("/tipos-cita");
                // El interceptor ya devuelve el body. Como es paginado, los datos están en response.data
                const list = response.data || [];
                setTiposCita(list.map(item => ({
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
    }, []);

    return { tiposCita, loading };
}
