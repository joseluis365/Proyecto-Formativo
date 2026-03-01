import { useState, useEffect } from "react";
import api from "@/Api/axios";

export default function useCategoriasExamen() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategorias = async () => {
            setLoading(true);
            try {
                const response = await api.get("/categorias-examen", {
                    params: { id_estado: 1 }
                });
                const data = response.data.data || [];
                setCategorias(data.map(item => ({
                    value: item.id_categoria_examen,
                    label: item.categoria
                })));
            } catch (error) {
                console.error("Error fetching categorias examen:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    return { categorias, loading };
}
