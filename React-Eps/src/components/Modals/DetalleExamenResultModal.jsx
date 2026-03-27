import BaseModal from "./BaseModal";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";
import GeneralInfo from "./GeneralInfo";
import api from "@/Api/axios";
import { useState, useMemo } from "react";
import WhiteButton from "../UI/WhiteButton";

/**
 * Modal para que el paciente vea los resultados de un examen clínico finalizado.
 */
export default function DetalleExamenResultModal({ examen, citaOrigen, onClose }) {
    if (!examen) return null;

    const [loading, setLoading] = useState(false);

    const medicoName = useMemo(() => {
        if (!citaOrigen?.medico) return "—";
        if (typeof citaOrigen.medico === "string") return citaOrigen.medico;
        const m = citaOrigen.medico;
        return `${m.primer_nombre || ''} ${m.primer_apellido || ''}`.trim() || m.documento || "—";
    }, [citaOrigen]);

    const handleAction = async (download = false) => {
        if (!examen.id_examen) return;
        setLoading(true);
        try {
            const resp = await api.get(`/examenes/${examen.id_examen}/resultado`, { responseType: "blob" });
            const blob = new Blob([resp], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            if (download) {
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `resultado_examen_${examen.id_examen}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                window.open(url, "_blank");
            }

            // Revoke after a delay to ensure the browser has time to open/download
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error("Error al obtener el resultado:", error);
        } finally {
            setLoading(false);
        }
    };

    const infoItems = [
        { label: "Categoría", value: examen.categoria_examen?.categoria || "—" },
        { label: "Fecha Realización", value: examen.fecha || "—" },
        { label: "Hora", value: examen.hora_inicio?.slice(0, 5) || "—" },
        { label: "Estado", value: examen.estado?.nombre_estado || "Finalizada" },
    ];

    return (
        <BaseModal maxWidth="max-w-md">
            <ModalHeader
                icon="science"
                title="Resultados de Examen"
                onClose={onClose}
            />
            <ModalBody>
                <div className="space-y-6">
                    {citaOrigen && (
                        <>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5">
                                    <span className="material-symbols-outlined text-4xl">history</span>
                                </div>
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">history_edu</span>
                                    Consulta de Origen
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fecha</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{citaOrigen.fecha || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Médico Solicitante</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate" title={medicoName}>
                                            {medicoName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <hr className="border-gray-100 dark:border-gray-800" />
                        </>
                    )}

                    <GeneralInfo 
                        item={infoItems} 
                        icon="info" 
                        title="DATOS DEL SERVICIO" 
                    />

                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 items-start">
                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">verified</span>
                        <div>
                            <p className="text-sm font-bold text-primary mb-1">Resultados Listos</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Los resultados de su examen clínico han sido validados y están disponibles para su visualización y descarga.
                            </p>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <button
                        onClick={() => handleAction(false)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        Visualizar
                    </button>
                    <button
                        onClick={() => handleAction(true)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">download</span>
                        {loading ? "Cargando..." : "Descargar"}
                    </button>
                </div>
            </ModalFooter>
        </BaseModal>
    );
}
