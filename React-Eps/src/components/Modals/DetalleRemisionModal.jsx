import BaseModal from "./BaseModal";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";
import GeneralInfo from "./GeneralInfo";
import InfoSection from "./InfoSection";
import State from "./State";
import api from "@/Api/axios";
import { useState } from "react";

/**
 * Modal de detalles completos de una Remisión médica.
 * Props:
 *  - remision: objeto raw del historialDetalle.remisiones[]
 *  - cita: objeto raw de la cita original (para mostrar cita de origen)
 *  - onClose: fn
 */
export default function DetalleRemisionModal({ remision, cita, onClose }) {
    if (!remision) return null;

    const isExamen = remision.tipo_remision === "examen";
    const [downloading, setDownloading] = useState(false);

    const downloadPdf = async () => {
        if (!remision.id_remision) return;
        setDownloading(true);
        try {
            const resp = await api.get(`/pdf/remision/${remision.id_remision}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([resp], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `remision_${remision.id_remision}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch { /* silent */ } finally { setDownloading(false); }
    };

    const generalItems = [
        { label: "Fecha de Emisión", value: remision.created_at ? new Date(remision.created_at).toLocaleDateString() : "—" },
        { label: "Tipo", value: isExamen ? "Examen Clínico" : "Interconsulta / Especialista" },
        isExamen
            ? { label: "Categoría de Examen", value: (remision.categoriaExamen || remision.categoria_examen)?.categoria || "—" }
            : { label: "Especialidad Destino", value: remision.especialidad?.especialidad || "—" },
        !isExamen && remision.cita?.medico && { 
            label: "Médico Receptor", 
            value: `Dr. ${remision.cita.medico.primer_nombre} ${remision.cita.medico.primer_apellido}` 
        },
        remision.cita?.fecha && { label: "Fecha Cita", value: remision.cita.fecha },
        remision.cita?.hora_inicio && { label: "Hora Cita", value: remision.cita.hora_inicio.slice(0, 5) },
        isExamen && remision.examen?.fecha && { label: "Fecha Examen", value: remision.examen.fecha },
        isExamen && remision.examen?.hora_inicio && { label: "Hora Examen", value: remision.examen.hora_inicio.slice(0, 5) },
        { label: "Prioridad", value: remision.prioridad?.nombre_prioridad || "Normal" },
        { label: "Estado", value: remision.estado?.nombre_estado || "Activa" },
    ].filter(Boolean);

    if (isExamen) {
        generalItems.push({ label: "Requiere Ayuno", value: remision.requiere_ayuno ? "Sí — acuda en ayunas" : "No" });
    }

    const citaItems = cita ? [
        { label: "ID Cita Origen", value: `#${cita.id_cita}` },
        { label: "Fecha", value: `${cita.fecha} — ${cita.hora_inicio?.slice(0, 5)}` },
        { label: "Médico Remitente", value: `Dr. ${cita.medico?.primer_nombre || ""} ${cita.medico?.primer_apellido || ""}` },
        { label: "Paciente", value: `${cita.paciente?.primer_nombre || ""} ${cita.paciente?.primer_apellido || ""}` },
    ] : [];

    return (
        <BaseModal maxWidth="max-w-2xl">
            <ModalHeader
                icon={isExamen ? "lab_research" : "forward_to_inbox"}
                title={isExamen ? "Orden de Examen Clínico" : "Remisión Médica"}
                onClose={onClose}
            />
            <ModalBody>
                {/* Cita de Origen */}
                {cita && (
                    <>
                        <GeneralInfo item={citaItems} icon="calendar_month" title="DATOS DE LA CONSULTA" />
                        <hr className="border-gray-200 dark:border-gray-700" />
                    </>
                )}

                <GeneralInfo item={generalItems} icon="assignment_turned_in" title="DATOS DE LA REMISIÓN" />

                {/* Tipo-específico */}
                {isExamen && remision.requiere_ayuno && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex gap-3 items-start">
                        <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">warning</span>
                        <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Requiere Ayuno</p>
                            <p className="text-sm text-red-600 dark:text-red-300">Este examen requiere ayuno mínimo de 8 horas. No consuma alimentos ni bebidas azucaradas. Puede tomar agua.</p>
                        </div>
                    </div>
                )}

                {/* Notas / Motivo */}
                {remision.notas && (
                    <InfoSection icon="edit_note" title="Observaciones y Motivo" text={remision.notas} />
                )}

                {/* Estado */}
                <State state={remision.estado?.nombre_estado || "Activa"} />

                {/* Instrucciones para el paciente */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Instrucciones para el Paciente
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 leading-relaxed">
                        {isExamen
                            ? `Diríjase al área de ${(remision.categoriaExamen || remision.categoria_examen)?.categoria || "Laboratorio / Imágenes"} presentando este documento y su cédula de identidad.`
                            : `Acuda al servicio de ${remision.especialidad?.especialidad || "especialidad indicada"} con este documento y su documento de identidad.`
                        }
                        {" "}Este documento tiene validez de 30 días a partir de la fecha de emisión.
                    </p>
                </div>
            </ModalBody>
            <ModalFooter>
                <button
                    onClick={onClose}
                    className="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Cerrar
                </button>
                {remision.id_remision && (
                    <button
                        onClick={downloadPdf}
                        disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-base">download</span>
                        {downloading ? "Generando..." : "Descargar PDF"}
                    </button>
                )}
            </ModalFooter>
        </BaseModal>
    );
}
