import { useState, useEffect, useMemo } from "react";
import { useLayout } from "@/LayoutContext";
import { useHelp } from "@/hooks/useHelp";
import DataTable from "@/components/UI/DataTable";
import Input from "@/components/UI/Input";
import Filter from "@/components/UI/Filter";
import TableSkeleton from "@/components/UI/TableSkeleton";
import PrincipalText from "@/components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";
import useReports from "@/hooks/useReports";
import api from "@/Api/axios";
import Swal from "sweetalert2";

const entityOptions = [
    { value: "usuario", label: "Usuarios" },
    { value: "farmacia", label: "Farmacias" },
    { value: "prioridades", label: "Prioridades" },
    { value: "roles", label: "Roles" },
    { value: "departamentos", label: "Departamentos" },
    { value: "ciudades", label: "Ciudades" },
    { value: "especialidades", label: "Especialidades" },
    { value: "categoria_examen", label: "Categorías de Examen" },
    { value: "categoria_medicamento", label: "Categorías de Medicamento" },
];

const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: 1, label: "Activos/Activas" },
    { value: 2, label: "Inactivos/Inactivas" },
];

export default function Reportes() {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Centro de Reportes (Admin)",
        description: "El Centro de Reportes es una herramienta analítica avanzada donde puedes generar listados dinámicos de cualquier entidad importante del sistema y exportarlos.",
        sections: [
            {
                title: "Tipos de reporte disponibles",
                type: "list",
                items: [
                    "Usuarios y Roles: Verifica todos los usuarios activos y qué nivel de acceso tienen.",
                    "Clasificaciones Clínicas: Extrae un listado de Especialidades, Categorías de Examen y Medicamentos.",
                    "Distribución Geográfica: Genera reportes de Ciudades y Departamentos para análisis de cobertura."
                ]
            },
            {
                title: "Cómo generar y exportar",
                type: "steps",
                items: [
                    "Despliega 'Ver reporte de:' en la esquina superior derecha y selecciona la tabla de interés.",
                    "Usa la barra de búsqueda y los filtros de estado/roles/fechas para afinar los resultados.",
                    "Haz clic en el botón rojo 'Exportar PDF'.",
                    "El archivo PDF respetará todos los filtros que aplicaste en pantalla, incluyendo registros ocultos por la paginación."
                ]
            }
        ]
    });

    const [entity, setEntity] = useState("usuario");
    const [roles, setRoles] = useState([]);

    const {
        data,
        meta,
        loading,
        page,
        setPage,
        lastPage,
        total,
        search,
        setSearch,
        idEstado,
        setIdEstado,
        idRol,
        setIdRol,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo
    } = useReports(entity);

    useEffect(() => {
        setTitle("Centro de Reportes Dinámicos");
        setSubtitle("Genera informes detallados seleccionando la entidad deseada.");
    }, [setTitle, setSubtitle]);

    // Cargar roles para el filtro de usuarios (excepto SuperAdmin)
    useEffect(() => {
        api.get("/configuracion/roles", { params: { per_page: 100 } }).then(res => {
            const list = Array.isArray(res) ? res : (res?.data || []);
            setRoles(list.filter(r => !r.tipo_usu?.toLowerCase().includes("super")));
        }).catch(() => setRoles([]));
    }, []);

    /**
     * Maneja la exportación del reporte actual a formato PDF.
     * Mantiene los filtros de búsqueda, estado y fechas aplicados.
     */
    const handleExportPDF = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (idEstado) params.append("id_estado", idEstado);
            if (idRol) params.append("id_rol", idRol);
            if (dateFrom) params.append("date_from", dateFrom);
            if (dateTo) params.append("date_to", dateTo);

            const response = await api.get(`/reportes/${entity}/export?${params.toString()}`, {
                responseType: 'blob'
            });

            // El interceptor de Axios ya devuelve response.data, que en este caso es el Blob directamente
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_${entity}_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // También se puede usar window.open(url) si se prefiere visualización antes de descarga
            // window.open(url);

        } catch (error) {
            console.error("Error al exportar PDF:", error);
            Swal.fire({
                title: "Error de Exportación",
                text: "No se pudo generar el archivo PDF en este momento.",
                icon: "error",
                confirmButtonColor: "#2563eb"
            });
        }
    };

    /**
     * Construcción dinámica de columnas basada en los metadatos del backend.
     * Soporta notación de punto para acceder a propiedades de objetos relacionados.
     */
    const columns = useMemo(() => {
        if (!meta?.columns) return [];

        return Object.entries(meta.columns).map(([key, label]) => ({
            key,
            header: label,
            render: (row) => {
                // Soporte para notación de punto (ej: estado.nombre_estado)
                const value = key.split('.').reduce((acc, part) => acc && acc[part], row);

                // Formateo para fechas de registro
                if (key === 'created_at' && value) {
                    return new Date(value).toLocaleDateString();
                }

                // Estilo especial para columnas de estado
                if (key.includes('nombre_estado') || key === 'id_estado') {
                    const isActivo = row.id_estado === 1;
                    return (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isActivo
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                            }`}>
                            {value || (isActivo ? 'Activo' : 'Inactivo')}
                        </span>
                    );
                }

                // Renderizado para campos de texto o ID
                return (
                    <span className={key.includes('id') || key.includes('documento') || key.includes('nit') ? 'font-mono text-xs text-gray-500' : ''}>
                        {value || "-"}
                    </span>
                );
            }
        }));
    }, [meta]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            {/* Cabecera del Reporte */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText
                    icon="analytics"
                    text={meta?.report_title || "Reporte Dinámico"}
                    number={total}
                />

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2.5 px-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ver reporte de:</span>
                    <select
                        value={entity}
                        onChange={(e) => setEntity(e.target.value)}
                        className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none cursor-pointer font-bold text-primary dark:text-blue-400 appearance-none pr-4"
                    >
                        {entityOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-1.5 font-medium">{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="w-full md:w-80">
                        <Input
                            placeholder="Buscar en este reporte..."
                            icon="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 flex justify-end gap-3">
                        {meta?.exportable?.includes("pdf") && (
                            <button
                                onClick={handleExportPDF}
                                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm shadow-red-200 dark:shadow-none"
                            >
                                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                <span className="hidden sm:inline">Exportar PDF</span>
                            </button>
                        )}
                        {/* Filtro por Rol — solo visible en entidad 'usuario' */}
                        <AnimatePresence>
                            {entity === "usuario" && (
                                <motion.div
                                    key="rol-filter"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <select
                                            value={idRol}
                                            onChange={(e) => { setIdRol(e.target.value); setPage(1); }}
                                            className="appearance-none w-full bg-gray-50 dark:bg-gray-800 border border-neutral-gray-border/50 dark:border-gray-700 rounded-lg shadow-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-shadow duration-200 dark:text-white"
                                        >
                                            <option value="" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-1.5">Todos los roles</option>
                                            {roles.map(r => (
                                                <option key={r.id_rol} value={r.id_rol} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-1.5">{r.tipo_usu}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-text/70 dark:text-gray-300 pointer-events-none">expand_more</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Filter
                            value={idEstado}
                            onChange={setIdEstado}
                            options={statusOptions}
                            placeholder="Filtrar por estado"
                        />
                    </div>
                </div>

                {/* Filtro de Fechas Dinámico */}
                <AnimatePresence>
                    {meta?.has_dates && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-4 items-center bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10"
                        >
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                                <span className="text-sm font-semibold text-primary/80">Rango de fechas:</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="text-sm  dark:text-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none"
                                />
                                <span className="text-gray-400 font-medium">─</span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="text-sm dark:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Contenedor de Tabla */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <TableSkeleton rows={8} columns={meta?.columns ? Object.keys(meta.columns).length : 5} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {data.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4 block">query_stats</span>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron resultados para los criterios seleccionados.</p>
                                <button
                                    onClick={() => { setSearch(""); setIdEstado(""); setIdRol(""); setDateFrom(""); setDateTo(""); }}
                                    className="mt-4 text-primary text-sm font-semibold hover:underline"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm overflow-hidden rounded-xl">
                                <DataTable
                                    columns={columns}
                                    data={data}
                                />
                            </div>
                        )}

                        {/* Paginación */}
                        {lastPage > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    <span className="material-symbols-outlined align-middle">chevron_left</span>
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-10 h-10 rounded-lg transition-all text-sm font-bold ${page === p
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={page === lastPage}
                                    onClick={() => setPage(prev => Math.min(lastPage, prev + 1))}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    <span className="material-symbols-outlined align-middle">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
