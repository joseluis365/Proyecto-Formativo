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
 * Modal de detalles completos de una Receta Médica.
 * Props:
 *  - receta: objeto raw del historialDetalle.receta (con recetaDetalles cargados)
 *  - cita: objeto raw de la cita original
 *  - onClose: fn
 */
export default function DetalleRecetaModal({ receta, cita, onClose }) {
    if (!receta) return null;

    const [downloading, setDownloading] = useState(false);

    const downloadPdf = async () => {
        if (!receta.id_receta) return;
        setDownloading(true);
        try {
            const resp = await api.get(`/pdf/receta/${receta.id_receta}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([resp], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `receta_${receta.id_receta}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch { /* silent */ } finally { setDownloading(false); }
    };

    const citaItems = cita ? [
        { label: "ID Cita Origen", value: `#${cita.id_cita}` },
        { label: "Fecha de Consulta", value: `${cita.fecha} — ${cita.hora_inicio?.slice(0, 5)}` },
        { label: "Médico Prescriptor", value: `Dr. ${cita.medico?.primer_nombre || ""} ${cita.medico?.primer_apellido || ""}` },
        { label: "Especialidad", value: cita.especialidad?.nombre_especialidad || "Medicina General" },
    ] : [];

    const recetaItems = [
        { label: "ID Receta", value: `#${receta.id_receta}` },
        { label: "Estado", value: receta.estado?.nombre_estado || "Pendiente" },
        { label: "Fecha de Vencimiento", value: receta.fecha_vencimiento || "Según indicación médica" },
    ];

    return (
        <BaseModal maxWidth="max-w-2xl">
            <ModalHeader
                icon="medication"
                title="Receta Médica"
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

                {/* Info de la receta */}
                <GeneralInfo item={recetaItems} icon="assignment_turned_in" title="INFORMACIÓN DE LA RECETA" />

                {/* Estado */}
                <State state={receta.estado?.nombre_estado || "Pendiente"} />

                {/* Medicamentos */}
                {(receta.recetaDetalles || receta.receta_detalles)?.length > 0 ? (
                    <div>
                        <div className="flex gap-3 mb-3">
                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">medication</span>
                            <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">
                                Medicamentos Prescritos
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {(receta.recetaDetalles || receta.receta_detalles).map((det, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                                                {det.presentacion?.medicamento?.nombre || "Medicamento"}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {det.presentacion?.concentracion?.concentracion || ""}
                                                {" "}
                                                {det.presentacion?.formaFarmaceutica?.forma_farmaceutica || ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                        <div>
                                            <span className="text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Dosis</span>
                                            <span className="text-gray-700 dark:text-gray-300 font-semibold">{det.dosis}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Cantidad</span>
                                            <span className="text-gray-700 dark:text-gray-300 font-semibold">{det.cantidad_dispensar || "Según receta"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Frecuencia</span>
                                            <span className="text-gray-700 dark:text-gray-300 font-semibold">{det.frecuencia}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Fin Tratamiento</span>
                                            <span className="text-gray-700 dark:text-gray-300 font-semibold">{receta.fecha_vencimiento || det.duracion}</span>
                                        </div>
                                    </div>
                                    {det.observaciones && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{det.observaciones}</p>
                                    )}
                                    {/* Farmacia */}
                                    {det.farmacia && (
                                        <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-2.5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-base">local_pharmacy</span>
                                            <div>
                                                <p className="text-xs font-bold text-green-700 dark:text-green-400">{det.farmacia.nombre}</p>
                                                {det.farmacia.direccion && (
                                                    <p className="text-xs text-green-600 dark:text-green-500">{det.farmacia.direccion}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Sin medicamentos registrados</p>
                )}

                {/* Instrucciones */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Cómo Reclamar sus Medicamentos
                    </h4>
                    <ol className="text-sm text-green-700 dark:text-green-300 space-y-1 list-none">
                        <li>1. Diríjase a la farmacia indicada portando este documento y su cédula.</li>
                        <li>2. Presente el documento al farmacéutico en el área de dispensación.</li>
                        <li>3. Verifique la fecha de vencimiento de la receta antes de acudir.</li>
                        <li>4. Ante dudas sobre dosificación, consulte con su médico o el farmacéutico.</li>
                    </ol>
                </div>
            </ModalBody>
            <ModalFooter>
                <button
                    onClick={onClose}
                    className="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Cerrar
                </button>
                {receta.id_receta && (
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
