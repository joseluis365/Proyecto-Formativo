import React from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import ModalBody from "@/components/Modals/ModalBody";
import ModalFooter from "@/components/Modals/ModalFooter";
import dayjs from "dayjs";
import "dayjs/locale/es";

export default function HistorialModal({ isOpen, onClose, report }) {
    if (!report || !isOpen) return null;

    return (
        <BaseModal maxWidth="max-w-2xl">
            <ModalHeader 
                icon="description"
                title={`Reporte: ${report.tabla_relacion}`}
                onClose={onClose}
            />
            
            <ModalBody>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold block mb-1">Generado por</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">account_circle</span>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {report.usuario ? `${report.usuario.primer_nombre} ${report.usuario.primer_apellido}` : "Usuario Desconocido"}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-8">
                                Rol: {report.usuario?.rol?.tipo_usu || "N/A"}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold block mb-1">Fecha y Hora</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_clock</span>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {dayjs(report.created_at).locale("es").format("D [de] MMMM [de] YYYY")}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-8">
                                {dayjs(report.created_at).format("h:mm a")}
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Total de Registros</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad exportada en este periodo</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm font-mono text-xl font-bold text-primary border border-gray-100 dark:border-gray-700">
                            {report.num_registros}
                        </div>
                    </div>

                    <div className="mt-2">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-lg">data_object</span>
                            Ejemplo de un Registro (Estructura)
                        </h4>
                        
                        <div className="bg-gray-900 dark:bg-black p-4 rounded-xl overflow-x-auto border border-gray-700 shadow-inner">
                            <pre className="text-[13px] text-green-400 font-mono leading-relaxed">
                                {report.ejemplo_registro 
                                    ? JSON.stringify(report.ejemplo_registro, null, 2)
                                    : "No hay información de ejemplo disponible"}
                            </pre>
                        </div>
                    </div>
                </div>
            </ModalBody>
            
            <ModalFooter>
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors cursor-pointer"
                >
                    Cerrar Detalles
                </button>
            </ModalFooter>
        </BaseModal>
    );
}
