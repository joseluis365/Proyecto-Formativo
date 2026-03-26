import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../Api/axios";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import SearchableSelect from "@/components/UI/SearchableSelect";
import DetalleRemisionModal from "@/components/Modals/DetalleRemisionModal";
import DetalleRecetaModal from "@/components/Modals/DetalleRecetaModal";


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


// ── Row Detail Modal ─────────────────────────────────────────────────────────
function CitaDetalleModal({ cita, onClose }) {
    if (!cita) return null;
    const paciente = cita.paciente;
    const detalle = cita.historialDetalle || cita.historial_detalle;
    const [selectedRemision, setSelectedRemision] = useState(null);
    const [selectedReceta, setSelectedReceta] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const getUnit = (key) => {
        const k = key.toUpperCase().replace(/_/g, " ");
        switch (k) {
            case 'FC':
            case 'FRECUENCIA CARDIACA': return 'lpm';
            case 'FR':
            case 'FRECUENCIA RESPIRATORIA': return 'rpm';
            case 'PESO': return 'kg';
            case 'TALLA':
            case 'ESTATURA': return 'm';
            case 'TEMPERATURA': return '°C';
            case 'TA SISTOLICA': return 'mmHG';
            case 'TA DIASTOLICA': return 'mmHG';
            case 'PRESION ARTERIAL': return 'mmHG';
            case 'SATURACION O2':
            case 'SATURACION OXIGENO': return '%';
            case 'IMC': return 'kg/m²';
            default: return '';
        }
    };

    const downloadPdf = async () => {
        if (!cita.id_cita) return;
        setDownloading(true);
        try {
            const resp = await api.get(`/pdf/cita/${cita.id_cita}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([resp], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `cita_${cita.id_cita}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch { /* silent */ } finally { setDownloading(false); }
    };

    return (
        <>
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
            >
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-primary uppercase tracking-widest">Consulta #{cita.id_cita}</p>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{cita.fecha} — {cita.hora_inicio?.slice(0,5)}</h2>
                        <p className="text-sm text-gray-500">{paciente ? `${paciente.primer_nombre} ${paciente.primer_apellido} · Doc: ${paciente.documento}` : cita.doc_paciente}</p>
                    </div>
                </div>

                {detalle && (
                    <div className="space-y-4">
                        {[
                            { label: "Motivo / Subjetivo", icon: "person_raised_hand", value: detalle.subjetivo },
                            { label: "Diagnóstico", icon: "stethoscope", value: detalle.diagnostico },
                            { label: "Tratamiento", icon: "medication", value: detalle.tratamiento },
                            { label: "Observaciones", icon: "notes", value: detalle.observaciones },
                        ].map(({ label, icon, value }) => value ? (
                            <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">{icon}</span> {label}
                                </h3>
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{value}</p>
                            </div>
                        ) : null)}

                        {detalle.signos_vitales && Object.keys(detalle.signos_vitales).length > 0 && (
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">monitor_heart</span> Signos Vitales
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {Object.entries(detalle.signos_vitales).map(([k, v]) => (
                                        <div key={k} className="bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-blue-50/50 dark:border-gray-700">
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-0.5 truncate" title={k.replace(/_/g, " ")}>
                                                {k.replace(/_/g, " ")}
                                            </p>
                                            <p className="text-sm font-black text-blue-700 dark:text-blue-300 flex items-baseline gap-1">
                                                {v} <span className="text-[10px] font-medium text-blue-500/70">{getUnit(k)}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {detalle.enfermedades?.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">vaccines</span> Enfermedades CIE-11
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {detalle.enfermedades.map(enf => (
                                        <span key={enf.codigo_icd} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                            [{enf.codigo_icd}] {enf.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {detalle.remisiones?.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">outpatient</span> Remisiones ({detalle.remisiones.length})
                                </h3>
                                <div className="space-y-3">
                                    {detalle.remisiones.map((r, i) => (
                                        <div key={r.id_remision || i} className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.tipo_remision === 'examen' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {r.tipo_remision === 'examen' ? 'EXAMEN' : 'REMISION'}
                                                    </span>
                                                    {r.id_remision && <span className="text-xs font-bold text-gray-400">#{r.id_remision}</span>}
                                                </div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                    {r.especialidad?.especialidad || (r.categoriaExamen || r.categoria_examen)?.categoria || "Requiere asignación"}
                                                </p>
                                                {(r.cita?.fecha || r.examen?.fecha) && (
                                                    <p className="text-[10px] font-bold text-primary mt-0.5 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">calendar_month</span>
                                                        {r.cita?.fecha || r.examen?.fecha} — { (r.cita?.hora_inicio || r.examen?.hora_inicio)?.slice(0,5) }
                                                    </p>
                                                )}
                                                {r.notas && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1" title={r.notas}>{r.notas}</p>}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedRemision(r); }}
                                                className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0 border border-primary/20"
                                            >
                                                <span className="material-symbols-outlined text-sm">open_in_full</span> Ver Detalles
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {detalle.receta && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">medication</span> Receta Médica
                                </h3>
                                <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                                                RECETA
                                            </span>
                                        {detalle.receta.id_receta && <span className="text-xs font-bold text-gray-400">#{detalle.receta.id_receta}</span>}
                                        </div>
                                        {(detalle.receta.recetaDetalles || detalle.receta.receta_detalles)?.length > 0 ? (
                                            <ul className="list-disc pl-4 space-y-1">
                                                {(detalle.receta.recetaDetalles || detalle.receta.receta_detalles).map((rd, i) => (
                                                    <li key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {rd.presentacion?.medicamento?.nombre} 
                                                        <span className="text-gray-400 font-normal ml-1">({rd.dosis} {rd.frecuencia} - hasta {rd.duracion})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">Sin medicamentos</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedReceta(detalle.receta); }}
                                        className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0 border border-primary/20 mt-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_full</span> Ver Detalles
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer del Modal - Botón PDF */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={downloadPdf}
                        disabled={downloading}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                            downloading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
                        }`}
                    >
                        {downloading ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined">description</span>
                        )}
                        {downloading ? "Generando..." : "Descargar PDF"}
                    </button>
                </div>
            </motion.div>
        </motion.div>

        {/* Sub-modals */}
        <AnimatePresence>
            {selectedRemision && (
                <DetalleRemisionModal
                    remision={selectedRemision}
                    cita={cita}
                    onClose={() => setSelectedRemision(null)}
                />
            )}
        </AnimatePresence>
        <AnimatePresence>
            {selectedReceta && (
                <DetalleRecetaModal
                    receta={selectedReceta}
                    cita={cita}
                    onClose={() => setSelectedReceta(null)}
                />
            )}
        </AnimatePresence>
        </>
    );
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

    useEffect(() => {
        const fetchEnfermedades = async () => {
            try {
                const res = await api.get("/enfermedades/buscar", { params: { limit: 3000 } });
                const list = Array.isArray(res) ? res : (res?.data || []);
                setEnfermedadesOptions(list.map(e => ({ value: e.codigo_icd, label: `[${e.codigo_icd}] ${e.nombre}` })));
            } catch {}
        };
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
        fetchEnfermedades();
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
                    <span className="material-symbols-outlined text-base text-primary">filter_list</span> Filtros
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
                        <span className="material-symbols-outlined text-sm">filter_list_off</span> Limpiar filtros
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
                    <span className={`material-symbols-outlined text-base ${downloadingReport ? 'animate-spin' : ''}`}>
                        {downloadingReport ? 'refresh' : 'download'}
                    </span>
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
                                        <span className="material-symbols-outlined text-4xl block mb-2">history</span>
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
                                                    <span className="material-symbols-outlined text-base">open_in_full</span>
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
                {selectedCita && <CitaDetalleModal cita={selectedCita} onClose={() => setSelectedCita(null)} />}
            </AnimatePresence>
        </div>
    );
}
