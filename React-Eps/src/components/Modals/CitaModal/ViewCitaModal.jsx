import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";

export default function ViewCitaModal({ isOpen, onClose, cita }) {
    if (!isOpen || !cita) return null;

    const patientName = `${cita.paciente?.primer_nombre || ''} ${cita.paciente?.primer_apellido || ''}`;
    const doctorName = `Dr. ${cita.medico?.primer_nombre || ''} ${cita.medico?.primer_apellido || ''}`;
    const specialty = cita.tipoCita?.tipo || "Consulta General";
    const status = cita.estado?.nombre_estado || "Pendiente";

    return (
        <BaseModal>
            <ModalHeader
                title="Detalles de la Cita"
                icon="info"
                onClose={onClose}
            />

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-6">
                    {/* Seccion Paciente */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="text-blue-700 dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">person</span>
                            Información del Paciente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Nombre Completo</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{patientName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Documento de Identidad</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.paciente?.documento}</p>
                            </div>
                        </div>
                    </div>

                    {/* Seccion Medica */}
                    <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                        <h3 className="text-green-700 dark:text-green-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">medical_services</span>
                            Información Médica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Médico Tratante</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{doctorName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Especialidad / Tipo Cita</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{specialty}</p>
                            </div>
                        </div>
                    </div>

                    {/* Seccion Horario */}
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                        <h3 className="text-purple-700 dark:text-purple-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">schedule</span>
                            Fecha y Horario
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Fecha</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.fecha}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Hora Inicio</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.hora_inicio?.slice(0, 5)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Hora Fin</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.hora_fin?.slice(0, 5)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Estado y Motivo */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Estado de la Cita</label>
                            <div className="mt-1">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold inline-block
                                    ${status === 'Agendada' ? 'bg-blue-100 text-blue-700' :
                                        status === 'Confirmada' ? 'bg-green-100 text-green-700' :
                                            status === 'Cancelada' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'}
                                `}>
                                    {status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Motivo / Observaciones</label>
                            <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap italic">
                                    {cita.motivo || "No se registraron observaciones adicionales."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end bg-gray-50/50 dark:bg-gray-900/50">
                <div className="w-full md:w-auto">
                    <BlueButton
                        text="Cerrar Detalles"
                        icon="close"
                        onClick={onClose}
                    />
                </div>
            </div>
        </BaseModal>
    );
}
