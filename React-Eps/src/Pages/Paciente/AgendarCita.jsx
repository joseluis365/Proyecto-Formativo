import { useEffect, useState, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import useEspecialidades from "../../hooks/useEspecialidades";
import useMedicosDisponibles from "../../hooks/useMedicosDisponibles";
import useCitas from "../../hooks/useCitas";
import useTiposCita from "../../hooks/useTiposCita";
import CalendarAgenda from "../../components/Citas/CalendarAgenda";
import PrincipalText from "../../components/Users/PrincipalText";
import BlueButton from "../../components/UI/BlueButton";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

export default function AgendarCita() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedTipo, setSelectedTipo] = useState("");
    const [motivo, setMotivo] = useState("");

    const { specialties } = useEspecialidades();
    const { tiposCita } = useTiposCita();
    const { medicos: medicosDisponibles, loading: loadingMedicos } = useMedicosDisponibles(selectedDate, selectedTime);
    const { createCita, loading: creating } = useCitas();

    useEffect(() => {
        setTitle("Agendar Cita");
        setSubtitle("Solicita una nueva cita médica en pocos pasos.");
    }, [setTitle, setSubtitle]);

    // Generación de horarios
    const timeOptions = useMemo(() => {
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
            doc_paciente: user.documento,
            doc_medico: selectedDoctor,
            tipo_cita_id: selectedTipo,
            fecha: selectedDate,
            hora_inicio: selectedTime,
            motivo: motivo
        };

        const success = await createCita(data);
        if (success) {
            // Reset fields
            setSelectedTime("");
            setSelectedDoctor("");
            setMotivo("");
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">

            {/* Step 1: Calendar */}
            <div className="xl:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-neutral-gray-border/10">
                    <PrincipalText icon="today" text="1. Elija la Fecha" />
                    <div className="mt-6">
                        <CalendarAgenda
                            selectedDate={selectedDate}
                            onDateSelect={(d) => {
                                setSelectedDate(d);
                                setSelectedTime("");
                                setSelectedDoctor("");
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Step 2 & 3: Details */}
            <div className="xl:col-span-8 space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-neutral-gray-border/10 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Horario */}
                        <div className="space-y-4">
                            <PrincipalText icon="schedule" text="2. Seleccione el Horario" />
                            <div className="grid grid-cols-3 gap-2">
                                {timeOptions.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => {
                                            setSelectedTime(time);
                                            setSelectedDoctor("");
                                        }}
                                        className={`p-2 rounded-xl text-sm font-bold transition-all border ${selectedTime === time
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Servicio y Médico */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <PrincipalText icon="medical_services" text="3. Tipo de Servicio" />
                                <select
                                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-primary dark:text-white"
                                    value={selectedTipo}
                                    onChange={(e) => setSelectedTipo(e.target.value)}
                                >
                                    <option value="">¿Qué servicio necesitas?</option>
                                    {tiposCita.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <PrincipalText icon="stethoscope" text="4. Médico Disponible" />
                                <AnimatePresence mode="wait">
                                    {(selectedDate && selectedTime) ? (
                                        <motion.select
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-primary dark:text-white"
                                            value={selectedDoctor}
                                            onChange={(e) => setSelectedDoctor(e.target.value)}
                                        >
                                            <option value="">{loadingMedicos ? "Cargando médicos..." : "Seleccione un médico"}</option>
                                            {medicosDisponibles.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </motion.select>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic px-4">Seleccione primero fecha y hora.</p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Motivo */}
                    <div className="space-y-4">
                        <PrincipalText icon="description" text="5. Motivo de la Cita (Opcional)" />
                        <textarea
                            className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-primary dark:text-white h-32"
                            placeholder="Describa brevemente el síntoma o motivo..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                        <div className="w-full md:w-72">
                            <BlueButton
                                text="Confirmar Agendamiento"
                                icon="check_circle"
                                disabled={!selectedDoctor || !selectedTipo || !selectedTime}
                                loading={creating}
                                onClick={handleConfirm}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
