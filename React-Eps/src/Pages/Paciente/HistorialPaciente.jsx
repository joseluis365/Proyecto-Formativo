import { useState, useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import api from "@/Api/axios";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";
import DetalleRemisionModal from "@/components/Modals/DetalleRemisionModal";
import DetalleRecetaModal from "@/components/Modals/DetalleRecetaModal";

// ── PDF helper ────────────────────────────────────────────────────────────────
function printCita(cita) {
    const d = cita.historialDetalle || cita.historial_detalle;
    const paciente = cita.paciente;
    const medico = cita.medico;
    const meds = d?.receta?.recetaDetalles?.map(rd =>
        `<li>${rd.presentacion?.medicamento?.nombre || "Medicamento"} — ${rd.dosis}, ${rd.frecuencia}, hasta ${rd.duracion}</li>`
    ).join("") || "<li>Sin receta</li>";

    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>Consulta #${cita.id_cita}</title>
<style>body{font-family:sans-serif;font-size:13px;padding:24px;max-width:700px;margin:auto}
h2{color:#1d4ed8;margin-bottom:8px}h3{color:#374151;margin-top:16px;border-bottom:1px solid #e5e7eb;padding-bottom:4px}
p,li{line-height:1.6;margin:4px 0}ul{padding-left:20px}</style></head>
<body>
<h2>Consulta Médica — ${cita.fecha}</h2>
<p><strong>Paciente:</strong> ${paciente?.primer_nombre || ""} ${paciente?.primer_apellido || ""} (Doc: ${paciente?.documento || cita.doc_paciente})</p>
<p><strong>Médico:</strong> Dr. ${medico?.primer_nombre || ""} ${medico?.primer_apellido || ""}</p>
<p><strong>Especialidad:</strong> ${cita.especialidad?.nombre_especialidad || "General"}</p>
<p><strong>Hora:</strong> ${cita.hora_inicio?.slice(0, 5)}</p>
<h3>Subjetivo (Motivo)</h3><p>${d?.subjetivo || "Sin registro"}</p>
<h3>Diagnóstico</h3><p>${d?.diagnostico || "Sin registro"}</p>
<h3>Tratamiento</h3><p>${d?.tratamiento || "Sin registro"}</p>
<h3>Observaciones</h3><p>${d?.observaciones || "Sin observaciones"}</p>
<h3>Medicamentos Recetados</h3><ul>${meds}</ul>
</body></html>`);
    win.document.close();
    win.print();
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function CitaDetalleModal({ cita, onClose }) {
    if (!cita) return null;
    const det = cita.historialDetalle || cita.historial_detalle;
    const [selectedRemision, setSelectedRemision] = useState(null);
    const [selectedReceta, setSelectedReceta] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const getUnit = (key) => {
        switch (key.toLowerCase()) {
            case 'frecuencia_cardiaca': return 'lpm';
            case 'frecuencia_respiratoria': return 'rpm';
            case 'presion_arterial': return 'mmHg';
            case 'temperatura': return '°C';
            case 'saturacion_oxigeno': return '%';
            case 'peso': return 'kg';
            case 'estatura': return 'cm';
            case 'talla': return 'cm';
            case 'imc': return 'kg/m²';
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
                <ModalHeader
                    title="Detalles de la Cita"
                    onClose={onClose}
                    icon="clinical_notes"
                />

                {det && (
                    <div className="space-y-3">
                        {[
                            { label: "Motivo de consulta", icon: "person_raised_hand", value: det.subjetivo },
                            { label: "Diagnóstico", icon: "stethoscope", value: det.diagnostico },
                            { label: "Tratamiento", icon: "medication", value: det.tratamiento },
                            { label: "Observaciones", icon: "notes", value: det.observaciones },
                        ].map(({ label, icon, value }) => value ? (
                            <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">{icon}</span> {label}
                                </h3>
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{value}</p>
                            </div>
                        ) : null)}

                        {det.enfermedades?.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">vaccines</span> Diagnósticos CIE-11
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {det.enfermedades.map(enf => (
                                        <span key={enf.codigo_icd} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                            [{enf.codigo_icd}] {enf.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {det.receta && (
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
                                        {det.receta.id_receta && <span className="text-xs font-bold text-gray-400">#{det.receta.id_receta}</span>}
                                        </div>
                                        {(det.receta.recetaDetalles || det.receta.receta_detalles)?.length > 0 ? (
                                            <ul className="list-disc pl-4 space-y-1">
                                                {(det.receta.recetaDetalles || det.receta.receta_detalles).map((rd, i) => (
                                                    <li key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {rd.presentacion?.medicamento?.nombre}
                                                        <span className="text-gray-400 font-normal ml-1">({rd.dosis} por {rd.duracion})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">Sin medicamentos</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedReceta(det.receta); }}
                                        className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0 border border-primary/20 mt-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_full</span> Ver Detalles
                                    </button>
                                </div>
                            </div>
                        )}

                        {det.remisiones?.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">outpatient</span> Remisiones ({det.remisiones.length})
                                </h3>
                                <div className="space-y-3">
                                    {det.remisiones.map((r, i) => (
                                        <div key={r.id_remision || i} className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.tipo_remision === 'examen' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {r.tipo_remision === 'examen' ? 'EXAMEN' : 'INTERCONSULTA'}
                                                    </span>
                                                    {r.id_remision && <span className="text-xs font-bold text-gray-400">#{r.id_remision}</span>}
                                                </div>
                                                 <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                     {r.especialidad?.especialidad || r.categoriaExamen?.categoria || "Requiere asignación"}
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
                    </div>
                )}
                <ModalFooter>
                    <button
                        onClick={onClose}
                        className="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={downloadPdf}
                        disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-bold"
                    >
                        <span className="material-symbols-outlined text-base">
                            {downloading ? 'sync' : 'download'}
                        </span>
                        {downloading ? 'Generando...' : 'Descargar PDF Consulta'}
                    </button>
                </ModalFooter>
            </motion.div>
        </motion.div>

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

// ── Main Component ────────────────────────────────────────────────────────────
export default function HistorialPaciente() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);

    useEffect(() => {
        setTitle("Mi Historial Médico");
        setSubtitle("Consulta tus atenciones pasadas, diagnósticos y tratamientos.");
        setHelpContent({
            title: "Línea de Tiempo Médica",
            description: "Revisa todo tu historial clínico ordenado de manera cronológica.",
            sections: [
                {
                    title: "Atenciones Registradas",
                    type: "text",
                    content: "Aquí solo aparecerán las citas marcadas como 'Atendida' por el profesional de la salud."
                },
                {
                    title: "Ver Detalles",
                    type: "tip",
                    content: "Haz clic en 'Ver Detalles completos' en cualquier consulta para ver toda la información y descargar el PDF."
                }
            ]
        });
        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    useEffect(() => {
        const fetchHistorial = async () => {
            setLoading(true);
            try {
                const res = await api.get("/citas", {
                    params: { doc_paciente: user.documento, atendidas: 1, per_page: 100 }
                });
                const items = Array.isArray(res) ? res : (res?.data ?? []);
                setCitas(items.sort((a, b) =>
                    `${b.fecha}T${b.hora_inicio}`.localeCompare(`${a.fecha}T${a.hora_inicio}`)
                ));
            } catch {
                setCitas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistorial();
    }, [user.documento]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <PrincipalText
                icon="history_edu"
                text="Línea de Tiempo Médica"
                subtext="Sigue la evolución de tu salud a través de tus citas finalizadas."
            />

            {loading ? (
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-3 py-4">
                        <span className="material-symbols-outlined text-3xl text-primary animate-spin">autorenew</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cargando resultados...</span>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-4xl p-8 animate-pulse border border-neutral-gray-border/10">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-6"></div>
                        </div>
                    ))}
                </div>
            ) : citas.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4 block">medical_information</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Historial vacío</h3>
                    <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto">Cuando completes tus consultas médicas, aparecerán aquí ordenadas por fecha.</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative ml-4 md:ml-0 md:pl-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-primary before:via-primary/20 before:to-transparent"
                >
                    {citas.map((cita) => {
                        const det = cita.historialDetalle || cita.historial_detalle;
                        const medico = cita.medico;
                        const hasRemisiones = det?.remisiones?.length > 0;
                        const hasReceta = det?.receta?.recetaDetalles?.length > 0;
                        const [year, month, day] = (cita.fecha || "2000-01-01").split("-").map(Number);
                        const fechaDisplay = new Date(year, month - 1, day).toLocaleDateString("es-ES", {
                            year: "numeric", month: "long", day: "numeric"
                        });

                        return (
                            <motion.div
                                key={cita.id_cita}
                                variants={itemVariants}
                                className="relative mb-12 last:mb-0"
                            >
                                <div className="absolute -left-[21px] md:-left-[37px] top-6 size-4 rounded-full bg-primary ring-4 ring-primary/20 border-2 border-white dark:border-gray-900 z-10 shadow-lg shadow-primary/40"></div>

                                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-neutral-gray-border/10 hover:shadow-primary/5 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                        <div>
                                            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                                <span className="material-symbols-outlined text-sm">calendar_month</span>
                                                {fechaDisplay} • {cita.hora_inicio?.slice(0, 5)}
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                                                Dr. {medico?.primer_nombre} {medico?.primer_apellido}
                                            </h2>
                                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">
                                                {cita.especialidad?.nombre_especialidad || "Consulta General"}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {hasRemisiones && det.remisiones.some(r => r.tipo_remision === "examen") && (
                                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-xs">lab_research</span> Examen solicitado
                                                </span>
                                            )}
                                            {hasRemisiones && det.remisiones.some(r => r.tipo_remision === "cita") && (
                                                <span className="px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-100 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-xs">forward_to_inbox</span> Interconsulta
                                                </span>
                                            )}
                                            {hasReceta && (
                                                <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-xs">medication</span> Receta
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                                <div className="size-1 bg-primary rounded-full"></div>
                                                Diagnóstico Clínico
                                            </h4>
                                            <p className="text-gray-700 dark:text-gray-300 font-bold leading-relaxed bg-primary/5 p-5 rounded-2xl border-l-4 border-primary">
                                                {det?.diagnostico || "Sin registro"}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                                <div className="size-1 bg-green-500 rounded-full"></div>
                                                Tratamiento Sugerido
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                {det?.tratamiento || "Sin registro"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                        <button
                                            onClick={() => setSelectedCita(cita)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-primary border border-primary/20 hover:bg-primary/5 rounded-xl transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base">open_in_full</span>
                                            Ver Detalles completos
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            <AnimatePresence>
                {selectedCita && (
                    <CitaDetalleModal cita={selectedCita} onClose={() => setSelectedCita(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
