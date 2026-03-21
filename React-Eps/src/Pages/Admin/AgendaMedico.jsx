import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import DoctorInfo from "../../components/DoctorSchedule/DoctorInfo";
import ScheduleTable from "../../components/DoctorSchedule/ScheduleTable";
import CalendarSelector from "../../components/Medico/CalendarSelector";
import useCitas from "../../hooks/useCitas";
import ViewCitaModal from "../../components/Modals/CitaModal/ViewCitaModal";

import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../Api/axios";

/**
 * Formatea una fecha YYYY-MM-DD al locale español sin problemas de timezone.
 */
function formatDateLabel(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

export default function AgendaMedico() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const { doc } = useParams(); // Documento del médico desde la URL
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [viewingCita, setViewingCita] = useState(null);

    const { citas, loading: loadingCitas } = useCitas({
        fecha: selectedDate,
        doc_medico: doc,
    });

    useEffect(() => {
        setTitle("Agenda del Médico");
        setSubtitle("Visualización de citas y consultas programadas");

        setHelpContent({
            title: "Agenda de Médico (Admin)",
            description: "Esta vista te permite visualizar detalladamente el cronograma de este médico para la fecha seleccionada.",
            sections: [
                {
                    title: "Información General",
                    type: "list",
                    items: [
                        "Puedes revisar las citas agendadas, atendidas y canceladas.",
                        "No es posible atender pacientes ni marcar inasistencias desde este panel (función exclusiva del médico).",
                        "Usa el calendario lateral para navegar entre diferentes días."
                    ]
                }
            ]
        });

        const fetchDoctorInfo = async () => {
            try {
                setLoadingUser(true);
                const fetchedUser = await api.get(`/usuario/${doc}`);
                setUser(fetchedUser);
            } catch (error) {
                console.error("Error al cargar la información del médico:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        if (doc) {
            fetchDoctorInfo();
        }

        return () => setHelpContent(null);
    }, [doc, setTitle, setSubtitle, setHelpContent]);

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            {/* ── Botón Volver ────────────────────────────────────────── */}
            <button
                onClick={() => navigate('/usuarios/medicos')}
                className="flex items-center w-fit gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-2 font-medium"
            >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                Volver a Médicos
            </button>

            {/* ── Tarjeta del médico ─────────────────────────────────────── */}
            {loadingUser ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-28 rounded-2xl"></div>
            ) : user ? (
                <DoctorInfo
                    name={`${user.primer_nombre ?? ''} ${user.primer_apellido ?? ''}`}
                    specialty={user.especialidad?.especialidad ?? "Especialista"}
                    office={user.consultorio?.numero_consultorio ? `Consultorio ${user.consultorio.numero_consultorio}` : "Sin Consultorio"}
                    status={user.id_estado === 1 ? "ACTIVO" : "INACTIVO"}
                />
            ) : (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">Médico no encontrado</div>
            )}

            {/* ── Layout: [Citas] + [Calendario] ────────────────────────── */}
            <div className="flex flex-col xl:flex-row gap-6 items-start">

                {/* ── Columna izquierda: lista de citas (flex-1) ─────────── */}
                <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden w-full">

                    {/* Header del panel */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                        <PrincipalText
                            icon={isToday ? "today" : "calendar_today"}
                            text={
                                isToday
                                    ? `Hoy — ${formatDateLabel(selectedDate)}`
                                    : formatDateLabel(selectedDate)
                            }
                            number={citas.length}
                        />

                        {/* Botón regresar a hoy */}
                        {!isToday && (
                            <button
                                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 px-3 py-2 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer whitespace-nowrap"
                            >
                                <span className="material-symbols-outlined text-base">today</span>
                                Volver a hoy
                            </button>
                        )}
                    </div>

                    {/* Tabla de citas con animación */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {loadingCitas ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <TableSkeleton rows={5} columns={5} />
                                </motion.div>
                            ) : citas.length === 0 ? (
                                <motion.div
                                    key={`empty-${selectedDate}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800"
                                >
                                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                                        event_busy
                                    </span>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">
                                        {isToday
                                            ? "No hay citas agendadas para hoy."
                                            : `Sin citas el ${formatDateLabel(selectedDate)}.`
                                        }
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`table-${selectedDate}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ScheduleTable
                                        appointments={citas}
                                        onView={(cita) => setViewingCita(cita)}
                                        // onAtender y onNoAsistio NO se envían, la tabla los ocultará automáticamente
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Columna derecha: calendario (w-72 fijo en desktop) ──── */}
                <div className="w-full xl:w-72 shrink-0">
                    <CalendarSelector
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                </div>
            </div>

            {/* ── Modales ────────────────────────────────────────────────── */}
            {viewingCita && (
                <ViewCitaModal
                    isOpen={!!viewingCita}
                    onClose={() => setViewingCita(null)}
                    cita={viewingCita}
                />
            )}
        </div>
    );
}
