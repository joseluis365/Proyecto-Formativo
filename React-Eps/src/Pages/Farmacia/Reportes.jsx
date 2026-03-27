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
    { value: "inventario", label: "Inventario de Medicamentos" },
    { value: "medicamentos", label: "Catálogo de Medicamentos" },
    { value: "movimientos", label: "Historial de Movimientos" },
];

const estadoInventarioOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Normal", label: "Normal" },
    { value: "Bajo", label: "Stock Bajo" },
    { value: "Próximo", label: "Próximo a Vencer" },
    { value: "Vencido", label: "Vencido" },
];

const tipoMovimientoOptions = [
    { value: "", label: "Todos los tipos" },
    { value: "ingresos", label: "Entradas" },
    { value: "salidas_manuales", label: "Salidas Manuales" },
    { value: "ordenes_medicas", label: "Órdenes Médicas" },
];

export default function Reportes() {
    const { setTitle, setSubtitle } = useLayout();
    
    useHelp({
        title: "Reportes de Farmacia",
        description: "Esta vista te permite generar, filtrar y exportar a PDF información de tres áreas clave: Inventario, Catálogo de Medicamentos y Movimientos.",
        sections: [
            {
                title: "¿Qué tipo de reportes existen?",
                type: "list",
                items: [
                    "Inventario: Muestra el estado actual del stock, forma farmacéutica y concentración de todo lo disponible.",
                    "Catálogo: El listado maestro de todos los medicamentos registrados en el sistema, tengan stock activo o no.",
                    "Movimientos: El historial detallado de qué salió, qué ingresó, las fechas y los responsables."
                ]
            },
            {
                title: "Cómo exportar un reporte a PDF",
                type: "steps",
                items: [
                    "Selecciona el 'Tipo de reporte' en el desplegable superior derecho (ej. Historial de Movimientos).",
                    "Aplica los filtros que necesites (buscar por medicamento, filtrar ingresos/salidas, filtrar estado).",
                    "Haz clic en el botón 'Exportar PDF' de color rojo.",
                    "El PDF se generará respetando exactamente los filtros que hayas aplicado en pantalla."
                ]
            },
            {
                title: "Consejo sobre la paginación",
                type: "tip",
                content: "Solo estás viendo una parte de los resultados por página. Sin embargo, al exportar a PDF, se incluirán todos los registros que cumplan con los filtros, no solamente los de la página actual."
            }
        ]
    });

    // Global State
    const [entity, setEntity] = useState("inventario");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Filters
    const [search, setSearch] = useState("");
    const [idForma, setIdForma] = useState("");
    const [idConcentracion, setIdConcentracion] = useState("");
    const [estadoInventario, setEstadoInventario] = useState("");
    const [tipoMovimiento, setTipoMovimiento] = useState("");
    const [paciente, setPaciente] = useState("");

    // Options for dynamic selects
    const [formas, setFormas] = useState([]);
    const [concentraciones, setConcentraciones] = useState([]);

    useEffect(() => {
        setTitle("Reportes de Farmacia");
        setSubtitle("Genera informes detallados de inventario, medicamentos y movimientos.");

        api.get("/farmacia/formas-farmaceuticas").then((res) => {
            setFormas([{ value: "", label: "Todas las formas" }, ...res.data.map(f => ({ value: f.id_forma, label: f.forma_farmaceutica }))]);
        });
        api.get("/farmacia/concentraciones").then((res) => {
            setConcentraciones([{ value: "", label: "Todas las concentraciones" }, ...res.data.map(c => ({ value: c.id_concentracion, label: c.concentracion }))]);
        });
    }, [setTitle, setSubtitle]);

    // Reset filters and page when entity changes
    useEffect(() => {
        setSearch("");
        setIdForma("");
        setIdConcentracion("");
        setEstadoInventario("");
        setTipoMovimiento("");
        setPaciente("");
        setPage(1);
    }, [entity]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page };
            if (search.trim()) params.search = search;

            if (entity === "inventario" || entity === "medicamentos") {
                if (idForma) params.id_forma = idForma;
                if (idConcentracion) params.id_concentracion = idConcentracion;
            }
            if (entity === "inventario" && estadoInventario) params.estado = estadoInventario;

            if (entity === "movimientos") {
                if (tipoMovimiento) params.tipo = tipoMovimiento;
                if (tipoMovimiento === "ordenes_medicas" && paciente.trim()) {
                    params.paciente = paciente;
                }
            }

            const res = await api.get(`/farmacia/reportes/${entity}`, { params });
            setData(res.data || []);
            setMeta(res.meta || null);
            setTotal(res.total || 0);
            setLastPage(res.last_page || 1);
        } catch (error) {
            console.error("Error fetching report data", error);
        } finally {
            setLoading(false);
        }
    }, [entity, page, search, idForma, idConcentracion, estadoInventario, tipoMovimiento, paciente]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleExportPDF = async () => {
        try {
            const params = new URLSearchParams();
            if (search.trim()) params.append("search", search);

            if (entity === "inventario" || entity === "medicamentos") {
                if (idForma) params.append("id_forma", idForma);
                if (idConcentracion) params.append("id_concentracion", idConcentracion);
            }
            if (entity === "inventario" && estadoInventario) params.append("estado", estadoInventario);

            if (entity === "movimientos") {
                if (tipoMovimiento) params.append("tipo", tipoMovimiento);
                if (tipoMovimiento === "ordenes_medicas" && paciente.trim()) {
                    params.append("paciente", paciente);
                }
            }

            const response = await api.get(`/farmacia/reportes/${entity}/export?${params.toString()}`, {
                responseType: 'blob'
            });

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_farmacia_${entity}_${new Date().getTime()}.pdf`);
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
                const value = key.split('.').reduce((acc, part) => acc && acc[part], row);

                if (key === 'id_estado' || key.includes('nombre_estado') || key === 'estado') {
                    const isActiva = value === 'ACTIVA' || value === 'Activa' || row.id_estado === 1;
                    return (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isActiva ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>
                            {value || (isActiva ? 'ACTIVA' : 'INACTIVA')}
                        </span>
                    );
                }

                if (key === 'estado_stock') {
                    let bg = "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
                    if (value === "Vencido" || value === "Agotado") bg = "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
                    if (value === "Próximo" || value === "Bajo") bg = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
                    return <span className={`px-2.5 py-1 text-xs font-bold rounded-full border border-current ${bg}`}>{value}</span>;
                }

                if (key === 'stock_lote' || key === 'stock_actual') {
                    const isLow = Number(value) <= 20;
                    return (
                        <span className={`font-bold ${isLow ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}`}>
                            {value} <span className="text-[10px] font-normal text-gray-400">unid.</span>
                        </span>
                    );
                }

                if (key === 'stock_total') {
                    return (
                        <span className="font-semibold text-primary dark:text-blue-400">
                            {value} <span className="text-[10px] font-normal text-gray-400">unid.</span>
                        </span>
                    );
                }

                if (key === 'id_lote') {
                    return <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">#{value}</span>;
                }

                return <span className="text-gray-700 dark:text-gray-300">{value || "-"}</span>;
            }
        }));
    }, [meta]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            {/* Cabecera del Reporte */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText
                    icon="analytics"
                    text={meta?.report_title || "Reporte Dinámico"}
                    number={total}
                />

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2.5 px-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de reporte:</span>
                    <select
                        value={entity}
                        onChange={(e) => { setEntity(e.target.value); }}
                        className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none cursor-pointer font-bold text-primary dark:text-blue-400 appearance-none pr-4"
                    >
                        {entityOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-1.5 font-medium">{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filtros Dinámicos */}
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

                    <div className="flex-1 flex justify-end gap-3 flex-wrap">
                        {meta?.exportable?.includes("pdf") && (
                            <button
                                onClick={handleExportPDF}
                                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm shadow-red-200 dark:shadow-none mr-2"
                            >
                                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                <span className="hidden sm:inline">Exportar PDF</span>
                            </button>
                        )}

                        {/* Filtros compartidos de Medicamento/Inventario */}
                        {(entity === "inventario" || entity === "medicamentos") && (
                            <>
                                <div className="w-48">
                                    <Filter
                                        value={idForma}
                                        onChange={(v) => { setIdForma(v); setPage(1); }}
                                        options={formas}
                                        placeholder="Filtrar por forma"
                                    />
                                </div>
                                <div className="w-48">
                                    <Filter
                                        value={idConcentracion}
                                        onChange={(v) => { setIdConcentracion(v); setPage(1); }}
                                        options={concentraciones}
                                        placeholder="Filtrar por concentración"
                                    />
                                </div>
                            </>
                        )}

                        {/* Filtro específico de Inventario */}
                        {entity === "inventario" && (
                            <div className="w-48">
                                <Filter
                                    value={estadoInventario}
                                    onChange={(v) => { setEstadoInventario(v); setPage(1); }}
                                    options={estadoInventarioOptions}
                                    placeholder="Estado del stock"
                                />
                            </div>
                        )}

                        {/* Filtros específicos de Movimientos */}
                        {entity === "movimientos" && (
                            <>
                                <div className="w-48">
                                    <Filter
                                        value={tipoMovimiento}
                                        onChange={(v) => { setTipoMovimiento(v); setPage(1); }}
                                        options={tipoMovimientoOptions}
                                        placeholder="Tipo de movimiento"
                                    />
                                </div>
                                <AnimatePresence>
                                    {tipoMovimiento === "ordenes_medicas" && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "12rem" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <Input
                                                placeholder="Buscar paciente..."
                                                icon="person"
                                                value={paciente}
                                                onChange={(e) => setPaciente(e.target.value)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>
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
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all"
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
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all"
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
