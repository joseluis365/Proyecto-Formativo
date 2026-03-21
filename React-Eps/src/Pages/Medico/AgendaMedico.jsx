import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import DoctorInfo from "../../components/DoctorSchedule/DoctorInfo";
import ScheduleTable from "../../components/DoctorSchedule/ScheduleTable";
import CalendarSelector from "../../components/Medico/CalendarSelector";
import useCitas from "../../hooks/useCitas";
import ViewCitaModal from "../../components/Modals/CitaModal/ViewCitaModal";

import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/axios";

/**
 * Formatea una fecha YYYY-MM-DD al locale español sin problemas de timezone.
 * new Date('2026-03-11') interpreta como UTC medianoche → al formatear en local
 * puede mostrar el día anterior. Usamos split para construir la fecha en local.
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
    
    // El usuario inicial viene de localStorage, pero lo refrescamos para obtener relaciones nuevas
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

    // selectedDate ahora es mutable: el calendario lateral lo controla
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [viewingCita, setViewingCita]     = useState(null);
    const navigate = useNavigate();

    // useCitas refetch automático al cambiar selectedDate (dependencia del hook)
    const { citas, loading, fetchCitas } = useCitas({
        fecha:      selectedDate,
        doc_medico: user.documento,
    });

    useEffect(() => {
        setTitle("Mi Agenda");
        setSubtitle("Gestión de citas y atención de pacientes.");

        setHelpContent({
            title: "Guía de la Agenda",
            description: "Desde aquí puedes gestionar todas tus consultas programadas.",
            sections: [
                {
                    title: "Navegación",
                    type: "text",
                    content: "Usa el calendario lateral para ver citas de otros días. El botón 'Volver a hoy' te regresa rápidamente a la fecha actual."
                },
                {
                    title: "Atención de Citas",
                    type: "steps",
                    items: [
                        "Ubica al paciente en la tabla.",
                        "Haz clic en el botón azul (atender) para iniciar la consulta.",
                        "Si el paciente no se presentó, usa el botón rojo de inasistencia."
                    ]
                },
                {
                    title: "Información Detallada",
                    type: "tip",
                    content: "Haz clic en 'Ver detalles' para conocer el historial previo del paciente y el motivo de la consulta antes de iniciar."
                }
            ]
        });

        const refreshProfile = async () => {
            try {
                const freshUser = await api.get("/me");
                if (freshUser) {
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                }
            } catch (error) {
                console.error("Error al refrescar perfil del médico", error);
            }
        };

        refreshProfile();

        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const handleNoAsistio = async (cita) => {
        const result = await Swal.fire({
            title: '¿Confirmar inasistencia?',
            text: `Se marcará la cita de ${cita.paciente?.primer_nombre} como inasistencia.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.patch(`/cita/${cita.id_cita}/no-asistio`);
                Swal.fire('Registrado', 'La inasistencia ha sido guardada.', 'success');
                fetchCitas();
            } catch (error) {
                Swal.fire('Error', error.response?.data?.message || 'No se pudo registrar.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Tarjeta del médico ─────────────────────────────────────── */}
            <DoctorInfo
                name={`${user.primer_nombre ?? ''} ${user.primer_apellido ?? ''}`}
                specialty={user.especialidad?.especialidad ?? "Especialista"}
                office={user.consultorio?.numero_consultorio ? `Consultorio ${user.consultorio.numero_consultorio}` : "Sin Consultorio"}
                status={user.id_estado === 1 ? "ACTIVO" : "INACTIVO"}
            />

            {/* ── Layout: [Citas] + [Calendario] ────────────────────────── */}
            <div className="flex flex-col xl:flex-row gap-6 items-start">

                {/* ── Columna izquierda: lista de citas (flex-1) ─────────── */}
                <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">

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
                            {loading ? (
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
                                            ? "No tienes citas agendadas para hoy."
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
                                        onAtender={(cita) => navigate(`/medico/consulta/${cita.id_cita}`)}
                                        onNoAsistio={handleNoAsistio}
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
            <ViewCitaModal
                isOpen={!!viewingCita}
                onClose={() => setViewingCita(null)}
                cita={viewingCita}
            />


        </div>
    );
}
