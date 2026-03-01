import { useState, useEffect, useCallback } from "react";
import api from "@/Api/axios";

/**
 * Hook especializado para el módulo de Reportes Dinámicos.
 * Maneja la obtención de datos, metadatos de columnas y filtros específicos de reportes.
 * 
 * @param {string} entity - La clave de la entidad reportable (ej: "usuario", "prioridades")
 */
const useReports = (entity) => {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filtros
    const [search, setSearch] = useState("");
    const [idEstado, setIdEstado] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Paginación
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    /**
     * Reseteo de estados cuando cambia la entidad
     */
    useEffect(() => {
        setData([]);
        setMeta(null);
        setSearch("");
        setIdEstado("");
        setDateFrom("");
        setDateTo("");
        setPage(1);
    }, [entity]);

    /**
     * Función para obtener datos desde el motor de reportes dinámicos
     */
    const fetchReportData = useCallback(async () => {
        if (!entity) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/reportes/${entity}`, {
                params: {
                    search: search || undefined,
                    id_estado: idEstado || undefined,
                    date_from: dateFrom || undefined,
                    date_to: dateTo || undefined,
                    page: page,
                },
            });

            const { data: paginator, meta: reportMeta } = response.data;

            // Guardar registros y metadatos (columnas, título, etc.)
            setData(paginator.data || []);
            setMeta(reportMeta);

            // Actualizar estados de paginación
            setLastPage(paginator.last_page || 1);
            setTotal(paginator.total || 0);

        } catch (err) {
            console.error(`Error en useReports (${entity}):`, err);
            setError(err.response?.data?.message || "Error al cargar el reporte.");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [entity, search, idEstado, dateFrom, dateTo, page]);

    // Ejecutar fetch cuando cambian los filtros relevantes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReportData();
        }, 300); // Pequeño debounce para evitar peticiones en ráfaga
        return () => clearTimeout(timer);
    }, [fetchReportData]);

    return {
        data,
        meta,
        loading,
        error,
        // Paginación
        page,
        setPage,
        lastPage,
        total,
        // Filtros
        search,
        setSearch,
        idEstado,
        setIdEstado,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        // Acciones
        refresh: fetchReportData
    };
};

export default useReports;
