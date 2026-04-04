import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../Api/axios";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import SearchableSelect from "@/components/UI/SearchableSelect";
import DetalleRemisionModal from "@/components/Modals/DetalleRemisionModal";
import DetalleRecetaModal from "@/components/Modals/DetalleRecetaModal";
import CitaDetalleMedicoModal from "@/components/Modals/CitaModal/CitaDetalleMedicoModal";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import FilterListOffRoundedIcon from '@mui/icons-material/FilterListOffRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
// ── PDF Generation (via browser print) ─────────────────────────────────────
function generatePdfContent(items, title) {
    const rows = items.map(c => {
        const detalle = c.historialDetalle || c.historial_detalle;
        const diagnosticoStr = detalle?.enfermedades?.length > 0 
            ? detalle.enfermedades.map(e => e.nombre).join(", ") 
            : (detalle?.diagnostico || "—");
        const motivo = (c.motivo_consulta || c.motivoConsulta)?.motivo || "General";
        
        return `
        <tr>
            <td>${c.id_cita}</td>
            <td>${c.fecha || "—"}</td>
            <td>${c.hora_inicio?.slice(0,5) || "—"}</td>
            <td>${c.paciente ? `${c.paciente.primer_nombre} ${c.paciente.primer_apellido}` : c.doc_paciente}</td>
            <td>${motivo}</td>
            <td>${diagnosticoStr}</td>
        </tr>`;
    }).join("");
    
    return `<!DOCTYPE html><html><head><title>${title}</title>
<style>body{font-family:sans-serif;font-size:12px;padding:20px}
table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}
th{background:#f5f5f5;font-weight:bold}h2{color:#1d4ed8;margin-bottom:16px}</style></head>
<body><h2>${title}</h2><table>
<thead><tr><th>#</th><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Motivo</th><th>Diagnóstico</th></tr></thead>
<tbody>${rows}</tbody></table></body></html>`;
}


