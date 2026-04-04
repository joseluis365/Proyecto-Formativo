import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import HealingRoundedIcon from '@mui/icons-material/HealingRounded';
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarAgenda from "../../Citas/CalendarAgenda";
import PrincipalText from "../../Users/PrincipalText";
import BlueButton from "../../UI/BlueButton";
import MuiIcon from "../../UI/MuiIcon";
import dayjs from "dayjs";

/**
 * Modal wizard de 3 pasos para reagendar una cita existente.
 * Reutiliza los mismos componentes visuales de AgendarCita.jsx.
 *
 * Props:
 *  - isOpen {boolean}
 *  - onClose {function}
 *  - cita {object}        — cita actual con sus relaciones cargadas
 *  - onConfirm {function} — async (id, { fecha, hora_inicio }) => boolean
 *  - loading {boolean}
 */
export default function ReagendarCitaModal({ isOpen, onClose, cita, onConfirm, loading }) {
    const STEPS = [
        { id: 1, title: "Fecha", icon: "today" },
        { id: 2, title: "Hora", icon: "schedule" },
        { id: 3, title: "Confirmar", icon: "check_circle" },
    ];

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Resetear wizard cada vez que se abre el modal
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setSelectedDate("");
            setSelectedTime("");
        }
    }, [isOpen]);

    // Generación de horarios (mismo algoritmo que AgendarCita.jsx)
    const timeOptions = useMemo(() => {
        if (!selectedDate) return [];
        const options = [];
        const now = dayjs();
        const isToday = dayjs(selectedDate).isSame(dayjs(), "day");

        for (let hour = 8; hour <= 16; hour++) {
            [0, 30].forEach((min) => {
                const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
                if (isToday) {
                    const slotTime = dayjs(`${selectedDate} ${timeStr}`, "YYYY-MM-DD HH:mm");
                    if (slotTime.isBefore(now.add(30, "minute"))) return;
                }
                options.push(timeStr);
            });
        }
        return options;
    }, [selectedDate]);

    const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 3));
    const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

    const handleConfirm = async () => {
        const success = await onConfirm(cita.id_cita, {
            fecha: selectedDate,
            hora_inicio: selectedTime,
        });
        if (success) onClose();
    };

    if (!isOpen || !cita) return null;

    const doctorName = cita.medico
        ? `${cita.medico.primer_nombre} ${cita.medico.primer_apellido}`
        : "tu médico";

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    };

    return (
        /* Overlay */
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="overlay"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Panel */}
                    <motion.div
                        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        initial={{ scale: 0.92, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 300 } }}
                        exit={{ scale: 0.92, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Cabecera */}
                        <div className="relative bg-gradient-to-br from-primary/90 to-blue-600 px-8 pt-8 pb-10">
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-6 text-white/70 hover:text-white transition-colors"
                                aria-label="Cerrar modal"
                            >
                                <MuiIcon name="close" sx={{ fontSize: '1.5rem' }} className="text-white/70 hover:text-white" />
                            </button>

                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-2">
                                Reprogramar cita
                            </p>
                            <h2 className="text-xl font-black text-white leading-tight">
                                {doctorName}
                            </h2>
                            <p className="text-sm font-bold text-white/70 mt-1">
                                Cita actual: {cita.fecha} · {cita.hora_inicio?.slice(0, 5)}
                            </p>

                            {/* Barra de progreso */}
                            <div className="mt-6">
                                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white"
                                        animate={{ width: `${(currentStep / 3) * 100}%` }}
                                        transition={{ type: "spring", damping: 20 }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 px-0.5">
                                    {STEPS.map((s) => (
                                        <span
                                            key={s.id}
                                            className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                                                s.id <= currentStep ? "text-white" : "text-white/40"
                                            }`}
                                        >
                                            {s.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contenido del paso */}
                        <div className="px-8 py-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="min-h-[260px] flex flex-col"
                                >
                                    {/* PASO 1: Calendario */}
                                    {currentStep === 1 && (
                                        <div className="space-y-5 flex-grow">
                                            <PrincipalText icon="today" text="¿Qué día prefieres?" />
                                            <div className="max-w-[300px] mx-auto scale-90 sm:scale-100 origin-top">
                                                <CalendarAgenda
                                                    selectedDate={selectedDate}
                                                    onDateSelect={(d) => {
                                                        setSelectedDate(d);
                                                        setSelectedTime("");
                                                        nextStep();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 2: Horarios */}
                                    {currentStep === 2 && (
                                        <div className="space-y-5 flex-grow">
                                            <PrincipalText icon="schedule" text="Selecciona la hora" />
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {timeOptions.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => {
                                                            setSelectedTime(time);
                                                            nextStep();
                                                        }}
                                                        className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                                                            selectedTime === time
                                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                                                                : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300 hover:border-primary/50"
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                                {timeOptions.length === 0 && (
                                                    <div className="col-span-full py-14 text-center text-gray-400 italic font-medium text-sm">
                                                        No hay turnos disponibles para este día.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 3: Confirmación */}
                                    {currentStep === 3 && (
                                        <div className="space-y-5 flex-grow">
                                            <PrincipalText icon="verified" text="Confirma el cambio" />

                                            {/* Resumen */}
                                            <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-5">
                                                {/* Fecha anterior → nueva */}
                                                <div className="flex items-start gap-4">
                                                    <div className="size-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                                        <EventRepeatRoundedIcon sx={{ fontSize: "1.25rem" }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                                                            Cambio de fecha
                                                        </p>
                                                        <p className="text-xs text-gray-500 line-through">
                                                            {cita.fecha} · {cita.hora_inicio?.slice(0, 5)}
                                                        </p>
                                                        <p className="font-black text-gray-900 dark:text-white capitalize text-base mt-0.5">
                                                            {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-ES", {
                                                                weekday: "long",
                                                                day: "numeric",
                                                                month: "long",
                                                            })}
                                                        </p>
                                                        <p className="text-sm font-bold text-primary">A las {selectedTime} horas</p>
                                                    </div>
                                                </div>

                                                {/* Médico (no cambia) */}
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                                        <HealingRoundedIcon sx={{ fontSize: "1.25rem" }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                                                            Médico asignado
                                                        </p>
                                                        <p className="font-black text-gray-900 dark:text-white text-sm">
                                                            {doctorName}
                                                        </p>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                                                            Sin cambios
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <BlueButton
                                                    text="Confirmar Reagendamiento"
                                                    icon="check_circle"
                                                    loading={loading}
                                                    onClick={handleConfirm}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Botón Volver */}
                                    {currentStep > 1 && (
                                        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                                            <button
                                                onClick={prevStep}
                                                className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
                                            >
                                                <MuiIcon name="arrow_back" sx={{ fontSize: '1.125rem' }} className="transition-transform group-hover:-translate-x-1" />
                                                Volver atrás
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
