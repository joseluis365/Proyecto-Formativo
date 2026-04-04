import MuiIcon from "@/components/UI/MuiIcon";
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import { useNavigate } from "react-router-dom";

export default function ViewCitaModal({ isOpen, onClose, cita }) {
    const navigate = useNavigate();
    if (!isOpen || !cita) return null;

    const isExamen = cita._isExamen;
    const patientName = `${cita.paciente?.primer_nombre || ''} ${cita.paciente?.primer_apellido || ''}`;
    const doctorName = cita.medico ? `Dr. ${cita.medico.primer_nombre} ${cita.medico.primer_apellido}` : "Por Asignar";
    const specialty = isExamen 
        ? cita.categoria_examen?.categoria 
        : (cita.tipo_evento === 'remision' ? `Remisión a Especialista` : (cita.tipoCita?.tipo || "Consulta General"));
    
    const status = cita.estado?.nombre_estado || "Pendiente";
    const reasonObj = cita.motivoConsulta || cita.motivo_consulta;
    const historialObj = cita.historialDetalle || cita.historial_detalle;

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

    return (
        <BaseModal>
            <ModalHeader
                title={isExamen ? "Detalles del Examen" : "Detalles de la Cita"}
                icon={isExamen ? "science" : "info"}
                onClose={onClose}
            />

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-6">
                    {/* Seccion Paciente */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="text-blue-700 dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <PersonRoundedIcon sx={{ fontSize: "1.125rem" }} />
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

                    {/* Seccion Medica / Examen */}
                    <div className={`${isExamen ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30' : 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30'} p-4 rounded-xl border`}>
                        <h3 className={`${isExamen ? 'text-indigo-700 dark:text-indigo-400' : 'text-green-700 dark:text-green-400'} font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2`}>
                            <MuiIcon name={isExamen ? 'lab_profile' : 'medical_services'} sx={{ fontSize: '1.125rem' }} />
                            {isExamen ? 'Información del Examen' : 'Información Médica'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!isExamen && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Médico Tratante</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{doctorName}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {isExamen ? 'Categoría de Examen' : 'Especialidad / Tipo Cita'}
                                </p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{specialty}</p>
                            </div>
                            {isExamen && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Requerimiento</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                        {cita.categoria_examen?.requiere_ayuno ? 'Requiere Ayuno' : 'Sin ayuno previo'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seccion Horario */}
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                        <h3 className="text-purple-700 dark:text-purple-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ScheduleRoundedIcon sx={{ fontSize: "1.125rem" }} />
                            Fecha y Horario
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Consultorio</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cita.medico?.consultorio?.numero_consultorio || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección Clínica (Solo si está finalizada) */}
                    {status === 'Atendida' && historialObj && (
                        <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                             <h3 className="text-primary dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                                <MedicalServicesRoundedIcon sx={{ fontSize: "1.125rem" }} />
                                Resultados de la Consulta
                            </h3>
                            {[
                                { label: "Motivo / Subjetivo", icon: "person_raised_hand", value: historialObj.subjetivo },
                                { label: "Diagnóstico", icon: "stethoscope", value: historialObj.diagnostico },
                                { label: "Tratamiento", icon: "medication", value: historialObj.tratamiento },
                                { label: "Observaciones", icon: "notes", value: historialObj.observaciones },
                            ].map(({ label, icon, value }) => value ? (
                                <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                        <MuiIcon name={icon} sx={{ fontSize: '0.875rem' }} /> {label}
                                    </h3>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{value}</p>
                                </div>
                            ) : null)}
                            {/* Signos Vitales */}
                            {historialObj.signos_vitales && Object.keys(historialObj.signos_vitales).length > 0 && (
                                <div className="bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100/50 dark:border-blue-900/30">
                                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <MonitorHeartRoundedIcon sx={{ fontSize: "0.875rem" }} /> Signos Vitales
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {Object.entries(historialObj.signos_vitales).map(([k, v]) => (
                                            <div key={k} className="bg-white dark:bg-gray-900 rounded-lg p-2.5 shadow-sm border border-blue-50/50 dark:border-gray-800">
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
                            {/* Enfermedades */}
                            {historialObj.enfermedades?.length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <VaccinesRoundedIcon sx={{ fontSize: "0.875rem" }} /> Enfermedades CIE-11
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {historialObj.enfermedades.map(enf => (
                                            <span key={enf.codigo_icd} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full">
                                                [{enf.codigo_icd}] {enf.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Receta */}
                            {historialObj.receta && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <MedicationRoundedIcon sx={{ fontSize: "0.875rem" }} /> Receta Médica
                                    </h3>
                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                                        {(historialObj.receta.recetaDetalles || historialObj.receta.receta_detalles)?.length > 0 ? (
                                            <ul className="list-disc pl-4 space-y-1">
                                                {(historialObj.receta.recetaDetalles || historialObj.receta.receta_detalles).map((rd, i) => (
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

                    {/* Resultados PDF para Examen */}
                    {isExamen && cita.resultado_pdf && (
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                             <h3 className="text-primary dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <PictureAsPdfRoundedIcon sx={{ fontSize: "1.125rem" }} />
                                Resultados del Examen
                            </h3>
                            <a 
                                href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${cita.resultado_pdf.replace('app/', '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl hover:bg-indigo-100 transition-colors group"
                            >
                                <div className="size-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                    <DownloadRoundedIcon />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200 group-hover:underline">Descargar Resultados (PDF)</p>
                                    <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest">Documento Oficial</p>
                                </div>
                            </a>
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
                                        {reasonObj ? `${reasonObj.motivo}${cita.motivo ? ` - ${cita.motivo}` : ''}` : (cita.motivo || "No se registraron observaciones adicionales.")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-end items-center gap-3 bg-gray-50/50 dark:bg-gray-900/50">
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
