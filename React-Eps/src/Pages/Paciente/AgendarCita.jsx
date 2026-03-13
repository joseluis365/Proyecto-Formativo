import { useEffect, useState, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import useMedicosDisponibles from "../../hooks/useMedicosDisponibles";
import useTiposCita from "../../hooks/useTiposCita";
import useCitas from "../../hooks/useCitas";
import CalendarAgenda from "../../components/Citas/CalendarAgenda";
import PrincipalText from "../../components/Users/PrincipalText";
import BlueButton from "../../components/UI/BlueButton";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
    { id: 1, title: "Fecha", icon: "today" },
    { id: 2, title: "Hora", icon: "schedule" },
    { id: 3, title: "Médico", icon: "stethoscope" },
    { id: 4, title: "Motivo", icon: "description" },
    { id: 5, title: "Confirmar", icon: "check_circle" },
];

export default function AgendarCita() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedTipoCita, setSelectedTipoCita] = useState(1);
    const [motivo, setMotivo] = useState("");

    const { medicos: medicosDisponibles, loading: loadingMedicos } = useMedicosDisponibles(selectedDate, selectedTime);
    const { tiposCita } = useTiposCita();
    const { createCita, loading: creating } = useCitas();

    useEffect(() => {
        setTitle("Reserva tu Cita");
        setSubtitle("Sigue los pasos para agendar tu espacio con nuestros especialistas.");
    }, [setTitle, setSubtitle]);

    // Generación de horarios
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
            id_tipo_cita: Number(selectedTipoCita),
            fecha: selectedDate,
            hora_inicio: selectedTime,
            motivo: motivo
        };

        const success = await createCita(data);
        if (success) {
            setSelectedDate("");
            setSelectedTime("");
            setSelectedDoctor("");
            setSelectedTipoCita(1);
            setMotivo("");
            setCurrentStep(1);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-10">

            {/* Barra de Progreso Minimalista */}
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

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-neutral-gray-border/10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="min-h-[320px] flex flex-col"
                    >
                        {/* Paso 1: Calendario Compacto */}
                        {currentStep === 1 && (
                            <div className="space-y-6 flex-grow">
                                <PrincipalText icon="today" text="¿Qué día prefieres?" />
                                <div className="max-w-[320px] mx-auto scale-90 sm:scale-100 origin-top">
                                    <CalendarAgenda
                                        selectedDate={selectedDate}
                                        onDateSelect={(d) => {
                                            setSelectedDate(d);
                                            setSelectedTime("");
                                            setSelectedDoctor("");
                                            nextStep();
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Paso 2: Horarios */}
                        {currentStep === 2 && (
                            <div className="space-y-6 flex-grow">
                                <PrincipalText icon="schedule" text="Selecciona la hora" />
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
                                    {timeOptions.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => {
                                                setSelectedTime(time);
                                                setSelectedDoctor("");
                                                nextStep();
                                            }}
                                            className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all border ${selectedTime === time
                                                ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30'
                                                : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300 hover:border-primary/50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                    {timeOptions.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-gray-400 italic font-medium">
                                            No hay turnos para este día.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Paso 3: Médicos con Jerarquía Mejorada */}
                        {currentStep === 3 && (
                            <div className="space-y-6 flex-grow">
                                <PrincipalText icon="stethoscope" text="Elige tu profesional" />
                                <div className="space-y-3">
                                    {loadingMedicos ? (
                                        <div className="flex flex-col items-center py-16 gap-4">
                                            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest animate-pulse">Cargando especialistas...</p>
                                        </div>
                                    ) : (
                                        medicosDisponibles.map(m => (
                                            <button
                                                key={m.value}
                                                onClick={() => {
                                                    setSelectedDoctor(m.value);
                                                    nextStep();
                                                }}
                                                className={`w-full p-4 md:p-5 rounded-2xl md:rounded-[1.8rem] text-left transition-all border flex items-center gap-4 group ${selectedDoctor === m.value
                                                    ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.01]'
                                                    : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-primary/40'
                                                    }`}
                                            >
                                                <div className={`size-12 md:size-14 rounded-xl flex items-center justify-center transition-colors ${selectedDoctor === m.value ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                                    <span className="material-symbols-outlined text-2xl md:text-3xl">account_circle</span>
                                                </div>
                                                <div className="flex-grow">
                                                    <p className={`font-black text-sm md:text-base tracking-tight ${selectedDoctor === m.value ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                                        {m.label.split(' - ')[0].replace(/^(Dr|Dra|Doctor|Doctora)\.?\s*/i, '').trim()}
                                                    </p>
                                                    <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] mt-0.5 ${selectedDoctor === m.value ? 'text-white/70' : 'text-primary'}`}>
                                                        Médico General
                                                    </p>
                                                </div>
                                                {selectedDoctor === m.value && (
                                                    <span className="material-symbols-outlined text-white">check_circle</span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6 flex-grow">
                                <PrincipalText icon="description" text="Añade un motivo y tipo de cita" />
                                <select
                                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:ring-2 focus:ring-primary dark:text-white transition-all text-sm mb-4"
                                    value={selectedTipoCita}
                                    onChange={(e) => setSelectedTipoCita(e.target.value)}
                                >
                                    <option value="" disabled>Seleccione tipo de cita</option>
                                    {tiposCita.map(tipo => (
                                        <option key={tipo.id_tipo_cita} value={tipo.id_tipo_cita}>
                                            {tipo.nombre_tipo_cita}
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:ring-2 focus:ring-primary dark:text-white h-44 transition-all resize-none text-sm leading-relaxed"
                                    placeholder="¿Cuál es el motivo de tu consulta?"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                />
                                <div className="pt-4">
                                    <BlueButton text="Siguiente Paso" icon="arrow_forward" onClick={nextStep} />
                                </div>
                            </div>
                        )}

                        {/* Paso 5: Confirmación */}
                        {currentStep === 5 && (
                            <div className="space-y-6 flex-grow">
                                <PrincipalText icon="verified" text="Verifica y confirma" />
                                <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                                            <span className="material-symbols-outlined">event</span>
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
                                            <span className="material-symbols-outlined">stethoscope</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Médico Responsable</p>
                                            <p className="font-black text-gray-900 dark:text-white text-lg leading-tight">
                                                {medicosDisponibles.find(m => m.value === selectedDoctor)?.label.split(' - ')[0].replace(/^(Dr|Dra|Doctor|Doctora)\.?\s*/i, '').trim()}
                                            </p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                                                {tiposCita.find(t => t.id_tipo_cita == selectedTipoCita)?.nombre_tipo_cita || 'Médico General'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <BlueButton
                                        text="Confirmar Agendamiento"
                                        icon="check_circle"
                                        loading={creating}
                                        onClick={handleConfirm}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Botón Volver */}
                        {currentStep > 1 && (
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-start">
                                <button
                                    onClick={prevStep}
                                    className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
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

