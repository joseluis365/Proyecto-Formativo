import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import { useNavigate } from "react-router-dom";

export default function ViewCitaModal({ isOpen, onClose, cita }) {
    const navigate = useNavigate();
    if (!isOpen || !cita) return null;

    const patientName = `${cita.paciente?.primer_nombre || ''} ${cita.paciente?.primer_apellido || ''}`;
    const doctorName = cita.medico ? `Dr. ${cita.medico.primer_nombre} ${cita.medico.primer_apellido}` : "Por Asignar";
    const specialty = cita.tipo_evento === 'remision' ? `Remisión a Especialista` : cita.tipo_evento === 'examen' ? `Orden de Examen` : (cita.tipoCita?.tipo || "Consulta General");
    const status = cita.estado?.nombre_estado || "Pendiente";

    const goToFullHistory = () => {
        const doc = cita.paciente?.documento;
        if (!doc) return;
        
        onClose();
        // Determine path based on current location to stay in the correct layout
        const path = window.location.pathname.includes('/medico')
            ? `/medico/pacientes/${doc}/historial`
            : `/usuarios/pacientes/${doc}/historial`;
        navigate(path);
    };

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
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.fecha || 'Sin fecha agendada'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Hora Inicio</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.hora_inicio?.slice(0, 5) || '--:--'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Hora Fin</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.hora_fin?.slice(0, 5) || '--:--'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección Clínica (Solo si está finalizada) */}
                    {status === 'Atendida' && cita.historialDetalle && (
                        <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                             <h3 className="text-primary dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">clinical_notes</span>
                                Resultados de la Consulta
                            </h3>

                            {[
                                { label: "Motivo / Subjetivo", icon: "person_raised_hand", value: cita.historialDetalle.subjetivo },
                                { label: "Diagnóstico", icon: "stethoscope", value: cita.historialDetalle.diagnostico },
                                { label: "Tratamiento", icon: "medication", value: cita.historialDetalle.tratamiento },
                                { label: "Observaciones", icon: "notes", value: cita.historialDetalle.observaciones },
                            ].map(({ label, icon, value }) => value ? (
                                <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">{icon}</span> {label}
                                    </h3>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{value}</p>
                                </div>
                            ) : null)}

                            {/* Signos Vitales */}
                            {cita.historialDetalle.signos_vitales && Object.keys(cita.historialDetalle.signos_vitales).length > 0 && (
                                <div className="bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100/50 dark:border-blue-900/30">
                                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">monitor_heart</span> Signos Vitales
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {Object.entries(cita.historialDetalle.signos_vitales).map(([k, v]) => (
                                            <div key={k} className="bg-white dark:bg-gray-900 rounded-lg p-2.5 shadow-sm border border-blue-50/50 dark:border-gray-800">
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-0.5 truncate" title={k.replace(/_/g, " ")}>
                                                    {k.replace(/_/g, " ")}
                                                </p>
                                                <p className="text-sm font-black text-blue-700 dark:text-blue-300">
                                                    {v}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Enfermedades */}
                            {cita.historialDetalle.enfermedades?.length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">vaccines</span> Enfermedades CIE-11
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {cita.historialDetalle.enfermedades.map(enf => (
                                            <span key={enf.codigo_icd} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full">
                                                [{enf.codigo_icd}] {enf.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Receta */}
                            {cita.historialDetalle.receta && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">medication</span> Receta Médica
                                    </h3>
                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                                        {(cita.historialDetalle.receta.recetaDetalles || cita.historialDetalle.receta.receta_detalles)?.length > 0 ? (
                                            <ul className="list-disc pl-4 space-y-1">
                                                {(cita.historialDetalle.receta.recetaDetalles || cita.historialDetalle.receta.receta_detalles).map((rd, i) => (
                                                    <li key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {rd.presentacion?.medicamento?.nombre} 
                                                        <span className="text-gray-400 font-normal ml-1">({rd.dosis} por {rd.duracion})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">Sin medicamentos prescritos.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Estado y Motivo (Solo si NO está atendida para evitar duplicidad) */}
                    {status !== 'Atendida' && (
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
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-end items-center gap-3 bg-gray-50/50 dark:bg-gray-900/50">
                <button
                    onClick={goToFullHistory}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all border border-primary/20 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-xl">clinical_notes</span>
                    Ver Historial Completo
                </button>
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
