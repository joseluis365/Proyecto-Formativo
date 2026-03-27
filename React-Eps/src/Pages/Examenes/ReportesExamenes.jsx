import { useState, useEffect, useCallback, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import DataTable from "../../components/UI/DataTable";
import TableSkeleton from "../../components/UI/TableSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../Api/axios";
import Swal from "sweetalert2";

const entityOptions = [
    { value: "realizados", label: "Exámenes Realizados" },
];

const estadoExamenOptions = [
    { value: "", label: "Todos los estados" },
    { value: "9", label: "Pendiente" },
    { value: "10", label: "Completado" },
    { value: "11", label: "Cancelado" },
];

export default function ReportesExamenes() {
    const { setTitle, setSubtitle } = useLayout();
    
    useHelp({
        title: "Reportes de Laboratorio",
        description: "Esta vista te permite generar, filtrar y exportar a PDF información sobre los exámenes clínicos procesados.",
        sections: [
            {
                title: "¿Qué puedo hacer aquí?",
                type: "list",
                items: [
                    "Visualizar el historial de exámenes realizados y su estado actual.",
                    "Filtrar por rango de fechas para reportes mensuales o semanales.",
                    "Buscar por nombre de examen o por documento del paciente.",
                    "Exportar la información filtrada a un documento PDF profesional."
                ]
            },
            {
                title: "Campos del Reporte",
                type: "list",
                items: [
                    "ID: Identificador único del examen.",
                    "Fecha: Día en que se programó o realizó.",
                    "Categoría: Clasificación del examen (Sangre, Orina, etc).",
                    "Examen: Nombre específico del procedimiento.",
                    "Paciente: Nombre del paciente atendido.",
                    "Resultado: Nombre del archivo adjunto (si está disponible)."
                ]
            }
        ]
    });

    // Global State
    const [entity, setEntity] = useState("realizados");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Filters
    const [search, setSearch] = useState("");
    const [idEstado, setIdEstado] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        setTitle("Reportes de Exámenes");
        setSubtitle("Genera informes detallados de la actividad de laboratorio.");
    }, [setTitle, setSubtitle]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { 
                page,
                limit: 15
            };
            if (search.trim()) params.search = search;
            if (idEstado) params.id_estado = idEstado;
            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;

            const res = await api.get(`/examenes/reportes/${entity}`, { params });
            setData(res.data || []);
            setMeta(res.meta || null);
            setTotal(res.total || 0);
            setLastPage(res.last_page || 1);
        } catch (error) {
            console.error("Error fetching exam report data", error);
        } finally {
            setLoading(false);
        }
    }, [entity, page, search, idEstado, dateFrom, dateTo]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleExportPDF = async () => {
        try {
            const params = new URLSearchParams();
            if (search.trim()) params.append("search", search);
            if (idEstado) params.append("id_estado", idEstado);
            if (dateFrom) params.append("date_from", dateFrom);
            if (dateTo) params.append("date_to", dateTo);

            const response = await api.get(`/examenes/reportes/${entity}/export?${params.toString()}`, {
                responseType: 'blob'
            });

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_examenes_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error al exportar PDF:", error);
            Swal.fire({
                title: "Error de Exportación",
                text: "No se pudo generar el archivo PDF en este momento.",
                icon: "error"
            });
        }
    };

    const columns = useMemo(() => {
        if (!meta?.columns) return [];
        return Object.entries(meta.columns).map(([key, label]) => ({
            key,
            header: label,
            render: (row) => {
                const value = row[key];

                if (key === 'estado') {
                    let bg = "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"; // Pendiente
                    if (row.id_estado === 10) bg = "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"; // Completado
                    if (row.id_estado === 11) bg = "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"; // Cancelado
                    
                    return <span className={`px-2.5 py-1 text-xs font-bold rounded-full border border-current ${bg}`}>{value}</span>;
                }

                if (key === 'archivo') {
                    if (value === 'N/A') return <span className="text-gray-400 italic">Sin adjunto</span>;
                    return (
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-sm">description</span>
                            <span className="text-xs font-medium truncate max-w-[120px]">{value}</span>
                        </div>
                    );
                }

                if (key === 'id_examen') {
                    return <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">#{value}</span>;
                }

                return <span className="text-gray-700 dark:text-gray-200">{value || "-"}</span>;
            }
        }));
    }, [meta]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            {/* Cabecera */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText
                    icon="lab_research"
                    text={meta?.report_title || "Reporte de Laboratorio"}
                    number={total}
                />

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo:</span>
                    <select
                        value={entity}
                        onChange={(e) => { setEntity(e.target.value); setPage(1); }}
                        className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none cursor-pointer font-bold text-primary dark:text-blue-400 appearance-none pr-4"
                    >
                        {entityOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="w-full md:w-80">
                        <Input
                            placeholder="Buscar por paciente o examen..."
                            icon="search"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>

                    <div className="flex-1 flex justify-end gap-3 flex-wrap">
                        {meta?.exportable?.includes("pdf") && (
                            <button
                                onClick={handleExportPDF}
                                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm shadow-red-200 dark:shadow-none mr-2"
                            >
                                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                <span>Exportar PDF</span>
                            </button>
                        )}

                        <div className="w-48">
                            <Filter
                                value={idEstado}
                                onChange={(v) => { setIdEstado(v); setPage(1); }}
                                options={estadoExamenOptions}
                                placeholder="Estado"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/40 text-gray-700 dark:text-gray-200"
                            />
                            <span className="text-gray-400">a</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/40 text-gray-700 dark:text-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <TableSkeleton rows={8} columns={Object.keys(meta?.columns || {}).length || 6} />
                    </motion.div>
                ) : (
                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {data.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4 block">query_stats</span>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron exámenes con los filtros aplicados.</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden rounded-xl">
                                <DataTable columns={columns} data={data} />
                            </div>
                        )}

                        {/* Paginación */}
                        {lastPage > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all font-bold"
                                >
                                    <span className="material-symbols-outlined align-middle">chevron_left</span>
                                </button>

                                <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-10 h-10 rounded-lg transition-all text-sm font-bold shrink-0 ${page === p
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
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all font-bold"
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
