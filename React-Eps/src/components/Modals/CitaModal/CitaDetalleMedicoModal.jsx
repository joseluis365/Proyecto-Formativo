import { useState, useMemo } from "react";
import api from "@/Api/axios";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import ModalBody from "@/components/Modals/ModalBody";

/**
 * CitaDetalleMedicoModal
 * 
 * Modal profesional para visualizar los detalles clínicos de una cita atendida.
 * Incluye: Signos vitales, Diagnóstico CIE-11, Remisiones, Recetas y Descarga de PDF.
 */
export default function CitaDetalleMedicoModal({ cita, citaOrigen, onClose, onViewRemision, onViewReceta }) {
    if (!cita) return null;

    const paciente = cita.paciente;
    const detalle = cita.historialDetalle || cita.historial_detalle;
    const [downloading, setDownloading] = useState(false);

    const originMedicoName = useMemo(() => {
        if (!citaOrigen?.medico) return "Médico solicitante";
        if (typeof citaOrigen.medico === "string") return citaOrigen.medico;
        const m = citaOrigen.medico;
        return `${m.primer_nombre || ''} ${m.primer_apellido || ''}`.trim() || m.documento || "Médico solicitante";
    }, [citaOrigen]);

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
        } catch (error) {
            console.error("Error al descargar PDF:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <BaseModal maxWidth="max-w-2xl" onClose={onClose}>
            <ModalHeader
                title={`Consulta #${cita.id_cita} — ${cita.fecha} ${cita.hora_inicio?.slice(0, 5)}`}
                subtitle={paciente ? `${paciente.primer_nombre} ${paciente.primer_apellido} · Doc: ${paciente.documento}${cita.especialidad?.especialidad ? ` · ${cita.especialidad.especialidad}` : ""}` : cita.doc_paciente}
                onClose={onClose}
                icon="clinical_notes"
            />

            <ModalBody>
                <div className="space-y-5">
                    {citaOrigen && (
                        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-xl">history</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Atención Derivada de</p>
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                        Consulta del {citaOrigen.fecha} • {originMedicoName}
                                    </p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-primary/10 text-[10px] font-black text-primary uppercase shadow-sm">
                                Remisión Previa
                            </div>
                        </div>
                    )}

                    {detalle ? (
                        <div className="space-y-4">
                            {[
                                { label: "Motivo / Subjetivo", icon: "person_raised_hand", value: detalle.subjetivo },
                                { label: "Diagnóstico / Análisis", icon: "stethoscope", value: detalle.diagnostico },
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

                            {/* Signos Vitales */}
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

                            {/* Enfermedades CIE-11 */}
                            {detalle.enfermedades?.length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">vaccines</span> Diagnósticos CIE-11
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {detalle.enfermedades.map(enf => (
                                            <span key={enf.codigo_icd} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full">
                                                [{enf.codigo_icd}] {enf.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Remisiones */}
                            {detalle.remisiones?.length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">outpatient</span> Remisiones ({detalle.remisiones.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {detalle.remisiones.map((r, i) => (
                                            <div key={r.id_remision || i} className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4 shadow-sm">
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
                                                            {r.cita?.fecha || r.examen?.fecha} — {(r.cita?.hora_inicio || r.examen?.hora_inicio)?.slice(0, 5)}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onViewRemision?.(r); }}
                                                    className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0 border border-primary/20"
                                                >
                                                    <span className="material-symbols-outlined text-sm">assignment_turned_in</span> Ver Resultado
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Receta */}
                            {detalle.receta && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">medication</span> Receta Médica
                                    </h3>
                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4 shadow-sm">
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
                                                            <span className="text-gray-400 font-normal ml-1">({rd.dosis} {rd.frecuencia} - {rd.duracion})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500">Sin medicamentos prescritos.</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewReceta?.(detalle.receta); }}
                                            className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0 border border-primary/20 mt-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">clinical_notes</span> Ver Atención
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">history_toggle_off</span>
                            <p className="text-sm text-gray-400 italic">Sin detalles clínicos registrados para esta cita aún.</p>
                        </div>
                    )}
                </div>
            </ModalBody>

            <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                    onClick={downloadPdf}
                    disabled={downloading || !cita.id_cita}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all ${downloading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
                        }`}
                >
                    <span className={`material-symbols-outlined text-base ${downloading ? "animate-spin" : ""}`}>
                        {downloading ? "refresh" : "description"}
                    </span>
                    {downloading ? "Generando..." : "Descargar PDF"}
                </button>
            </div>
        </BaseModal>
    );
}
