import { useEffect, useState, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import useCitas from "../../hooks/useCitas";
import AppointmentCard from "../../components/Citas/AppointmentCard";
import ViewCitaModal from "../../components/Modals/CitaModal/ViewCitaModal";
import ReagendarCitaModal from "../../components/Modals/CitaModal/ReagendarCitaModal";
import CitaDetalleMedicoModal from "../../components/Modals/CitaModal/CitaDetalleMedicoModal";
import DetalleExamenResultModal from "../../components/Modals/DetalleExamenResultModal";
import DetalleRecetaModal from "../../components/Modals/DetalleRecetaModal";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';

export default function MisCitas() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [viewingCita, setViewingCita]         = useState(null);
    const [reagendandoCita, setReagendandoCita] = useState(null);
    const [resultsCita, setResultsCita]         = useState(null);
    const [nestedResultsCita, setNestedResultsCita] = useState(null);
    const [resultsExamen, setResultsExamen]     = useState(null);
    const [resultsReceta, setResultsReceta]     = useState(null);

    // Filtros
    const [filterEspecialidad, setFilterEspecialidad]       = useState(""); // Tipo de evento (Remisión, Examen, etc)
    const [filterEspecialidadMedico, setFilterEspecialidadMedico] = useState(""); // Especialidad Médica (Pediatría, etc)
    const [filterMedico, setFilterMedico]                   = useState("");
    const [filterFecha, setFilterFecha]                     = useState("");

    const [activeTab, setActiveTab] = useState("programadas");

    const { citas, loading: loadingCitas, cancelCita, reagendarCita } = useCitas({ doc_paciente: user.documento });
    
    const [examenes, setExamenes] = useState([]);
    const [loadingExamenes, setLoadingExamenes] = useState(true);

    const fetchExamenes = async () => {
        setLoadingExamenes(true);
        try {
            const response = await api.get(`/examenes/mis-examenes?doc_paciente=${user.documento}`);
            // El interceptor devuelve response.data.data si success es true
            setExamenes(Array.isArray(response) ? response : (response.data || []));
        } catch (error) {
            console.error("Error fetching exams:", error);
        } finally {
            setLoadingExamenes(false);
        }
    };

    useEffect(() => {
        fetchExamenes();
    }, []);

    const loading = loadingCitas || loadingExamenes;

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
            'Cita'
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

    // Combinamos y filtramos
    const misServiciosActivos = useMemo(() => {
        const allServices = [
            ...(citas || []).map(c => ({ ...c, _isExamen: false })),
            ...(examenes || []).map(e => ({ ...e, _isExamen: true }))
        ];

        return allServices
            .filter(item => {
                const itemTipo = item._isExamen ? 'Examen' : 
                                (item.tipo_evento === 'remision' ? 'Remisión' : 'Cita');
                
                const matchTipo = !filterEspecialidad || itemTipo === filterEspecialidad;
                
                // Para especialidad médica solo filtramos citas
                let matchEspMedico = true;
                if (filterEspecialidadMedico) {
                    if (item._isExamen) {
                        matchEspMedico = false; // Los exámenes no tienen "especialidad médica" en este contexto
                    } else {
                        const citaEspMedico = item.medico?.especialidad?.especialidad || "Médico General";
                        matchEspMedico = citaEspMedico === filterEspecialidadMedico;
                    }
                }
                
                // Para médico solo filtramos citas
                let matchMedico = true;
                if (filterMedico) {
                    if (item._isExamen) {
                        matchMedico = false;
                    } else {
                        const doctorName = item.medico ? `Dr. ${item.medico.primer_nombre} ${item.medico.primer_apellido}` : "Por Asignar";
                        matchMedico = doctorName === filterMedico;
                    }
                }
                
                const matchFecha = !filterFecha || item.fecha === filterFecha;
                
                // Mantiene el estatus 'Cancelada' oculto
                const noCancelada = item.estado?.nombre_estado !== "Cancelada";
                
                // Dividir entre Programadas y Finalizadas
                const isFinalizada = item.estado?.nombre_estado === "Atendida";
                const matchTab = activeTab === "programadas" ? (!isFinalizada && noCancelada) : isFinalizada;

                return matchTipo && matchEspMedico && matchMedico && matchFecha && matchTab;
            })
            .sort((a, b) => {
                const dateA = a.fecha ? new Date(`${a.fecha}T${a.hora_inicio || '00:00'}`) : new Date(8640000000000000);
                const dateB = b.fecha ? new Date(`${b.fecha}T${b.hora_inicio || '00:00'}`) : new Date(8640000000000000);
                return dateB - dateA;
            });
    }, [citas, examenes, filterEspecialidad, filterEspecialidadMedico, filterMedico, filterFecha, activeTab]);

    const handleViewRemision = (r, parentCita) => {
        if (r.tipo_remision === 'examen') {
            if (r.examen && (r.examen.resultado_pdf || r.examen.id_estado === 8)) {
                setResultsExamen({ ...r.examen, _isExamen: true, cita_raw: parentCita });
            } else {
                Swal.fire({
                    title: "Pendiente",
                    text: "Los resultados de este examen aún no han sido cargados.",
                    icon: "info",
                    confirmButtonColor: "#3B82F6"
                });
            }
        } else if (r.tipo_remision === 'cita') {
            if (r.cita && (r.cita.historialDetalle || r.cita.historial_detalle)) {
                if (parentCita) {
                    setNestedResultsCita({ cita: r.cita, citaOrigen: parentCita });
                } else {
                    setResultsCita(r.cita);
                }
            } else {
                Swal.fire({
                    title: "Pendiente",
                    text: "Esta remisión aún no ha sido atendida por el especialista.",
                    icon: "info",
                    confirmButtonColor: "#3B82F6"
                });
            }
        }
    };

    const handleViewReceta = (rec, parentCita) => {
        if (rec) {
            setResultsReceta({ receta: rec, cita: parentCita });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PrincipalText
                    icon={<CalendarMonthRoundedIcon />}
                    text="Historial de Citas y Exámenes"
                    subtext="Estas son tus gestiones, incluyendo pasadas y canceladas."
                    number={misServiciosActivos.length}
                />
            </div>

            {/* Tabs de Programadas vs Finalizadas */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl w-fit drop-shadow-sm">
                <button
                    onClick={() => setActiveTab("programadas")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'programadas' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Programadas
                </button>
                <button
                    onClick={() => setActiveTab("finalizadas")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'finalizadas' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Finalizadas
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <FilterListRoundedIcon sx={{ fontSize: '1.25rem' }} />
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
                            <AutorenewRoundedIcon sx={{ fontSize: '2.5rem' }} className="animate-spin text-primary" />
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando resultados...</span>
                        </div>
                    </motion.div>
                ) : misServiciosActivos.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-center shadow-inner"
                    >
                        <div className="size-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                            <EventBusyRoundedIcon sx={{ fontSize: '2.5rem' }} className="text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {activeTab === 'programadas' ? 'Ninguna cita programada' : 'No hay citas finalizadas'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">Prueba ajustando los filtros de búsqueda para encontrar lo que necesitas o agenda una nueva cita.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {misServiciosActivos.map(item => (
                            <AppointmentCard
                                key={item._isExamen ? `exam-${item.id_examen}` : `cita-${item.id_cita}`}
                                
                                isExamen={item._isExamen}
                                requiresFasting={item.categoria_examen?.requiere_ayuno}
                                doctorName={item._isExamen 
                                    ? item.categoria_examen?.categoria 
                                    : (item.medico ? `Dr. ${item.medico.primer_nombre} ${item.medico.primer_apellido}` : "Por Asignar")
                                }
                                specialty={!item._isExamen ? (item.tipoCita?.nombre || "") : ""}
                                tipoServicio={
                                    item._isExamen ? "Examen Médico" :
                                    item.tipo_evento === 'remision' ? `Remisión` :
                                    "Cita Médica"
                                }
                                doctorSpecialty={!item._isExamen ? (item.medico?.especialidad?.especialidad || "Médico General") : ""}
                                time={item.fecha ? `${item.fecha} | ${item.hora_inicio?.slice(0, 5) || '--:--'}` : 'Sin fecha agendada | --:--'}
                                status={item.estado?.nombre_estado}
                                onView={() => {
                                    const isFinished = item.estado?.nombre_estado === "Atendida";
                                    if (isFinished) {
                                        if (item._isExamen) {
                                            setResultsExamen(item);
                                        } else {
                                            setResultsCita(item);
                                        }
                                    } else {
                                        setViewingCita(item);
                                    }
                                }}
                                onCancel={(!item._isExamen && item.tipo_evento !== 'remision' && (item.estado?.nombre_estado === "Agendada" || item.estado?.nombre_estado === "Pendiente")) ? () => cancelCita(item.id_cita) : undefined}
                                onReschedule={(!item._isExamen && (item.estado?.nombre_estado === "Agendada" || item.estado?.nombre_estado === "Pendiente")) ? () => {
                                    if (item.fecha && item.hora_inicio) {
                                        const citaDate = new Date(`${item.fecha}T${item.hora_inicio}`);
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
                                    setReagendandoCita(item);
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

            {/* Modal: Resultados Cita / Remisión (Nivel 1) */}
            <AnimatePresence>
                {resultsCita && (
                    <CitaDetalleMedicoModal
                        cita={resultsCita}
                        onClose={() => setResultsCita(null)}
                        onViewRemision={(r) => handleViewRemision(r, resultsCita)}
                        onViewReceta={(rec) => handleViewReceta(rec, resultsCita)}
                    />
                )}
            </AnimatePresence>

            {/* Modal: Resultados Cita / Remisión Anidado (Nivel 2) */}
            <AnimatePresence>
                {nestedResultsCita && (
                    <CitaDetalleMedicoModal
                        cita={nestedResultsCita.cita}
                        citaOrigen={nestedResultsCita.citaOrigen}
                        onClose={() => setNestedResultsCita(null)}
                    />
                )}
            </AnimatePresence>

            {/* Modal: Resultados Examen */}
            <AnimatePresence>
                {resultsExamen && (
                    <DetalleExamenResultModal
                        examen={resultsExamen}
                        citaOrigen={resultsExamen.cita_raw}
                        onClose={() => setResultsExamen(null)}
                    />
                )}
            </AnimatePresence>

            {/* Modal: Receta */}
            <AnimatePresence>
                {resultsReceta && (
                    <DetalleRecetaModal
                        receta={resultsReceta.receta}
                        cita={resultsReceta.cita}
                        onClose={() => setResultsReceta(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
