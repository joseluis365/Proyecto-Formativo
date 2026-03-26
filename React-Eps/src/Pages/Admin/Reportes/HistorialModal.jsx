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
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500 text-xl">fact_check</span>
                            Vista Previa de los Datos (Un Registro)
                        </h4>
                        
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            {report.ejemplo_registro && Object.keys(report.ejemplo_registro).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {Object.entries(report.ejemplo_registro).map(([key, value]) => {
                                        // No mostrar campos técnicos de Laravel si se colaron
                                        if (['pivot', 'laravel_through_key'].includes(key)) return null;
                                        
                                        const formattedKey = key
                                            .replace(/_/g, " ")
                                            .replace(/\bid\b/i, "ID")
                                            .replace(/^\w/, (c) => c.toUpperCase());

                                        let renderedValue = "-";
                                        if (value === true || value === 1 && key.includes('estado')) renderedValue = <span className="text-green-600 dark:text-green-400 font-bold">Sí</span>;
                                        else if (value === false || value === 0 && key.includes('estado')) renderedValue = <span className="text-red-600 dark:text-red-400 font-bold">No</span>;
                                        else if (value === null) renderedValue = <span className="text-gray-400 italic font-normal">No aplica</span>;
                                        else if (typeof value === 'object') renderedValue = <span className="text-gray-400 text-xs italic">Dato complejo</span>;
                                        else renderedValue = String(value);

                                        return (
                                            <div key={key} className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-2">
                                                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-0.5">
                                                    {formattedKey}
                                                </span>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                                    {renderedValue}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-400 italic">No hay información de ejemplo detallada para este reporte.</p>
                                </div>
                            )}
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
