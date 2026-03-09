import { useEffect, useState, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import DoctorInfo from "../../components/DoctorSchedule/DoctorInfo";
import SearchBar from "../../components/DoctorSchedule/SearchBar";
import ScheduleTable from "../../components/DoctorSchedule/ScheduleTable";
import useCitas from "../../hooks/useCitas";
import ViewCitaModal from "../../components/Modals/CitaModal/ViewCitaModal";
import AtenderCitaModal from "../../components/Modals/AtenderCitaModal";
import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";

export default function AgendaMedico() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewingCita, setViewingCita] = useState(null);
    const [atendiendoCita, setAtendiendoCita] = useState(null);

    // Conexión real con el hook useCitas
    const { citas, loading, fetchCitas } = useCitas({ fecha: selectedDate });

    useEffect(() => {
        setTitle("Agenda Médica");
        setSubtitle("Gestión de citas y atención de pacientes.");
    }, [setTitle, setSubtitle]);

    // Filtrado automático por el médico autenticado
    const citasDelMedico = useMemo(() => {
        if (!citas || !user.documento) return [];
        return citas.filter(c => c.doc_medico === user.documento);
    }, [citas, user.documento]);

    return (
        <div className="space-y-8">
            {/* Información del Médico */}
            <DoctorInfo
                name={`${user.primer_nombre} ${user.primer_apellido} `}
                specialty={user.especialidad?.especialidad || "Especialista"}
                office={user.consultorio || "Consultorio 1"}
                status={user.id_estado === 1 ? "ACTIVO" : "INACTIVO"}
            />

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-neutral-gray-border/10 dark:border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <PrincipalText
                        icon="calendar_today"
                        text={`Citas de Hoy – ${new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} `}
                        number={citasDelMedico.length}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <TableSkeleton rows={5} columns={5} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {citasDelMedico.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">event_busy</span>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium font-outfit uppercase tracking-wider">No tienes citas agendadas para hoy.</p>
                                </div>
                            ) : (
                                <ScheduleTable
                                    appointments={citasDelMedico}
                                    onView={(cita) => setViewingCita(cita)}
                                    onAtender={(cita) => setAtendiendoCita(cita)}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Reutilización del Modal de Detalles */}
            <ViewCitaModal
                isOpen={!!viewingCita}
                onClose={() => setViewingCita(null)}
                cita={viewingCita}
            />

            {/* Modal de Atención Médica */}
            {atendiendoCita && (
                <AtenderCitaModal
                    isOpen={!!atendiendoCita}
                    onClose={() => setAtendiendoCita(null)}
                    cita={atendiendoCita}
                    onSuccess={fetchCitas}
                />
            )}
        </div>
    );
}
