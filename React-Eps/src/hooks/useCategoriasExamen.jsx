import { useState, useEffect } from "react";
import api from "../Api/axios";

export default function useCategoriasExamen() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await api.get('/categorias-examen');
                const list = Array.isArray(res) ? res : (res?.data || []);
                const activeCats = list.filter(c => c.estado?.nombre_estado === 'Activo');
                setCategorias(activeCats.map(c => ({ value: c.id_categoria_examen?.toString(), label: c.categoria })));
            } catch (err) {
                console.error("Error fetching categorias examen:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    return { categorias, loading, error };
}
