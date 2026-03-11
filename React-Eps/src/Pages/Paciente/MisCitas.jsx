import { useEffect, useState, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import useCitas from "../../hooks/useCitas";
import AppointmentCard from "../../components/Citas/AppointmentCard";
import ViewCitaModal from "../../components/Modals/CitaModal/ViewCitaModal";
import ReagendarCitaModal from "../../components/Modals/CitaModal/ReagendarCitaModal";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";

export default function MisCitas() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [viewingCita, setViewingCita]         = useState(null);
    const [reagendandoCita, setReagendandoCita] = useState(null);

    // Obtenemos solo las citas de este paciente mediante el filtro de servidor
    const { citas, loading, cancelCita, reagendarCita } = useCitas({ doc_paciente: user.documento });

    useEffect(() => {
        setTitle("Mis Citas");
        setSubtitle("Gestiona tus citas médicas agendadas.");
    }, [setTitle, setSubtitle]);

    // Filtramos y ordenamos las citas por proximidad
    const misCitasActivas = useMemo(() => {
        if (!citas) return [];
        return citas
            .filter(c =>
                c.estado?.nombre_estado === "Agendada" ||
                c.estado?.nombre_estado === "Pendiente" ||
                c.estado?.nombre_estado === "Confirmada"
            )
            .sort((a, b) => {
                const dateTimeA = new Date(`${a.fecha}T${a.hora_inicio}`);
                const dateTimeB = new Date(`${b.fecha}T${b.hora_inicio}`);
                return dateTimeA - dateTimeB;
            });
    }, [citas]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PrincipalText
                    icon="calendar_month"
                    text="Próximas Citas"
                    subtext="Estas son tus citas pendientes por atención."
                    number={misCitasActivas.length}
                />
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex justify-center p-20"
                    >
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
                    </motion.div>
                ) : misCitasActivas.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-20 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center"
                    >
                        <div className="size-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-gray-300">event_note</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes citas pendientes</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">Parece que no tienes citas agendadas para los próximos días. ¡Agenda una nueva cuando lo necesites!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {misCitasActivas.map(cita => (
                            <AppointmentCard
                                key={cita.id_cita}
                                patientName={`${cita.paciente?.primer_nombre} ${cita.paciente?.primer_apellido}`}
                                doctorName={`Dr. ${cita.medico?.primer_nombre} ${cita.medico?.primer_apellido}`}
                                specialty={cita.tipoCita?.tipo || "Consulta General"}
                                time={`${cita.fecha} | ${cita.hora_inicio?.slice(0, 5)}`}
                                status={cita.estado?.nombre_estado}
                                onView={() => setViewingCita(cita)}
                                onCancel={() => cancelCita(cita.id_cita)}
                                onReschedule={() => setReagendandoCita(cita)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal: Ver detalle */}
            <ViewCitaModal
                isOpen={!!viewingCita}
                onClose={() => setViewingCita(null)}
                cita={viewingCita}
            />

            {/* Modal: Reagendar */}
            <ReagendarCitaModal
                isOpen={!!reagendandoCita}
                onClose={() => setReagendandoCita(null)}
                cita={reagendandoCita}
                onConfirm={reagendarCita}
                loading={loading}
            />
        </div>
    );
}