// ── Main Component ───────────────────────────────────────────────────────────
export default function HistorialCitasAtendidas() {
    const { setTitle, setSubtitle } = useLayout();

    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [selectedCita, setSelectedCita] = useState(null);
    const [enfermedadesOptions, setEnfermedadesOptions] = useState([]);
    const [loadingEnfermedades, setLoadingEnfermedades] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debounceTimeout = useRef(null);
    const [motivosOptions, setMotivosOptions] = useState([]);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [filters, setFilters] = useState({
        fecha: "",
        busqueda: "",
        codigo_enfermedad: "",
        id_motivo: "",
    });

    useHelp({
        title: "Historial de Citas y Reportes",
        description: "En esta sección puedes consultar todas tus atenciones pasadas y generar reportes profesionales para tu archivo o para el paciente.",
        sections: [
            {
                title: "¿Qué puedes hacer aquí?",
                type: "list",
                items: [
                    "Visualizar detalles completos de cada cita (Signos vitales, Diagnóstico, Recetas).",
                    "Filtrar el historial por fecha, paciente, enfermedad (CIE-11) o motivo de consulta.",
                    "Descargar reportes oficiales en PDF con formato profesional."
                ]
            },
            {
                title: "Pasos para generar un reporte",
                type: "steps",
                items: [
                    "Aplica los filtros necesarios (ej: Rango de fecha o Motivo) para segmentar la información.",
                    "Verifica en la tabla que se muestren las citas que deseas incluir.",
                    "Haz clic en el botón 'Descargar Reporte' en la parte inferior derecha.",
                    "El sistema generará automáticamente un PDF horizontal con el logo de la EPS y tu información profesional."
                ]
            },
            {
                title: "Recomendaciones",
                type: "warning",
                content: "Recuerda que los reportes generados son documentos oficiales. Asegúrate de que los diagnósticos estén correctamente registrados antes de exportar."
            }
        ]
    });

    useEffect(() => {
        setTitle("Mis Citas Atendidas");
        setSubtitle("Historial completo de consultas realizadas");
    }, [setTitle, setSubtitle]);

    // Async fetch for enfermedades based on search query
    useEffect(() => {
        if (!searchQuery) {
            setEnfermedadesOptions([]);
            return;
        }

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async () => {
            setLoadingEnfermedades(true);
            try {
                const res = await api.get("/enfermedades/buscar", { params: { search: searchQuery, limit: 50 } });
                const list = Array.isArray(res) ? res : (res?.data || []);
                setEnfermedadesOptions(list.map(e => ({ value: e.codigo_icd, label: `[${e.codigo_icd}] ${e.nombre}` })));
            } catch (error) {
                console.error("Error buscando enfermedades:", error);
                setEnfermedadesOptions([]);
            } finally {
                setLoadingEnfermedades(false);
            }
        }, 500);

        return () => clearTimeout(debounceTimeout.current);
    }, [searchQuery]);

    useEffect(() => {
        const fetchMotivos = async () => {
            try {
                const res = await api.get("/motivos-consulta");
                const list = Array.isArray(res) ? res : (res?.data || []);
                // Si ya viene con {value, label}, lo usamos directamente
                if (list.length > 0 && list[0].value && list[0].label) {
                    setMotivosOptions(list);
                } else {
                    setMotivosOptions(list.map(m => ({ value: m.id_motivo, label: m.motivo })));
                }
            } catch {}
        };
        fetchMotivos();
    }, []);

    const fetchCitas = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                per_page: 15,
                atendidas: 1,
            };
            if (filters.fecha) params.fecha = filters.fecha;
            if (filters.busqueda) params.busqueda = filters.busqueda;
            if (filters.codigo_enfermedad) params.codigo_enfermedad = filters.codigo_enfermedad;
            if (filters.id_motivo) params.id_motivo = filters.id_motivo;

            const res = await api.get("/citas", { params });
            const data = res.data ?? res;
            const items = Array.isArray(data) ? data : (data.data ?? []);
            setCitas(items);
            setMeta({ current_page: data.current_page ?? 1, last_page: data.last_page ?? 1, total: data.total ?? items.length });
        } catch {
            setCitas([]);
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => { fetchCitas(); }, [fetchCitas]);

    const downloadReport = async () => {
        if (citas.length === 0) return;
        setDownloadingReport(true);
        try {
            const params = {
                id_estado: 10,
                search: filters.busqueda || undefined,
                date_from: filters.fecha || undefined,
                date_to: filters.fecha || undefined,
                codigo_icd: filters.codigo_enfermedad || undefined,
                id_motivo: filters.id_motivo || undefined
            };

            const response = await api.get('/personal/reportes/citas/export', {
                params,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_mis_citas_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            Swal.fire({
                title: 'Reporte Generado',
                text: 'El historial de reportes ha sido actualizado.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (error) {
            console.error("Error al exportar reporte:", error);
            Swal.fire("Error", "No se pudo generar el reporte en este momento.", "error");
        } finally {
            setDownloadingReport(false);
        }
    };

    const handleFilterChange = (key, val) => {
        setFilters(prev => ({ ...prev, [key]: val }));
        setPage(1);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-2">
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FilterListRoundedIcon sx={{ fontSize: '1rem' }} className="text-primary" /> Filtros
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 max-[1090px]:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</label>
                        <input
                            type="date"
                            value={filters.fecha}
                            onChange={(e) => handleFilterChange("fecha", e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paciente / Doc.</label>
                        <input
                            type="text"
                            value={filters.busqueda}
                            placeholder="Buscar paciente..."
                            onChange={(e) => handleFilterChange("busqueda", e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filtrar por Enfermedad</label>
                        <SearchableSelect
                            options={enfermedadesOptions}
                            value={filters.codigo_enfermedad}
                            onChange={(val) => handleFilterChange("codigo_enfermedad", val)}
                            placeholder="Buscar CIE-11..."
                            onSearchChange={setSearchQuery}
                            loading={loadingEnfermedades}
                            noOptionsText="Escribe para buscar..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Motivo de Consulta</label>
                        <SearchableSelect
                            options={motivosOptions}
                            value={filters.id_motivo}
                            onChange={(val) => handleFilterChange("id_motivo", val)}
                            placeholder="Todos..."
                        />
                    </div>
                </div>
                {(filters.fecha || filters.busqueda || filters.codigo_enfermedad || filters.id_motivo) && (
                    <button
                        onClick={() => { setFilters({ fecha: "", busqueda: "", codigo_enfermedad: "", id_motivo: "" }); setPage(1); }}
                        className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                    >
                        <FilterListOffRoundedIcon sx={{ fontSize: '0.875rem' }} /> Limpiar filtros
                    </button>
                )}
            </div>

            {/* Acciones globales */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    <strong>{meta.total}</strong> citas atendidas
                </p>
                <button
                    onClick={downloadReport}
                    disabled={citas.length === 0 || downloadingReport}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary border border-primary/30 hover:bg-primary/5 rounded-xl transition-colors disabled:opacity-40"
                >
                    {downloadingReport ? (
                        <RefreshRoundedIcon className="animate-spin" sx={{ fontSize: '1rem' }} />
                    ) : (
                        <DownloadRoundedIcon sx={{ fontSize: '1rem' }} />
                    )}
                    {downloadingReport ? 'Generando...' : 'Descargar Reporte'}
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hora</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Motivo</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array.from({ length: 6 }).map((__, j) => (
                                            <td key={j} className="px-4 py-3">
                                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : citas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        <HistoryRoundedIcon sx={{ fontSize: '2.5rem' }} className="mb-2 block mx-auto" />
                                        No se encontraron citas atendidas
                                    </td>
                                </tr>
                            ) : (
                                citas.map(cita => {
                                    const paciente = cita.paciente;
                                    const detalle = cita.historialDetalle || cita.historial_detalle;
                                    return (
                                        <tr
                                            key={cita.id_cita}
                                            className="hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer transition-colors group"
                                            onClick={() => setSelectedCita(cita)}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{cita.fecha}</td>
                                            <td className="px-4 py-3 text-gray-500">{cita.hora_inicio?.slice(0, 5)}</td>
                                            <td className="px-4 py-3">
                                                {paciente ? (
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-gray-200">{paciente.primer_nombre} {paciente.primer_apellido}</p>
                                                        <p className="text-xs text-gray-400">Doc: {paciente.documento}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">{cita.doc_paciente}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{(cita.motivo_consulta || cita.motivoConsulta)?.motivo || "General"}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs">
                                                <p className="truncate">
                                                    {detalle?.enfermedades?.length > 0 
                                                        ? detalle.enfermedades.map(e => e.nombre).join(", ") 
                                                        : (detalle?.diagnostico || "—")}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedCita(cita); }}
                                                    className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <OpenInFullRoundedIcon sx={{ fontSize: '1rem' }} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
                        <span>Página {meta.current_page} de {meta.last_page}</span>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                                ‹ Anterior
                            </button>
                            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">
                                Siguiente ›
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Detalle */}
            <AnimatePresence>
                {selectedCita && <CitaDetalleMedicoModal cita={selectedCita} onClose={() => setSelectedCita(null)} />}
            </AnimatePresence>
        </div>
    );
}
