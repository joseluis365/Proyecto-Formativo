import PersonOffRoundedIcon from '@mui/icons-material/PersonOffRounded';
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import React, { useState, useEffect, useMemo } from 'react';
import BaseModal from '../BaseModal';
import ModalHeader from '../ModalHeader';
import BlueButton from '../../UI/BlueButton';
import SearchableSelect from '../../UI/SearchableSelect';
import PrincipalText from '../../Users/PrincipalText';
import api from '../../../Api/axios';
import useEspecialidades from '../../../hooks/useEspecialidades';
import useMedicosDisponibles from '../../../hooks/useMedicosDisponibles';
import useCitas from '../../../hooks/useCitas';
import CalendarAgenda from '../../Citas/CalendarAgenda';
import MuiIcon from '../../UI/MuiIcon';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
    { id: 1, title: "Paciente", icon: "person" },
    { id: 2, title: "Servicio", icon: "medical_services" },
    { id: 3, title: "Fecha", icon: "today" },
    { id: 4, title: "Hora", icon: "schedule" },
    { id: 5, title: "Médico", icon: "stethoscope" }
];

export default function AgendarCitaAdminModal({ isOpen, onClose, onSuccess }) {
    const [currentStep, setCurrentStep] = useState(1);
    
    // Data lists
    const [pacientes, setPacientes] = useState([]);
    const [motivosList, setMotivosList] = useState([]);
    const [loadingInit, setLoadingInit] = useState(false);

    // Form state
    const [selectedPaciente, setSelectedPaciente] = useState("");
    const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
    const [selectedMotivoId, setSelectedMotivoId] = useState("");
    const [motivo, setMotivo] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [errors, setErrors] = useState({});

    // Hooks
    const { specialties: especialidades, loading: loadingEspecialidades } = useEspecialidades({ acceso_directo: true });
    
    const { medicos: medicosDisponibles, loading: loadingMedicos } = useMedicosDisponibles(selectedDate, selectedTime, selectedEspecialidad || null);

    const { createCita, loading: creating } = useCitas({ enabled: false });

    useEffect(() => {
        if (isOpen) {
            loadInitialData();
            // Reset form
            setCurrentStep(1);
            setSelectedPaciente("");
            setSelectedEspecialidad("");
            setSelectedMotivoId("");
            setMotivo("");
            setSelectedDate("");
            setSelectedTime("");
            setSelectedDoctor("");
            setErrors({});
        }
    }, [isOpen]);

    const loadInitialData = async () => {
        setLoadingInit(true);
        try {
            const [pacientesRes, motivosRes] = await Promise.all([
                api.get('/usuarios', { params: { id_rol: 5, per_page: 1000, id_estado: 1 } }),
                api.get('/motivos-consulta')
            ]);

            const pData = pacientesRes.data?.data || pacientesRes.data || [];
            setPacientes(pData.map(p => ({
                label: `${p.documento} - ${p.primer_nombre} ${p.primer_apellido}`,
                value: String(p.documento)
            })));

            const mData = motivosRes.data || motivosRes || [];
            setMotivosList(mData.map(m => ({
                label: m.label || m.motivo,
                value: String(m.value || m.id_motivo)
            })));
        } catch (error) {
            console.error("Error loading initial data", error);
        } finally {
            setLoadingInit(false);
        }
    };

    const timeOptions = useMemo(() => {
        if (!selectedDate) return [];
        const options = [];
        const now = dayjs();
        const isToday = dayjs(selectedDate).isSame(dayjs(), 'day');

        for (let hour = 8; hour <= 16; hour++) {
            [0, 30].forEach(min => {
                const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                if (isToday) {
                    const slotTime = dayjs(`${selectedDate} ${timeStr}`, "YYYY-MM-DD HH:mm");
                    if (slotTime.isBefore(now.add(30, 'minute'))) return;
                }
                options.push(timeStr);
            });
        }
        return options;
    }, [selectedDate]);

    // Validation per step
    const nextStep = () => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!selectedPaciente) newErrors.paciente = "Debe elegir un paciente";
        }
        if (currentStep === 2) {
            if (!selectedEspecialidad) newErrors.especialidad = "Seleccione una especialidad";
            if (!selectedMotivoId) newErrors.motivo = "Seleccione un motivo principal";
            else if (String(selectedMotivoId) === "51" && !motivo.trim()) {
                newErrors.motivoExtra = "Especifique el motivo en los detalles adicionales";
            }
        }
        if (currentStep === 3) {
            if (!selectedDate) newErrors.date = "Seleccione una fecha";
        }
        if (currentStep === 4) {
            if (!selectedTime) newErrors.time = "Seleccione una hora";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setCurrentStep(prev => Math.min(prev + 1, 5));
    };

    const prevStep = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSave = async () => {
        if (!selectedDoctor) {
            setErrors({ doctor: "Debe seleccionar un médico" });
            return;
        }

        const data = {
            doc_paciente: String(selectedPaciente),
            doc_medico: String(selectedDoctor),
            id_especialidad: Number(selectedEspecialidad),
            id_motivo: Number(selectedMotivoId),
            fecha: selectedDate,
            hora_inicio: selectedTime,
            motivo: motivo
        };

        const success = await createCita(data);
        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Agendada',
                text: 'La cita ha sido creada exitosamente.',
                timer: 1500,
                showConfirmButton: false
            });
            onSuccess();
            onClose();
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    return (
        <BaseModal maxWidth="max-w-2xl">
            <ModalHeader 
                icon="event_available" 
                title="Agendamiento de Cita" 
                onClose={onClose} 
            />

            {loadingInit ? (
                <div className="flex justify-center py-20">
                    <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden min-h-[450px]">
                    
                    {/* Contenido con scroll (Pasos y Barra de Progreso) */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                        {/* Progress Bar */}
                        <div className="px-2">
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(currentStep / 5) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 px-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Paso {currentStep} de 5</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    {STEPS[currentStep - 1].title}
                                </span>
                            </div>
                        </div>

                        <div className="px-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="flex flex-col"
                                >
                                {/* PASO 1: Paciente */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <PrincipalText icon="person_search" text="Buscar Paciente" />
                                        <div className="space-y-2">
                                            <SearchableSelect 
                                                options={pacientes}
                                                value={selectedPaciente}
                                                onChange={(val) => { setSelectedPaciente(val); setErrors(prev => ({...prev, paciente: null})) }}
                                                placeholder="Busque por nombre o número de documento..."
                                            />
                                            {errors.paciente && <p className="text-red-500 text-xs font-bold text-center mt-2">{errors.paciente}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* PASO 2: Especialidad y Motivo */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <PrincipalText icon="medical_services" text="Especialidad Requerida" />
                                            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {loadingEspecialidades ? (
                                                    <div className="col-span-2 text-center text-sm py-4">Cargando...</div>
                                                ) : (
                                                    especialidades.map(esp => (
                                                        <button
                                                            key={esp.value}
                                                            onClick={() => {
                                                                setSelectedEspecialidad(esp.value);
                                                                setErrors(prev => ({ ...prev, especialidad: undefined }));
                                                            }}
                                                            className={`p-3 rounded-xl text-left border flex items-center gap-3 transition-colors ${selectedEspecialidad == esp.value
                                                                ? 'bg-primary border-primary text-white shadow-md'
                                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-700 dark:text-gray-200'
                                                            }`}
                                                        >
                                                            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${selectedEspecialidad == esp.value ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                                                                <HealthAndSafetyRoundedIcon sx={{ fontSize: "0.875rem" }} />
                                                            </div>
                                                            <span className="text-xs font-bold leading-tight">{esp.label}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                            {errors.especialidad && <p className="text-red-500 text-xs font-bold text-center mt-1">{errors.especialidad}</p>}
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <PrincipalText icon="assignment" text="Motivo de Consulta" />
                                            <SearchableSelect 
                                                options={motivosList}
                                                value={selectedMotivoId}
                                                onChange={(val) => { setSelectedMotivoId(val); setErrors(prev => ({...prev, motivo: null})) }}
                                                placeholder="Seleccione el motivo principal..."
                                            />
                                            {errors.motivo && <p className="text-red-500 text-xs font-bold text-center">{errors.motivo}</p>}

                                            <textarea
                                                className={`w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border ${errors.motivoExtra ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-700'} focus:ring-2 focus:ring-primary dark:text-white h-20 transition-all resize-none text-sm`}
                                                placeholder="Detalles adicionales o síntomas..."
                                                value={motivo}
                                                onChange={(e) => {
                                                    setMotivo(e.target.value);
                                                    setErrors(prev => ({ ...prev, motivoExtra: null }));
                                                }}
                                            />
                                            {errors.motivoExtra && <p className="text-red-500 text-xs font-bold text-center">{errors.motivoExtra}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* PASO 3: Calendario */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <PrincipalText icon="today" text="¿Para cuándo es la cita?" />
                                        <div className="max-w-[320px] mx-auto scale-95 origin-top border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm bg-gray-50 dark:bg-gray-800/50">
                                            <CalendarAgenda
                                                selectedDate={selectedDate}
                                                onDateSelect={(d) => {
                                                    setSelectedDate(d);
                                                    setSelectedTime("");
                                                    setErrors({});
                                                    setCurrentStep(4);
                                                }}
                                            />
                                        </div>
                                        {errors.date && <p className="text-red-500 text-xs font-bold text-center mt-2">{errors.date}</p>}
                                    </div>
                                )}

                                {/* PASO 4: Hora */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <PrincipalText icon="schedule" text="Horarios Disponibles" />
                                        <div className="grid grid-cols-4 gap-3 max-w-[400px] mx-auto">
                                            {timeOptions.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => {
                                                        setSelectedTime(time);
                                                        setErrors({});
                                                        setCurrentStep(5);
                                                    }}
                                                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${selectedTime === time
                                                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/30'
                                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                            {timeOptions.length === 0 && (
                                                <div className="col-span-full py-10 text-center text-gray-400 italic font-medium">No hay disponibilidad para el {selectedDate}.</div>
                                            )}
                                        </div>
                                        {errors.time && <p className="text-red-500 text-xs font-bold text-center mt-2">{errors.time}</p>}
                                    </div>
                                )}

                                {/* PASO 5: Médicos */}
                                {currentStep === 5 && (
                                    <div className="space-y-6">
                                        <PrincipalText icon="stethoscope" text="Médicos Disponibles" />
                                        <div className="space-y-3 pb-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                            {loadingMedicos ? (
                                                <div className="flex flex-col items-center py-10 gap-3">
                                                    <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Buscando especialistas...</p>
                                                </div>
                                            ) : medicosDisponibles.filter(m => m.documento || m.value).length > 0 ? (
                                                medicosDisponibles.filter(m => m.documento || m.value).map(m => (
                                                    <button
                                                        key={m.documento || m.value}
                                                        onClick={() => {
                                                            setSelectedDoctor(m.documento || m.value);
                                                            setErrors({});
                                                        }}
                                                        className={`w-full p-4 rounded-xl text-left transition-all border flex items-center gap-4 ${selectedDoctor == (m.documento || m.value)
                                                            ? 'bg-primary border-primary shadow-md text-white'
                                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-800 dark:text-gray-200'
                                                        }`}
                                                    >
                                                        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${selectedDoctor == (m.documento || m.value) ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                                                            <PersonRoundedIcon sx={{ fontSize: "1.25rem" }} />
                                                        </div>
                                                        <div className="grow">
                                                            <p className="font-bold text-sm">Dr. {m.primer_nombre} {m.primer_apellido}</p>
                                                            <p className={`text-[10px] font-bold uppercase mt-0.5 ${selectedDoctor == (m.documento || m.value) ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                {m.especialidad?.especialidad || 'Especialista'}
                                                            </p>
                                                        </div>
                                                        {selectedDoctor == (m.documento || m.value) && <CheckCircleRoundedIcon sx={{ color: 'white' }} />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-center py-10 space-y-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                                    <PersonOffRoundedIcon sx={{ fontSize: "2.25rem" }} className="text-gray-300 dark:text-gray-600" />
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium px-4">No hay profesionales disponibles para esta especialidad en la hora seleccionada.</p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.doctor && <p className="text-red-500 text-xs font-bold text-center">{errors.doctor}</p>}
                                    </div>
                                )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Footer / Controls (Fijo al final) */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                        <button
                            onClick={currentStep > 1 ? prevStep : onClose}
                            className={`flex items-center gap-2 px-4 py-2 font-black text-[11px] uppercase tracking-widest rounded-lg transition-colors ${currentStep > 1 ? 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                        >
                            <MuiIcon name={currentStep > 1 ? 'arrow_back' : 'close'} sx={{ fontSize: '1.25rem' }} />
                            {currentStep > 1 ? 'Volver' : 'Cancelar'}
                        </button>

                        {currentStep < 5 ? (
                            <BlueButton 
                                text="Siguiente" 
                                icon="arrow_forward" 
                                onClick={nextStep}
                            />
                        ) : (
                            <BlueButton 
                                text="Confirmar Cita" 
                                icon="check_circle" 
                                onClick={handleSave}
                                loading={creating}
                                disabled={!selectedDoctor || loadingMedicos}
                            />
                        )}
                    </div>
                </div>
            )}
        </BaseModal>
    );
}
