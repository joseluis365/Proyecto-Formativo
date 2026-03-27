import { useState, useEffect, useCallback } from "react";
import superAdminApi from "@/Api/superadminAxios";

/**
 * Hook genérico para manejar la lógica de tablas, paginación y filtros EXCLUSIVO para SuperAdmin.
 * @param {string} endpoint - El endpoint de la API (ej: "/configuracion/estados")
 * @param {object} extraParams - Parámetros adicionales constantes
 */
const useSuperAdminTableData = (endpoint, extraParams = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [error, setError] = useState(null);

    // Filtros y Paginación
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Debounce para la búsqueda (evita peticiones excesivas)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reiniciar a la primera página ante una búsqueda
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reiniciar página al cambiar el filtro de estado
    useEffect(() => {
        setPage(1);
    }, [status]);

    /**
     * Función principal para obtener los datos de la API
     */
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await superAdminApi.get(endpoint, {
                params: {
                    search: debouncedSearch || undefined,
                    id_estado: status || undefined,
                    page: page,
                    ...extraParams
                },
            });

            // Manejo de estructura de respuesta
            if (result.meta) {
                setData(result.data);
                setPage(result.meta.current_page);
                setLastPage(result.meta.last_page);
                setTotal(result.meta.total);
            } else if (result.current_page) {
                setData(result.data || []);
                setPage(result.current_page);
                setLastPage(result.last_page || 1);
                setTotal(result.total || 0);
            } else {
                setData(result.data || result || []);
                setTotal(Array.isArray(result) ? result.length : (result.data ? result.data.length : 0));
            }
        } catch (err) {
            console.error(`Error en useSuperAdminTableData (${endpoint}):`, err);
            setError(err.response?.data?.message || "No se pudieron cargar los datos.");
            setData([]);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    }, [endpoint, debouncedSearch, status, page, JSON.stringify(extraParams)]);

    // Ejecutar fetch cuando cambian los filtros relevantes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        isInitialLoad,
        error,
        page,
        setPage,
        lastPage,
        total,
        search,
        setSearch,
        status,
        setStatus,
        fetchData,
    };
};

export default useSuperAdminTableData;
