import { useEffect, useState, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import useCitas from "../../hooks/useCitas";
import AppointmentCard from "../../components/Citas/AppointmentCard";
import ViewCitaModal from "../../components/Modals/CitaModal/ViewCitaModal";
import ReagendarCitaModal from "../../components/Modals/CitaModal/ReagendarCitaModal";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";

export default function MisCitas() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [viewingCita, setViewingCita]         = useState(null);
    const [reagendandoCita, setReagendandoCita] = useState(null);

    // Filtros
    const [filterEspecialidad, setFilterEspecialidad]       = useState(""); // Tipo de evento (Remisión, Examen, etc)
    const [filterEspecialidadMedico, setFilterEspecialidadMedico] = useState(""); // Especialidad Médica (Pediatría, etc)
    const [filterMedico, setFilterMedico]                   = useState("");
    const [filterFecha, setFilterFecha]                     = useState("");

    // Obtenemos solo las citas de este paciente mediante el filtro de servidor
    const { citas, loading, cancelCita, reagendarCita } = useCitas({ doc_paciente: user.documento });

    useEffect(() => {
        setTitle("Citas y Exámenes");
        setSubtitle("Gestiona tus citas médicas y exámenes clínicos agendados.");
        setHelpContent({
            title: "Gestión de Citas Pendientes",
            description: "En esta vista puedes ver todas tus citas agendadas, cancelarlas o solicitar una reprogramación.",
            sections: [
                {
                    title: "Visualizar Cita",
                    type: "text",
                    content: "Haz clic en 'Ver Detalles' en una tarjeta para ver la información completa del médico, horario y especialidad de la cita."
                },
                {
                    title: "Cancelar o Reagendar",
                    type: "warning",
                    content: "Puedes cancelar o reagendar cualquier cita utilizando los botones de acción en la tarjeta. Ten en cuenta que la reprogramación requiere buscar un nuevo horario disponible y las cancelaciones de última hora pueden generar amonestaciones según el reglamento interno de la EPS."
                }
            ]
        });
        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    // Opciones para los filtros
    const tiposEvento = useMemo(() => {
        if (!citas) return [];
        const types = citas.map(c => 
            c.tipo_evento === 'remision' ? 'Remisión' :
            c.tipo_evento === 'examen' ? 'Examen' :
            (c.tipoCita?.tipo || "Consulta General")
        );
        return [...new Set(types)].sort();
    }, [citas]);

    const especialidadesMedicas = useMemo(() => {
        if (!citas) return [];
        const specs = citas
            .map(c => c.medico?.especialidad?.especialidad)
            .filter(Boolean);
        return [...new Set(specs)].sort();
    }, [citas]);

    const medicos = useMemo(() => {
        if (!citas) return [];
        const docs = citas
            .filter(c => c.medico)
            .map(c => `Dr. ${c.medico.primer_nombre} ${c.medico.primer_apellido}`);
        return [...new Set(docs)].sort();
    }, [citas]);

    // Mostramos todas las citas y ordenamos desde la más reciente
    const misCitasActivas = useMemo(() => {
        if (!citas) return [];
        return citas
            .filter(cita => {
                const citaTipo = cita.tipo_evento === 'remision' ? 'Remisión' :
                                cita.tipo_evento === 'examen' ? 'Examen' :
                                (cita.tipoCita?.tipo || "Consulta General");
                const matchTipo = !filterEspecialidad || citaTipo === filterEspecialidad;
                
                const citaEspMedico = cita.medico?.especialidad?.especialidad || "Médico General";
                const matchEspMedico = !filterEspecialidadMedico || citaEspMedico === filterEspecialidadMedico;
                
                const doctorName = cita.medico ? `Dr. ${cita.medico.primer_nombre} ${cita.medico.primer_apellido}` : "Por Asignar";
                const matchMedico = !filterMedico || doctorName === filterMedico;
                
                const matchFecha = !filterFecha || cita.fecha === filterFecha;

                return matchTipo && matchEspMedico && matchMedico && matchFecha;
            })
            .sort((a, b) => {
                const dateA = a.fecha ? new Date(`${a.fecha}T${a.hora_inicio || '00:00'}`) : new Date(8640000000000000); // Mueve a futuro lejano si no tiene fecha
                const dateB = b.fecha ? new Date(`${b.fecha}T${b.hora_inicio || '00:00'}`) : new Date(8640000000000000);
                // Orden descendente (más recientes o futuras primero)
                return dateB - dateA;
            });
    }, [citas, filterEspecialidad, filterEspecialidadMedico, filterMedico, filterFecha]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PrincipalText
                    icon="calendar_month"
                    text="Historial de Citas y Exámenes"
                    subtext="Estas son tus gestiones, incluyendo pasadas y canceladas."
                    number={misCitasActivas.length}
                />
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-xl">filter_list</span>
                    <span className="text-xs font-black uppercase tracking-widest">Filtros de búsqueda</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Tipo de Servicio</label>
                        <select 
                            value={filterEspecialidad}
                            onChange={(e) => setFilterEspecialidad(e.target.value)}
                            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        >
                            <option value="">Todos los servicios</option>
                            {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Especialidad Médica</label>
                        <select 
                            value={filterEspecialidadMedico}
                            onChange={(e) => setFilterEspecialidadMedico(e.target.value)}
                            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        >
                            <option value="">Todas las especialidades</option>
                            {especialidadesMedicas.map(esp => <option key={esp} value={esp}>{esp}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Médico Tratante</label>
                        <select 
                            value={filterMedico}
                            onChange={(e) => setFilterMedico(e.target.value)}
                            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        >
                            <option value="">Todos los médicos</option>
                            {medicos.map(med => <option key={med} value={med}>{med}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Fecha de Cita</label>
                        <input 
                            type="date"
                            value={filterFecha}
                            onChange={(e) => setFilterFecha(e.target.value)}
                            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-none text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary/20 transition-all outline-none scheme-light dark:scheme-dark"
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex justify-center p-20"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando resultados...</span>
                        </div>
                    </motion.div>
                ) : misCitasActivas.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-center shadow-inner"
                    >
                        <div className="size-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-gray-200">event_busy</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron citas</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">Prueba ajustando los filtros de búsqueda para encontrar lo que necesitas.</p>
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
                                doctorName={cita.medico ? `Dr. ${cita.medico.primer_nombre} ${cita.medico.primer_apellido}` : "Por Asignar"}
                                specialty={
                                    cita.tipo_evento === 'remision' ? `Remisión` :
                                    cita.tipo_evento === 'examen' ? `Examen` :
                                    (cita.tipoCita?.tipo || "Consulta General")
                                }
                                doctorSpecialty={cita.medico?.especialidad?.especialidad}
                                time={cita.fecha ? `${cita.fecha} | ${cita.hora_inicio?.slice(0, 5) || '--:--'}` : 'Sin fecha agendada | --:--'}
                                status={cita.estado?.nombre_estado}
                                onView={() => setViewingCita(cita)}
                                onCancel={(cita.estado?.nombre_estado === "Agendada" || cita.estado?.nombre_estado === "Pendiente") ? () => cancelCita(cita.id_cita) : undefined}
                                onReschedule={(cita.estado?.nombre_estado === "Agendada" || cita.estado?.nombre_estado === "Pendiente") ? () => {
                                    if (cita.fecha && cita.hora_inicio) {
                                        const citaDate = new Date(`${cita.fecha}T${cita.hora_inicio}`);
                                        const now = new Date();
                                        const diffHours = (citaDate - now) / (1000 * 60 * 60);
                                        if (diffHours < 24) {
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Atención',
                                                text: 'No puedes reagendar una cita con menos de un día de anticipación.',
                                            });
                                            return;
                                        }
                                    }
                                    setReagendandoCita(cita);
                                } : undefined}
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
