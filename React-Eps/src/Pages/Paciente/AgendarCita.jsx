import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import useMedicosDisponibles from "../../hooks/useMedicosDisponibles";
import useEspecialidades from "../../hooks/useEspecialidades";
import useCitas from "../../hooks/useCitas";
import CalendarAgenda from "../../components/Citas/CalendarAgenda";
import PrincipalText from "../../components/Users/PrincipalText";
import BlueButton from "../../components/UI/BlueButton";
import dayjs from "dayjs";
import api from "../../Api/axios";
import SearchableSelect from "../../components/UI/SearchableSelect";
import { motion, AnimatePresence } from "framer-motion";
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import PersonOffRoundedIcon from '@mui/icons-material/PersonOffRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';

const STEPS = [
    { id: 1, title: "Servicio y Motivo", icon: <MedicalServicesRoundedIcon /> },
    { id: 2, title: "Fecha", icon: <TodayRoundedIcon /> },
    { id: 3, title: "Hora", icon: <ScheduleRoundedIcon /> },
    { id: 4, title: "Médico", icon: <MedicalServicesRoundedIcon /> },
    { id: 5, title: "Confirmar", icon: <CheckCircleRoundedIcon /> },
];

export default function AgendarCita() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
    const [selectedMotivoId, setSelectedMotivoId] = useState("");
    const [motivosList, setMotivosList] = useState([]);
    const [motivo, setMotivo] = useState("");
    const [errors, setErrors] = useState({});

    // Cargar especialidades (solo las de acceso directo)
    const { specialties: especialidades, loading: loadingEspecialidades } = useEspecialidades({ acceso_directo: true });

    // Encontrar la especialidad seleccionada (para labels en resumen)
    const selectedEspecialidadObj = useMemo(() => 
        especialidades.find(e => String(e.value) === String(selectedEspecialidad)),
    [especialidades, selectedEspecialidad]);

    const id_especialidad = selectedEspecialidad || null;

    // Cargar médicos basados en fecha, hora Y especialidad
    const { medicos: medicosDisponibles, loading: loadingMedicos } = useMedicosDisponibles(selectedDate, selectedTime, id_especialidad);
    
    // Hook de citas (solo para mutación)
    const { createCita, loading: creating } = useCitas({ enabled: false });

    useEffect(() => {
        setTitle("Reserva tu Cita");
        setSubtitle("Sigue los pasos para agendar tu espacio con nuestros especialistas.");

        // Ayuda contextual detallada
        setHelpContent({
            title: "Guía de Agendamiento",
            description: "Aprende cómo programar tu cita de manera rápida y segura.",
            sections: [
                {
                    title: "Paso 1: Especialidad",
                    type: "text",
                    content: "Selecciona el motivo de tu consulta. Recuerda que solo aparecen las especialidades de acceso directo. Para otras, debes ser remitido por un médico general."
                },
                {
                    title: "Paso 2 y 3: Fecha y Hora",
                    type: "text",
                    content: "Elige el día en el calendario y luego la hora que mejor te acomode. Solo verás horarios disponibles en tiempo real."
                },
                {
                    title: "Paso 4: Profesionales",
                    type: "tip",
                    content: "Ahora verás a los médicos que atienden la especialidad elegida y están libres en ese horario. Puedes elegir a tu profesional de preferencia."
                },
                {
                    title: "Importante",
                    type: "warning",
                    content: "Si cancelas una cita con menos de 2 horas de antelación, podría haber cargos administrativos según el reglamento de la EPS."
                }
            ]
        });

        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    // Obtener motivos de consulta
    useEffect(() => {
        api.get('/motivos-consulta')
           .then(res => setMotivosList(res.data || res))
           .catch(err => console.error("Error cargando motivos", err));
    }, []);

    // Generación de horarios disponibles
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

    const handleConfirm = async () => {
        const data = {
            doc_paciente: String(user.documento || ""),
            doc_medico: String(selectedDoctor || ""),
            id_especialidad: Number(selectedEspecialidad),
            id_motivo: Number(selectedMotivoId),
            fecha: selectedDate,
            hora_inicio: selectedTime,
            motivo: motivo
        };

        const success = await createCita(data);
        if (success) {
            navigate("/paciente/citas");
        }
    };

    const nextStep = () => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!selectedEspecialidad) newErrors.especialidad = "Selecciona una especialidad";
            if (!selectedMotivoId) newErrors.selectedMotivoId = "Selecciona un motivo principal";
            else if (String(selectedMotivoId) === "51" && !motivo.trim()) {
                newErrors.motivo = "Por favor, especifica el motivo en los detalles adicionales";
            }
        }
        if (currentStep === 2 && !selectedDate) newErrors.date = "Selecciona una fecha";
        if (currentStep === 3 && !selectedTime) newErrors.time = "Selecciona una hora";
        if (currentStep === 4 && !selectedDoctor) newErrors.doctor = "Selecciona un médico";

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

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-10">
            {/* Barra de Progreso */}
            <div className="px-2">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-3 px-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Paso {currentStep} de 5</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {STEPS[currentStep - 1].title}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-neutral-gray-border/10 min-h-[450px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col h-full"
                    >
                        {/* PASO 1: Tipo de Cita y Motivo */}
                        {currentStep === 1 && (
                            <div className="space-y-8 grow">
                                <div className="space-y-4">
                                    <PrincipalText icon={<MedicalServicesRoundedIcon />} text="¿Qué tipo de atención necesitas?" />
                                    <div className="grid grid-cols-1 gap-3">
                                        {loadingEspecialidades ? (
                                            <div className="py-10 text-center animate-pulse text-gray-400 text-xs font-bold uppercase tracking-widest">Cargando servicios...</div>
                                        ) : (
                                            especialidades.map(esp => (
                                                <button
                                                    key={esp.value}
                                                    onClick={() => {
                                                        setSelectedEspecialidad(esp.value);
                                                        setErrors(prev => ({ ...prev, especialidad: undefined }));
                                                    }}
                                                    className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center gap-4 ${selectedEspecialidad == esp.value
                                                        ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-[1.01]'
                                                        : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-primary/40'
                                                    }`}
                                                >
                                                    <div className={`size-10 rounded-xl flex items-center justify-center ${selectedEspecialidad == esp.value ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                                        <HealthAndSafetyRoundedIcon sx={{ fontSize: '1.25rem' }} />
                                                    </div>
                                                    <div className="grow">
                                                        <p className={`font-black text-sm ${selectedEspecialidad == esp.value ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                                            {esp.label}
                                                        </p>
                                                        <p className={`text-[10px] font-bold uppercase ${selectedEspecialidad == esp.value ? 'text-white/70' : 'text-gray-400'}`}>
                                                            Acceso Directo
                                                        </p>
                                                    </div>
                                                    {selectedEspecialidad == esp.value && <CheckCircleRoundedIcon className="text-white" />}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    {errors.especialidad && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{errors.especialidad}</p>}
                                </div>

                                <div className="space-y-4 pb-4">
                                    <PrincipalText icon={<DescriptionRoundedIcon />} text="¿Cuál es el motivo de tu consulta?" />
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Motivo Principal</label>
                                        <SearchableSelect 
                                            options={motivosList}
                                            value={selectedMotivoId}
                                            onChange={(val) => {
                                                setSelectedMotivoId(val);
                                                setErrors(prev => ({ ...prev, selectedMotivoId: undefined }));
                                            }}
                                            placeholder="Busca o selecciona un motivo..."
                                        />
                                        {errors.selectedMotivoId && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest mt-1">{errors.selectedMotivoId}</p>}
                                    </div>

                                    <div className="space-y-1 mt-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Detalles Adicionales {String(selectedMotivoId) === "51" ? <span className="text-red-500">*</span> : "(Opcional)"}</label>
                                        <textarea
                                            className={`w-full p-5 rounded-3xl bg-gray-50 dark:bg-gray-800 border ${errors.motivo ? 'border-red-500 ring-2 ring-red-500/20' : 'border-transparent'} focus:ring-2 focus:ring-primary dark:text-white h-24 transition-all resize-none text-sm leading-relaxed`}
                                            placeholder="Detalla brevemente los síntomas o razones de la visita..."
                                            value={motivo}
                                            onChange={(e) => {
                                                setMotivo(e.target.value);
                                                if (errors.motivo) setErrors(prev => ({ ...prev, motivo: undefined }));
                                            }}
                                        />
                                        {errors.motivo && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest mt-1">{errors.motivo}</p>}
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <BlueButton text="Continuar" icon="arrow_forward" onClick={nextStep} />
                                </div>
                            </div>
                        )}

                        {/* PASO 2: Calendario */}
                        {currentStep === 2 && (
                            <div className="space-y-6 grow">
                                <PrincipalText icon={<TodayRoundedIcon />} text="¿Cuándo deseas asistir?" />
                                <div className="max-w-[320px] mx-auto scale-95 origin-top">
                                    <CalendarAgenda
                                        selectedDate={selectedDate}
                                        onDateSelect={(d) => {
                                            setSelectedDate(d);
                                            setSelectedTime("");
                                            setErrors({});
                                            setCurrentStep(3);
                                        }}
                                    />
                                </div>
                                {errors.date && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{errors.date}</p>}
                            </div>
                        )}

                        {/* PASO 3: Horas */}
                        {currentStep === 3 && (
                            <div className="space-y-6 grow">
                                <PrincipalText icon={<ScheduleRoundedIcon />} text="Selecciona el horario" />
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {timeOptions.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => {
                                                setSelectedTime(time);
                                                setErrors({});
                                                setCurrentStep(4);
                                            }}
                                            className={`p-4 rounded-2xl text-sm font-bold transition-all border ${selectedTime === time
                                                ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30'
                                                : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300 hover:border-primary/50'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                    {timeOptions.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-gray-400 italic">No hay disponibilidad para este día.</div>
                                    )}
                                </div>
                                {errors.time && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{errors.time}</p>}
                            </div>
                        )}

                        {/* PASO 4: Médicos */}
                        {currentStep === 4 && (
                            <div className="space-y-6 grow">
                                <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-4">
                                    <PrincipalText icon={<MedicalServicesRoundedIcon />} text="Médicos Disponibles" />
                                    <p className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
                                        {selectedEspecialidadObj?.label || 'Especialidad'}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {loadingMedicos ? (
                                        <div className="flex flex-col items-center py-16 gap-4">
                                            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Buscando especialistas...</p>
                                        </div>
                                    ) : (
                                        medicosDisponibles.filter(m => m.documento || m.value).length > 0 ? (
                                            medicosDisponibles.filter(m => m.documento || m.value).map(m => (
                                                <button
                                                    key={m.documento || m.value}
                                                    onClick={() => {
                                                        setSelectedDoctor(m.documento || m.value);
                                                        setErrors({});
                                                        setCurrentStep(5);
                                                    }}
                                                    className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center gap-4 ${selectedDoctor == (m.documento || m.value)
                                                        ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.01]'
                                                        : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-primary/40'
                                                    }`}
                                                >
                                                    <div className={`size-12 rounded-xl flex items-center justify-center ${selectedDoctor == (m.documento || m.value) ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                                        <PersonSearchRoundedIcon sx={{ fontSize: '1.5rem' }} />
                                                    </div>
                                                    <div className="grow">
                                                        <p className={`font-black text-sm ${selectedDoctor == (m.documento || m.value) ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                                            Dr. {m.primer_nombre} {m.primer_apellido}
                                                        </p>
                                                        <p className={`text-[10px] font-bold uppercase ${selectedDoctor == (m.documento || m.value) ? 'text-white/70' : 'text-gray-400'}`}>
                                                            {m.especialidad?.especialidad || selectedEspecialidadObj?.label || 'Profesional de Salud'}
                                                        </p>
                                                    </div>
                                                    {selectedDoctor == (m.documento || m.value) && <CheckCircleRoundedIcon className="text-white" />}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center py-16 space-y-3">
                                                <PersonOffRoundedIcon sx={{ fontSize: '2.5rem' }} className="text-gray-200" />
                                                <p className="text-gray-500 text-sm font-medium">No hay profesionales disponibles para esta especialidad en la hora seleccionada.</p>
                                                <p className="text-primary text-[10px] font-black uppercase tracking-widest cursor-pointer" onClick={prevStep}>Volver y elegir otra hora</p>
                                            </div>
                                        )
                                    )}
                                </div>
                                {errors.doctor && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{errors.doctor}</p>}
                            </div>
                        )}

                        {/* PASO 5: Confirmación Final */}
                        {currentStep === 5 && (
                            <div className="space-y-6 grow">
                                <PrincipalText icon={<CheckCircleRoundedIcon />} text="Verifica los detalles" />
                                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-4xl border border-gray-100 dark:border-gray-800 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                                            <EventRoundedIcon sx={{ fontSize: '1.5rem' }} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Cita Programada</p>
                                            <p className="font-black text-gray-900 dark:text-white capitalize text-lg">
                                                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </p>
                                            <p className="text-sm font-bold text-gray-500">A las {selectedTime} horas</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 bg-white dark:bg-gray-900 text-primary border border-primary/20 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                            <MedicalServicesRoundedIcon sx={{ fontSize: '1.5rem' }} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Profesional y Servicio</p>
                                            <p className="font-black text-gray-900 dark:text-white text-lg leading-tight">
                                                Dr. {medicosDisponibles.find(m => (m.documento || m.value) == selectedDoctor)?.primer_nombre} {medicosDisponibles.find(m => (m.documento || m.value) == selectedDoctor)?.primer_apellido}
                                            </p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                                                {medicosDisponibles.find(m => (m.documento || m.value) == selectedDoctor)?.especialidad?.especialidad || 'Especialista'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <BlueButton text="Agendar Cita Ahora" icon="check_circle" loading={creating} onClick={handleConfirm} />
                                </div>
                            </div>
                        )}

                        {/* Botón Volver */}
                        {currentStep > 1 && (
                            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-start">
                                <button
                                    onClick={prevStep}
                                    className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    <ArrowBackRoundedIcon sx={{ fontSize: '1.125rem' }} className="transition-transform group-hover:-translate-x-1" />
                                    Volver atrás
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

